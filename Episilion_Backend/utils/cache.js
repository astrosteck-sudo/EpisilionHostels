const NodeCache = require("node-cache");

// Cache items for 5 minutes (300 seconds)
const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 320,
});

module.exports = cache;

//stdTTL is how long items stay in the cache.
//checkperiod is how often expired items are removed.