const config = require("../src/config");
const { fetchAllFeeds } = require("../src/services/rssService");
const { filterByStocks, sortByDate } = require("../src/utils/filterArticles");
const { buildRssFeed } = require("../src/utils/buildRssFeed");

function getHost(req) {
  if (typeof req.get === "function") {
    return req.get("host");
  }

  return req.headers?.["x-forwarded-host"] || req.headers?.host || "localhost";
}

function getProtocol(req) {
  if (req.protocol) {
    return req.protocol;
  }

  const forwardedProtocol = req.headers?.["x-forwarded-proto"];
  if (forwardedProtocol) {
    return forwardedProtocol.split(",")[0].trim();
  }

  return "https";
}

function getStocks(req) {
  const stocksQuery = req.query?.stocks;

  if (!stocksQuery) {
    return config.stocks;
  }

  return stocksQuery.split(",").map((stock) => stock.trim().toLowerCase());
}

function setContentType(res) {
  if (typeof res.set === "function") {
    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    return;
  }

  if (typeof res.setHeader === "function") {
    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  }
}

module.exports = async function handler(req, res) {
  try {
    const stockNames = getStocks(req);
    const feedUrls = config.rssFeeds;

    if (feedUrls.length === 0) {
      return res.status(400).send("<error>No RSS feed URLs configured in .env</error>");
    }

    const articles = await fetchAllFeeds(feedUrls);
    const filtered = filterByStocks(articles, stockNames);
    const sorted = sortByDate(filtered);

    const rssXml = buildRssFeed({
      title: "Stock Market Screener Feed",
      description: `Filtered stock news for: ${stockNames.join(", ").toUpperCase()}`,
      link: `${getProtocol(req)}://${getHost(req)}/api/feeds`,
      articles: sorted,
    });

    setContentType(res);
    return res.send(rssXml);
  } catch (err) {
    console.error("[FeedAPI] Error:", err.message);
    return res.status(500).send("<error>Failed to fetch feeds</error>");
  }
};
