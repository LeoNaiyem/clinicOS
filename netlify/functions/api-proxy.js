import fetch from "node-fetch";

export async function handler(event, context) {
  // Correctly remove the Netlify function prefix from the path
  const path = event.path.replace(/^\/\.netlify\/functions\/api-proxy/, "");

  const backendBase = "http://naiyem.intelsofts.com/Projects/core/core_elysianFabrics/api";
  const url = backendBase + path + (event.rawQuery ? "?" + event.rawQuery : "");

  try {
    const response = await fetch(url, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.httpMethod !== "GET" && event.httpMethod !== "HEAD" ? event.body : undefined,
    });

    const text = await response.text();

    return {
      statusCode: response.status,
      headers: {
        "content-type": response.headers.get("content-type") || "application/json",
      },
      body: text,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
