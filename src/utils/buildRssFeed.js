/**
 * Escapes special XML characters in a string.
 */
function escapeXml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Builds a valid RSS 2.0 XML string from an array of article objects.
 *
 * @param {Object} options
 * @param {string} options.title - Feed title
 * @param {string} options.description - Feed description
 * @param {string} options.link - Feed link
 * @param {Array}  options.articles - Array of { title, description, link, pubDate, source }
 * @returns {string} RSS 2.0 XML string
 */
function buildRssFeed({ title, description, link, articles }) {
  const items = articles
    .map(
      (article) => `    <item>
      <title>${escapeXml(article.title)}</title>
      <description>${escapeXml(article.description)}</description>
      <link>${escapeXml(article.link)}</link>${article.pubDate ? `\n      <pubDate>${new Date(article.pubDate).toUTCString()}</pubDate>` : ""}
      <source url="${escapeXml(article.link)}">${escapeXml(article.source)}</source>
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;
}

module.exports = { buildRssFeed, escapeXml };
