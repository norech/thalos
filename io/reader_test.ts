import { assert } from "https://deno.land/std@v0.4.0/testing/asserts.ts";
import { runIfMain, test } from "https://deno.land/std@v0.4.0/testing/mod.ts";
import * as reader from "./reader.ts";

test(async function stringifyWithAsync() {
    const sampleReader = new reader.StringReader("Hello");
    const content = await reader.stringify(sampleReader);
    assert(content === "Hello");
});

test(async function stringifyWithSync() {
    const sampleSyncReader = new reader.SyncStringReader("World");
    const content = await reader.stringify(sampleSyncReader);
    assert(content === "World");
});

test(async function stringifySync() {
    const sampleSyncReader = new reader.SyncStringReader("World");
    const content = reader.stringifySync(sampleSyncReader);
    assert(content === "World");
});

test(async function mergeWithAsync() {
    const sampleSyncReader = new reader.StringReader("Hello");
    const sampleSyncReader1 = new reader.StringReader("World");

    const multiReader = reader.merge(sampleSyncReader, sampleSyncReader1);
    const content = await reader.stringify(multiReader);
    assert(content === "HelloWorld");
});

test(async function mergeWithSync() {
    const sampleSyncReader = new reader.SyncStringReader("Hello");
    const sampleSyncReader1 = new reader.SyncStringReader("World");

    const multiReader = reader.merge(sampleSyncReader, sampleSyncReader1);
    const content = await reader.stringify(multiReader);
    assert(content === "HelloWorld");
});

test(async function mergeWithBoth() {
    const sampleReader = new reader.StringReader("Hello");
    const sampleSyncReader = new reader.SyncStringReader("World");

    const multiReader = reader.merge(sampleReader, sampleSyncReader);
    const content = await reader.stringify(multiReader);
    assert(content === "HelloWorld");
});

test(async function isSyncWithAsync() {
    const r = new reader.StringReader("Hello");
    assert(reader.isSync(r) === false);
});

test(async function isSyncWithSync() {
    const r = new reader.SyncStringReader("Hello");
    assert(reader.isSync(r) === true);
});

// tslint:disable-next-line: whitespace
runIfMain(import.meta);
