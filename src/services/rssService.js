const Parser = require("rss-parser");

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
});

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
  const results = await Promise.allSettled(feedUrls.map(fetchFeed));

  const articles = [];
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value);
    } else {
      console.warn(`[RSS] Failed to fetch ${feedUrls[index]}: ${result.reason.message}`);
    }
  });

  return articles;
}

module.exports = { fetchFeed, fetchAllFeeds };
