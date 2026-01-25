export function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function waitForHttpOk(url, { timeoutMs = 120_000, intervalMs = 1000 } = {}) {
  const started = Date.now();
  while (true) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.ok) return;
    } catch {}
    if (Date.now() - started > timeoutMs) throw new Error(`Timeout waiting for ${url}`);
    await sleep(intervalMs);
  }
}

export function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function httpJson(url, { method="GET", headers={}, body } = {}) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type":"application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${method} ${url} failed: ${res.status} ${text}`);
  }
  return res.json();
}
