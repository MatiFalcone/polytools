const fetch = require("node-fetch");
const Redis = require("ioredis");

// Redis instance
const redis = new Redis(process.env.REDIS_URL);

async function getPairData(pairAddress) {

  const query = `
  {
    mints(first: 20, where: {pair_in: ["${pairAddress}"]}, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
        __typename
      }
      pair {
        token0 {
          id
          symbol
          __typename
        }
        token1 {
          id
          symbol
          __typename
        }
        __typename
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
      __typename
    }
    burns(first: 20, where: {pair_in: ["${pairAddress}"]}, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
        __typename
      }
      pair {
        token0 {
          id
          symbol
          __typename
        }
        token1 {
          id
          symbol
          __typename
        }
        __typename
      }
      sender
      liquidity
      amount0
      amount1
      amountUSD
      __typename
    }
    swaps(first: 20, where: {pair_in: ["${pairAddress}"]}, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
        __typename
      }
      id
      pair {
        token0 {
          id
          symbol
          __typename
        }
        token1 {
          id
          symbol
          __typename
        }
        __typename
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
      __typename
    }
  }
`;

const url = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap03";

const opts = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.API_KEY_THE_GRAPH
    },
    body: JSON.stringify({
        query
    })
};

// Check if I have a cache value for this response
let cacheEntry = await redis.get(`pairData:${pairAddress}`);

// If we have a cache hit
if (cacheEntry) {
    cacheEntry = JSON.parse(cacheEntry);
    // return that entry
    return cacheEntry;
}

const response = await fetch(url, opts);
const data = await response.json();
// Save entry in cache for 1 minute
redis.set(`pairData:${pairAddress}`, JSON.stringify(data), "EX", 60);
return data;

}

module.exports = getPairData;

