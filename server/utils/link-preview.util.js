const {
  cacheGet,
  cacheSet,
  CACHE_TTL_MS,
  NEGATIVE_CACHE_TTL_MS,
} = require("./link-preview.cache.util");
const { isSafeUrl } = require("./link-preview-fetch.util");
const { fetchPreview } = require("./link-preview-source.util");

const URL_PATTERN = /(https?:\/\/[^\s<>"'“”‘’)]+|www\.[^\s<>"'“”‘’)]+)/i;
const TRAILING_PUNCT = /[),.!?;:'"”’]+$/; // Loại bỏ dấu câu nằm cuối URL

// Lấy URL đầu tiên trong nội dung tin nhắn
const getLinkFromContent = (content) => {
  const match = content?.match(URL_PATTERN);
  if (!match) return null;

  const value = match[0].replace(TRAILING_PUNCT, "");
  return value.toLowerCase().startsWith("www.") ? `https://${value}` : value;
};

// Xóa URL khỏi nội dung tin nhắn
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

const getLinkPreview = async (content) => {
  const url = getLinkFromContent(content);
  if (!url) return null;

  const cached = cacheGet(url);
  if (cached !== undefined) return cached;

  if (!isSafeUrl(url)) {
    cacheSet(url, null, NEGATIVE_CACHE_TTL_MS);
    return null;
  }

  let preview = null;
  try {
    preview = await fetchPreview(url);
  } catch {
    preview = null;
  }

  cacheSet(url, preview, preview ? CACHE_TTL_MS : NEGATIVE_CACHE_TTL_MS);
  return preview;
};

module.exports = { getLinkFromContent, removeLinkFromContent, getLinkPreview };
