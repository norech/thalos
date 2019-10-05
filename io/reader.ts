import { MultiReader } from "https://deno.land/std@v0.4.0/io/readers.ts";
import { decode, encode } from "https://deno.land/std@v0.4.0/strings/strings.ts";

/**
 * Sync reader utility for strings
 */
export class SyncStringReader implements Deno.SyncReader {
    private offs = 0;
    private buf = new Uint8Array(encode(this.s));

    constructor(private readonly s: string) {}

    public readSync(p: Uint8Array) {
        const n = Math.min(p.byteLength, this.buf.byteLength - this.offs);
        p.set(this.buf.slice(this.offs, this.offs + n));
        this.offs += n;
        return { nread: n, eof: this.offs === this.buf.byteLength };
    }
}

/**
 * Sync reader utility for combining multiple readers
 */
export class SyncMultiReader implements Deno.SyncReader {
    private readonly readers: Deno.SyncReader[];
    private currentIndex = 0;

    constructor(...readers: Deno.SyncReader[]) {
      this.readers = readers;
    }

    public readSync(p: Uint8Array) {
        const r = this.readers[this.currentIndex];
        if (!r) {
            return { nread: 0, eof: true };
        }
        const { nread, eof } = r.readSync(p);
        if (eof) {
            this.currentIndex++;
        }
        return { nread, eof: false };
    }
}

/**
 * Reader wrapper to transform a SyncReader to a Reader.
 * Returned by `unsync()`.
 */
class UnsyncReader implements Deno.Reader {
    private readonly reader: Deno.SyncReader;

    constructor(reader: Deno.SyncReader) {
      this.reader = reader;
    }

    public async read(p: Uint8Array) {
        return this.reader.readSync(p);
    }
}

/**
 * Stringify a buffer
 * @param reader Any read buffer
 */
export async function stringify(reader: Deno.Reader | Deno.SyncReader) {
    let bytes: Uint8Array;

    if (isSync(reader)) {
        bytes = Deno.readAllSync(reader);
    } else {
        bytes = await Deno.readAll(reader);
    }

    return decode(bytes);
}

/**
 * Stringify a synchronous read buffer
 * @param reader Any synchronous read buffer
 */
export function stringifySync(reader: Deno.SyncReader) {
    const bytes = Deno.readAllSync(reader);

    return decode(bytes);
}

/**
 * Merge readers into a single reader
 */
export function merge(...readers: Array<Deno.Reader | Deno.SyncReader>) {
    const asyncReaders = readers.map((r) => {
        if (isSync(r)) {
            return unsync(r);
        }
        return r;
    });

    return new MultiReader(...asyncReaders);
}

/**
 * Make a SyncReader act like a Reader.
 */
export function unsync(reader: Deno.SyncReader): Deno.Reader {
    return new UnsyncReader(reader);
}

/**
 * Is a reader synchronous
 */
export function isSync(reader: Deno.Reader | Deno.SyncReader): reader is Deno.SyncReader {
    return ("readSync" in reader);
}

// Aliases of deno readers
export { StringReader, MultiReader } from "https://deno.land/std@v0.4.0/io/readers.ts";
