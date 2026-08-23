const cheerio = require("cheerio");

const URL_PATTERN = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/i;

const getLinkFromContent = (content) => {
  const match = content?.match(URL_PATTERN);
  if (!match) return null;

  const value = match[0].replace(/[),.!?]+$/, "");
  return value.toLowerCase().startsWith("www.") ? `https://${value}` : value;
};

const removeLinkFromContent = (content, link) => {
  if (!content || !link) return content?.trim() || null;

  const rawLink = link.replace(/^https:\/\//i, "www.");
  const contentWithoutLink = content
    .replace(link, "")
    .replace(rawLink, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  return contentWithoutLink || null;
};

const isSafeUrl = (value) => {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const hostname = url.hostname.toLowerCase();
    return !(
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "[::1]" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("169.254.") ||
      hostname.startsWith("172.16.")
    );
  } catch {
    return false;
  }
};

const getLinkPreview = async (content) => {
  const url = getLinkFromContent(content);
  if (!url || !isSafeUrl(url)) return null;

  try {
    const response = await fetch(url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; ChatWebApp/1.0)" },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;

    const html = await response.text();
    const $ = cheerio.load(html);
    const getMeta = (property, name) =>
      $(`meta[property="${property}"], meta[name="${name}"]`).attr("content") ||
      null;

    return {
      url,
      title: getMeta("og:title", "twitter:title") || $("title").text() || null,
      description:
        getMeta("og:description", "twitter:description") ||
        $("meta[name='description']").attr("content") ||
        null,
      image: getMeta("og:image", "twitter:image") || null,
      site_name:
        getMeta("og:site_name", "twitter:site") || new URL(url).hostname,
    };
  } catch {
    return {
      url,
      title: null,
      description: null,
      image: null,
      site_name: new URL(url).hostname,
    };
  }
};

module.exports = { getLinkFromContent, removeLinkFromContent, getLinkPreview };
