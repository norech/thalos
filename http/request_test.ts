import { assert } from "https://deno.land/std@v0.4.0/testing/asserts.ts";
import { runIfMain, test } from "https://deno.land/std@v0.4.0/testing/mod.ts";
import * as request from "./request";

test(async function get() {
    const content = await request.get("https://deno.land/typedoc/index.html");
    assert(!!content);
});

test(async function post() {
    const content = await request.post("https://deno.land/typedoc/index.html", "hello");
    assert(!!content);
});

test(async function fetch() {
    const content = await request.fetch("https://deno.land/typedoc/index.html");
    assert(!!content.text());
});

// tslint:disable-next-line: whitespace
runIfMain(import.meta);
