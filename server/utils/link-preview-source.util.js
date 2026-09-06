const cheerio = require("cheerio");
const {
  safeFetch,
  readBodyCapped,
  isSafeUrl,
  FETCH_TIMEOUT_MS,
} = require("./link-preview-fetch.util");

// Danh sách hardcode dành cho các site khó tính
const OEMBED_PROVIDERS = [
  {
    match: (hostname) =>
      /(^|\.)youtube\.com$/.test(hostname) || hostname === "youtu.be",
    endpoint: (url) =>
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  },
  {
    match: (hostname) => /(^|\.)vimeo\.com$/.test(hostname),
    endpoint: (url) =>
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`,
  },
  {
    match: (hostname) => /(^|\.)tiktok\.com$/.test(hostname),
    endpoint: (url) =>
      `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
  },
  {
    match: (hostname) => /(^|\.)spotify\.com$/.test(hostname),
    endpoint: (url) =>
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
  },
  {
    match: (hostname) => /(^|\.)soundcloud\.com$/.test(hostname),
    endpoint: (url) =>
      `https://soundcloud.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  },
];

const fetchOembedEndpoint = async (endpointUrl, url, fallbackSiteName) => {
  try {
    const response = await fetch(endpointUrl, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return null;

    const data = await response.json();

    if (!data.title && !data.thumbnail_url && !data.html) return null;

    return {
      url,
      title: data.title || null,
      description: data.author_name ? `${data.author_name}` : null,
      image: data.thumbnail_url || null,
      site_name: data.provider_name || fallbackSiteName,
    };
  } catch {
    return null;
  }
};

const tryKnownOembed = async (url) => {
  const hostname = new URL(url).hostname.toLowerCase();
  const provider = OEMBED_PROVIDERS.find((candidate) =>
    candidate.match(hostname),
  );
  if (!provider) return null;

  return fetchOembedEndpoint(provider.endpoint(url), url, hostname);
};

const tryDiscoveredOembed = ($, url, baseUrl) => {
  const discoveryHref = $(
    'link[type="application/json+oembed"], link[type="text/xml+oembed"]',
  ).attr("href");
  if (!discoveryHref) return null;

  let endpointUrl;
  try {
    endpointUrl = new URL(discoveryHref, baseUrl).toString();
  } catch {
    return null;
  }

  if (!isSafeUrl(endpointUrl)) return null;

  return fetchOembedEndpoint(endpointUrl, url, new URL(baseUrl).hostname);
};

const resolveMaybeRelativeUrl = (value, baseUrl) => {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return null;
  }
};

const truncate = (value, max) =>
  value && value.length > max ? `${value.slice(0, max).trim()}…` : value;

const logPreviewMiss = (url, reason) => {
  try {
    const hostname = new URL(url).hostname;
    console.warn(`[link-preview] miss: ${hostname} (${reason})`);
    // TODO: ghi vào bảng LinkPreviewMiss { hostname, reason, count, last_seen_at }
  } catch {
    // ignore malformed url
  }
};

const buildGenericFallback = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return {
      url,
      title: null,
      description: null,
      image: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      site_name: hostname,
    };
  } catch {
    return null;
  }
};

const scrapeHtmlMeta = async (url) => {
  const fetchResult = await safeFetch(url);
  if (!fetchResult) return null;

  const { response, finalUrl } = fetchResult;
  if (!(response.headers.get("content-type") || "").includes("text/html"))
    return null;

  const html = await readBodyCapped(response);
  if (!html) return null;

  const $ = cheerio.load(html);

  const discovered = await tryDiscoveredOembed($, url, finalUrl);
  if (discovered) return discovered;

  const getMeta = (property, name) =>
    $(`meta[property="${property}"]`).attr("content") ||
    $(`meta[name="${name}"]`).attr("content") ||
    null;
  const title =
    getMeta("og:title", "twitter:title") ||
    $("title").first().text().trim() ||
    null;
  const description =
    getMeta("og:description", "twitter:description") ||
    $("meta[name='description']").attr("content") ||
    null;
  const image = resolveMaybeRelativeUrl(
    getMeta("og:image", "twitter:image"),
    finalUrl,
  );

  if (!title && !description && !image) return null;

  return {
    url,
    title: truncate(title, 200),
    description: truncate(description, 300),
    image,
    site_name:
      getMeta("og:site_name", "twitter:site") || new URL(finalUrl).hostname,
  };
};

const fetchPreview = async (url) => {
  const known = await tryKnownOembed(url);
  if (known) return known;

  const scraped = await scrapeHtmlMeta(url);
  if (scraped) return scraped;

  logPreviewMiss(url, "no-usable-meta");
  return buildGenericFallback(url);
};

module.exports = { fetchPreview };
