const config = require("./src/config");
const app = require("./src/app");

app.listen(config.port, () => {
  console.log(`[Server] Running on http://localhost:${config.port}`);
  console.log(`[Server] Stocks filter: ${config.stocks.join(", ") || "(none — returning all)"}`);
  console.log(`[Server] RSS feeds configured: ${config.rssFeeds.length}`);
});
