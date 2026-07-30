type PasswordRecord = {
  salt: string;
  hash: string;
  iterations: number;
};

const encoder = new TextEncoder();
const cookiePrefix = "signal_access_";
const maxAge = 60 * 60 * 8;

function bytesFromBase64(value: string) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function base64FromBytes(value: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(value)));
}

function equalBytes(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let result = 0;
  for (let index = 0; index < left.length; index += 1) {
    result |= left[index] ^ right[index];
  }
  return result === 0;
}

async function passwordMatches(password: string, record: PasswordRecord) {
  const material = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: bytesFromBase64(record.salt),
      iterations: record.iterations,
    },
    material,
    256,
  );
  return equalBytes(new Uint8Array(derived), bytesFromBase64(record.hash));
}

async function signature(slug: string, expires: number, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return base64FromBytes(
    await crypto.subtle.sign("HMAC", key, encoder.encode(`${slug}.${expires}`)),
  ).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

async function validSession(value: string | undefined, slug: string, secret: string) {
  if (!value) return false;
  const [expiresText, supplied] = value.split(".");
  const expires = Number(expiresText);
  if (!expires || expires <= Math.floor(Date.now() / 1000) || !supplied) return false;
  const expected = await signature(slug, expires, secret);
  return equalBytes(encoder.encode(supplied), encoder.encode(expected));
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] ?? character);
}

function unlockPage(error = "", status = error ? 401 : 200) {
  const message = error
    ? `<p class="error" role="alert">${escapeHtml(error)}</p>`
    : "";

  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta name="robots" content="noindex,nofollow,noarchive">
  <meta name="color-scheme" content="light dark">
  <title>Secure signal</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{color-scheme:light dark;--bg:#fff;--surface:#f2f4f7;--ink:#30343b;--action:#000;--muted:#626b77;--quiet:#9299a3;--accent:#e63e18}
    @media(prefers-color-scheme:dark){:root{--bg:#000;--surface:#0b0d10;--ink:#d1d5db;--action:#fff;--muted:#9299a3;--quiet:#626b77;--accent:#ff4b22}}
    body{min-height:100dvh;background:var(--bg);color:var(--ink);font:14px/1.5 Inter,ui-sans-serif,system-ui,sans-serif}
    main{width:100%;min-height:100dvh;padding:0 clamp(20px,4vw,44px);display:grid;grid-template-rows:72px 1fr}
    header{display:flex;align-items:center;gap:10px;color:var(--action);font-weight:500}
    .mark{width:22px;height:3px;background:var(--accent)}
    section{width:min(100%,380px);align-self:center;margin-left:clamp(0px,12vw,180px)}
    h1{color:var(--action);font-size:24px;font-weight:500;letter-spacing:-.03em}
    .error{margin-top:10px;color:var(--accent);font-size:13px}
    form{display:grid;gap:12px;margin-top:24px}
    label{color:var(--muted);font-size:12px}
    input{width:100%;height:44px;margin-top:7px;padding:0 12px;border:1px solid transparent;border-radius:6px;background:var(--surface);color:var(--action);font:inherit}
    input:hover{border-color:color-mix(in srgb,var(--ink) 22%,transparent)}
    input:focus-visible,button:focus-visible{outline:2px solid var(--action);outline-offset:2px}
    button{width:fit-content;min-height:44px;padding:0 17px;border:0;border-radius:6px;background:var(--action);color:var(--bg);font:500 13px/1 Inter,ui-sans-serif,system-ui,sans-serif}
    @media(max-width:600px){section{margin-left:0}}
  </style>
</head>
<body>
  <main>
    <header><span class="mark" aria-hidden="true"></span><span>Signal</span></header>
    <section>
      <h1>Password required</h1>
      ${message}
      <form method="post">
        <label>Password<input type="password" name="password" required autocomplete="current-password" autofocus></label>
        <button type="submit">Unlock signal</button>
      </form>
    </section>
  </main>
</body>
</html>`, {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}

export async function guardSecureSignal(
  request: Request,
  environment: {
    SIGNAL_PASSWORDS?: string;
    SIGNAL_SESSION_SECRET?: string;
  },
  secureSlugs: Set<string>,
) {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").filter(Boolean)[0];
  if (!slug || !secureSlugs.has(slug)) return null;

  const secret = environment.SIGNAL_SESSION_SECRET;
  let records: Record<string, PasswordRecord> = {};

  try {
    records = JSON.parse(environment.SIGNAL_PASSWORDS ?? "{}");
  } catch {
    return new Response("Secure signal configuration is invalid.", { status: 503 });
  }

  const record = records[slug];
  if (!secret || !record) {
    return new Response("This secure signal is not configured.", {
      status: 503,
      headers: { "cache-control": "no-store", "x-robots-tag": "noindex" },
    });
  }

  const cookieName = `${cookiePrefix}${slug.replaceAll("-", "_")}`;
  const cookieValue = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim().split("="))
    .find(([name]) => name === cookieName)
    ?.[1];
  if (await validSession(cookieValue, slug, secret)) return null;

  if (request.method === "POST") {
    const form = await request.formData();
    const password = String(form.get("password") ?? "");
    if (password.length <= 256 && await passwordMatches(password, record)) {
      const expires = Math.floor(Date.now() / 1000) + maxAge;
      const secure = url.protocol === "https:" ? "; Secure" : "";
      const cookie = `${cookieName}=${expires}.${await signature(slug, expires, secret)}; Path=/${slug}/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
      return new Response(null, {
        status: 303,
        headers: {
          location: url.pathname,
          "set-cookie": cookie,
          "cache-control": "no-store",
          "x-robots-tag": "noindex, nofollow, noarchive",
        },
      });
    }
    return unlockPage("That password didn’t work. Check it and try again.");
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405 });
  }

  const pathDepth = url.pathname.split("/").filter(Boolean).length;
  return unlockPage("", pathDepth > 1 ? 401 : 200);
}
