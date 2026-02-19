const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,

  stocks: process.env.STOCKS
    ? process.env.STOCKS.split(",").map((s) => s.trim().toLowerCase())
    : [],

  rssFeeds: process.env.RSS_FEEDS
    ? process.env.RSS_FEEDS.split(",").map((url) => url.trim())
    : [],
};

module.exports = config;
