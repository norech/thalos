import { decode, encode } from "https://deno.land/std@v0.4.0/strings/strings.ts";

/**
 * Sync writer utility for strings
 */
export class SyncStringWriter implements Deno.SyncWriter {
    private chunks: Uint8Array[] = [];
    private byteLength: number = 0;

    private cache: string;

    constructor(private base: string = "") {
        const c = encode(base);
        this.chunks.push(c);
        this.byteLength += c.byteLength;
    }

    public writeSync(p: Uint8Array) {
        this.chunks.push(p);
        this.byteLength += p.byteLength;
        this.cache = null;
        return p.byteLength;
    }

    public toString(): string {
        if (this.cache) {
            return this.cache;
        }
        const buf = new Uint8Array(this.byteLength);
        let offs = 0;
        for (const chunk of this.chunks) {
            buf.set(chunk, offs);
            offs += chunk.byteLength;
        }
        this.cache = decode(buf);
        return this.cache;
    }
}

/**
 * Sync writer utility for combining multiple writers
 */
export class MultiWriter implements Deno.Writer {
    private readonly writers: Deno.Writer[];
    private currentIndex = 0;

    constructor(...writers: Deno.Writer[]) {
      this.writers = writers;
    }

    public async write(p: Uint8Array) {
        const w = this.writers[this.currentIndex];
        if (!w) {
            return 0;
        }
        let nwrite = await w.write(p);
        if (nwrite === 0) {
            nwrite = await this.write(p);
        }
        return nwrite;
    }
}

/**
 * Reader wrapper to transform a SyncWriter to a Writer.
 * Returned by `unsync()`.
 */
class UnsyncWriter implements Deno.Writer {
    private readonly reader: Deno.SyncWriter;

    constructor(reader: Deno.SyncWriter) {
      this.reader = reader;
    }

    public async write(p: Uint8Array) {
        return this.reader.writeSync(p);
    }
}

/**
 * Sync writer utility for combining multiple writers
 */
export class SyncMultiWriter implements Deno.SyncWriter {
    private readonly writers: Deno.SyncWriter[];
    private currentIndex = 0;

    constructor(...writers: Deno.SyncWriter[]) {
      this.writers = writers;
    }

    public writeSync(p: Uint8Array) {
        const w = this.writers[this.currentIndex];
        if (!w) {
            return 0;
        }
        let nwrite = w.writeSync(p);
        if (nwrite === 0) {
            nwrite = this.writeSync(p);
        }
        return nwrite;
    }
}

/**
 * Merge readers into a single reader
 */
export function merge(...writers: Array<Deno.Writer | Deno.SyncWriter>) {
    const asyncWriters = writers.map((w) => {
        if ("writeSync" in w) {
            return unsync(w);
        }
        return w;
    });

    return new MultiWriter(...asyncWriters);
}

/**
 * Make a SyncWriter act like a Writer.
 */
export function unsync(reader: Deno.SyncWriter): Deno.Writer {
    return new UnsyncWriter(reader);
}

/**
 * Is a reader asynchronous
 */
export function isAsync(reader: Deno.Writer | Deno.SyncWriter): reader is Deno.Writer {
    return !("writeSync" in reader);
}

// Aliases of deno readers
export { StringWriter } from "https://deno.land/std@v0.4.0/io/writers.ts";
