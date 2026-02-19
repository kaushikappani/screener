const Parser = require("rss-parser");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

const CACHE_TTL_MS = 10 * 60 * 1000;
const feedResponseCache = new Map();

function getFeedCacheKey(feedUrls) {
  return JSON.stringify([...feedUrls].sort());
}

/**
 * Fetch and parse a single RSS feed URL.
 * Returns an array of normalized article objects.
 */
async function fetchFeed(url) {
  const feed = await parser.parseURL(url);
  return (feed.items || []).map((item) => ({
    title: item.title || "",
    description: item.contentSnippet || item.content || "",
    link: item.link || "",
    pubDate: item.pubDate || item.isoDate || null,
    source: feed.title || url,
  }));
}

/**
 * Fetch multiple RSS feeds in parallel.
 * Resilient — failed feeds are skipped and logged.
 * Returns a flat array of all articles.
 */
async function fetchAllFeeds(feedUrls) {
  const cacheKey = getFeedCacheKey(feedUrls);
  const cachedEntry = feedResponseCache.get(cacheKey);

  if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
    return cachedEntry.data;
  }

  if (cachedEntry) {
    feedResponseCache.delete(cacheKey);
  }

  const results = await Promise.allSettled(feedUrls.map(fetchFeed));

  const articles = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.warn(`[RSS] Failed to fetch ${feedUrls[index]}: ${result.reason.message}`);
    }
  });

  feedResponseCache.set(cacheKey, {
    data: articles,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  return articles;
}

module.exports = { fetchFeed, fetchAllFeeds };
