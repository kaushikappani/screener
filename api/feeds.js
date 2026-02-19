const { getFeeds } = require("../src/controllers/feedController");

module.exports = async function handler(req, res) {
  return getFeeds(req, res);
};
