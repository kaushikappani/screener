const config = require("../config");
const { fetchAllFeeds } = require("../services/rssService");
const { filterByStocks, sortByDate } = require("../utils/filterArticles");
const { buildRssFeed } = require("../utils/buildRssFeed");

async function getFeeds(req, res) {
  try {
    // Allow query param override: ?stocks=TCS,RELIANCE
    const stockNames = req.query.stocks
      ? req.query.stocks.split(",").map((s) => s.trim().toLowerCase())
      : config.stocks;

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
      link: `${req.protocol}://${req.get("host")}/api/feeds`,
      articles: sorted,
    });

    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    res.send(rssXml);
  } catch (err) {
    console.error("[FeedController] Error:", err.message);
    res.status(500).send("<error>Failed to fetch feeds</error>");
  }
}

module.exports = { getFeeds };
