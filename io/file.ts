const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

/**
 * Write string data to file.
 */
export async function write(file: string, data: string, options: Deno.WriteFileOptions) {
    await Deno.writeFile(file, encoder.encode(data), options);
}

/**
 * Read the file and return a string.
 */
export async function read(file: string) {
    return decoder.decode(await Deno.readFile(file));
}

/**
 * Synchronously write string data to file.
 */
export function writeSync(file: string, data: string, options: Deno.WriteFileOptions) {
    Deno.writeFileSync(file, encoder.encode(data), options);
}

/**
 * Synchronously read string data to file.
 */
export function readSync(file: string) {
    return decoder.decode(Deno.readFileSync(file));
}
