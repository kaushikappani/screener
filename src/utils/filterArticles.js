/**
 * Filter articles whose title or description mentions any of the given stock names.
 * Case-insensitive substring match.
 *
 * @param {Array} articles - Array of article objects from rssService
 * @param {string[]} stockNames - Lowercased stock name strings
 * @returns {Array} Filtered articles
 */
function filterByStocks(articles, stockNames) {
  if (!stockNames || stockNames.length === 0) return articles;

  return articles.filter((article) => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return stockNames.some((stock) => text.includes(stock));
  });
}

/**
 * Sort articles by publish date, newest first.
 */
function sortByDate(articles) {
  return articles.sort((a, b) => {
    const dateA = a.pubDate ? new Date(a.pubDate) : new Date(0);
    const dateB = b.pubDate ? new Date(b.pubDate) : new Date(0);
    return dateB - dateA;
  });
}

module.exports = { filterByStocks, sortByDate };
