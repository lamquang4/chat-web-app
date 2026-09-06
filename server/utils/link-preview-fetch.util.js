const dns = require("dns").promises;
const { isIP } = require("net");

const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const MAX_REDIRECTS = 3;

const isPrivateIPv4 = (ip) => {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part)))
    return true;
  const [first, second] = parts;

  if (first === 0 || first === 10 || first === 127) return true;
  if (first === 169 && second === 254) return true;
  if (first === 172 && second >= 16 && second <= 31) return true;
  if (first === 192 && second === 168) return true;
  if (first === 100 && second >= 64 && second <= 127) return true;
  if (first >= 224) return true;

  return false;
};

const isPrivateIPv6 = (ip) => {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower.startsWith("fe80:")) return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  if (lower.startsWith("::ffff:")) {
    const mapped = lower.split(":").pop();
    if (isIP(mapped) === 4) return isPrivateIPv4(mapped);
  }
  return false;
};

const isPrivateIp = (ip) => {
  const version = isIP(ip);
  if (version === 4) return isPrivateIPv4(ip);
  if (version === 6) return isPrivateIPv6(ip);
  return true;
};

const isSafeUrl = (value) => {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;

    const hostname = url.hostname.toLowerCase();
    if (hostname === "localhost") return false;
    if (isIP(hostname)) return !isPrivateIp(hostname);

    return true;
  } catch {
    return false;
  }
};

const resolveHostSafely = async (hostname) => {
  if (isIP(hostname)) return !isPrivateIp(hostname);
  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: false });
    return (
      records.length > 0 &&
      records.every((record) => !isPrivateIp(record.address))
    );
  } catch {
    return false;
  }
};

const safeFetch = async (initialUrl) => {
  let currentUrl = initialUrl;

  for (
    let redirectCount = 0;
    redirectCount <= MAX_REDIRECTS;
    redirectCount += 1
  ) {
    if (!isSafeUrl(currentUrl)) return null;

    const { hostname } = new URL(currentUrl);
    if (!(await resolveHostSafely(hostname))) return null;

    const response = await fetch(currentUrl, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; ChatWebApp/1.0)" },
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return null;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }

    return { response, finalUrl: currentUrl };
  }

  return null;
};

const readBodyCapped = async (response) => {
  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_HTML_BYTES) return null;

  const reader = response.body?.getReader?.();
  if (!reader) return response.text();

  const decoder = new TextDecoder();
  let received = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;
    if (received > MAX_HTML_BYTES) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }

  return body;
};

module.exports = { isSafeUrl, safeFetch, readBodyCapped, FETCH_TIMEOUT_MS };
