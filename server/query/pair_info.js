const fetch = require("node-fetch");
const Redis = require("ioredis");

// Redis instance
const redis = new Redis(process.env.REDIS_URL);

async function getPairInfoAt(blockNumber, pairAddress) {

  const query = `
  fragment PairFields on Pair {
    id
    token0 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
      __typename
    }
    token1 {
      id
      symbol
      name
      totalLiquidity
      derivedETH
      __typename
    }
    reserve0
    reserve1
    reserveUSD
    totalSupply
    trackedReserveETH
    reserveETH
    volumeUSD
    untrackedVolumeUSD
    token0Price
    token1Price
    createdAtTimestamp
    __typename
  }
  
  query pairs {
    pairs(block: {number: ${blockNumber}}, where: {id: "${pairAddress}"}) {
      ...PairFields
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
let cacheEntry = await redis.get(`pairInfoAt:${blockNumber}+${pairAddress}`);

// If we have a cache hit
if (cacheEntry) {
    cacheEntry = JSON.parse(cacheEntry);
    // return that entry
    return cacheEntry;
}

const response = await fetch(url, opts);
const data = await response.json();
// Save entry in cache for 1 minute
redis.set(`pairInfoAt:${blockNumber}+${pairAddress}`, JSON.stringify(data), "EX", 120);
return data;

}

module.exports = getPairInfoAt;

