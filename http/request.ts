/**
 * Execute a GET request and returns the page body
 * @param req The request or the URI
 */
export async function get(req: domTypes.Request | string) {
    const res = await fetch(req, {
        method: "GET",
    });

    return res.text();
}

/**
 * Execute a POST request with the provided body and returns the page body
 * @param req The request or the URI
 * @param body The body of your request
 */
export async function post(req: domTypes.Request | string, body: domTypes.BodyInit) {
    const res = await fetch(req, {
        method: "POST",
        body,
    });

    return res.text();
}

/**
 * Alias to global `fetch()`.
 */
const fetchAlias = fetch;
export { fetchAlias as fetch };
