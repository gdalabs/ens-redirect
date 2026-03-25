// ENS redirect — resolves url text record via enstate.rs public API

const ENS_API = "https://enstate.rs/n";

function htmlResponse(title: string, body: string, status: number) {
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;padding:0 20px;color:#e0e0e0;background:#1a1a2e;}
a{color:#6c9bff;}code{background:#0f3460;padding:2px 6px;border-radius:4px;}</style></head>
<body><h1>${title}</h1>${body}<p><a href="/">← Back</a></p></body></html>`,
    { status, headers: { "Content-Type": "text/html;charset=utf-8" } }
  );
}

interface EnsRecord {
  records?: { url?: string };
}

export const onRequest: PagesFunction = async (context) => {
  const pathSegments = context.params.path as string[];
  const path = pathSegments?.join("/") ?? "";

  if (!path.endsWith(".eth") || path.includes("/")) {
    return context.next();
  }

  const ensName = path;

  try {
    const res = await fetch(`${ENS_API}/${ensName}`);

    if (!res.ok) {
      return htmlResponse(
        "Resolution error",
        `<p>Could not resolve <code>${ensName}</code>. Make sure it's a valid ENS name.</p>`,
        404
      );
    }

    const data: EnsRecord = await res.json();
    const url = data.records?.url;

    if (!url) {
      return htmlResponse(
        "No URL record",
        `<p><code>${ensName}</code> does not have a <code>url</code> text record set.</p>
         <p>Set one at <a href="https://app.ens.domains/${ensName}" target="_blank">app.ens.domains</a>.</p>`,
        404
      );
    }

    try {
      new URL(url);
    } catch {
      return htmlResponse(
        "Invalid URL",
        `<p>The <code>url</code> record for <code>${ensName}</code> is not a valid URL: <code>${url}</code></p>`,
        502
      );
    }

    return Response.redirect(url, 302);
  } catch (e) {
    return htmlResponse(
      "Resolution error",
      `<p>Failed to resolve <code>${ensName}</code>: ${e instanceof Error ? e.message : "unknown error"}</p>`,
      500
    );
  }
};
