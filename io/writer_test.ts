import { assert } from "https://deno.land/std@v0.4.0/testing/asserts.ts";
import { runIfMain, test } from "https://deno.land/std@v0.4.0/testing/mod.ts";
import * as writer from "./writer.ts";

test(async function isAsyncWithAsync() {
    const w = new writer.StringWriter("Hello");
    assert(writer.isSync(w) === false);
});

test(async function isAsyncWithSync() {
    const w = new writer.SyncStringWriter("Hello");
    assert(writer.isSync(w) === true);
});

// tslint:disable-next-line: whitespace
runIfMain(import.meta);
