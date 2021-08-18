const fetch = require("node-fetch");
const Redis = require("ioredis");

// Redis instance
const redis = new Redis(process.env.REDIS_URL);

async function getLastTrades(tokenAddress, exchangeAddress) {

  const query = `
  {
    ethereum(network: matic) {
      dexTrades(
        options: {limit: 10, desc: "block.height"}
        exchangeName: {in: ["${exchangeAddress}"]}
        baseCurrency: {is: "${tokenAddress}"}
      ) {
        transaction {
          hash
        }
        smartContract {
          address {
            address
          }
          contractType
          currency {
            name
          }
        }
        tradeIndex
        date {
          date
        }
        block {
          height
          timestamp {
            hour
            minute
            second
          }
        }
        buyAmount
        buyAmountInUsd: buyAmount(in: USD)
        buyCurrency {
          symbol
          address
        }
        sellAmount
        sellAmountInUsd: sellAmount(in: USD)
        sellCurrency {
          symbol
          address
        }
        sellAmountInUsd: sellAmount(in: USD)
        tradeAmount(in: USD)
        transaction {
          gasValue
          gasPrice
          gas
        }
      }
    }
  }  
`;

console.log(query);

const url = "https://graphql.bitquery.io/";

const opts = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.API_KEY
    },
    body: JSON.stringify({
        query
    })
};

// Check if I have a cache value for this response
let cacheEntry = await redis.get(`lastTrades:${tokenAddress}+${exchangeAddress}`);

// If we have a cache hit
if (cacheEntry) {
    cacheEntry = JSON.parse(cacheEntry);
    // return that entry
    return cacheEntry;
}

const response = await fetch(url, opts);
const data = await response.json();
// Save entry in cache for 5 minutes
redis.set(`lastTrades:${tokenAddress}+${exchangeAddress}`, JSON.stringify(data), "EX", 300);
return data;

}

module.exports = getLastTrades;

