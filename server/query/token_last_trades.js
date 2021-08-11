const fetch = require("node-fetch");
 
async function getLastTrades(tokenAddress) {

  const query = `
  {
    ethereum(network: matic) {
      dexTrades(
        options: {limit: 5, desc: "block.height"}
        exchangeName: {in: ["QuickSwap"]}
        baseCurrency: {is: "` + tokenAddress + `"}
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

const response = await fetch(url, opts);
const data = await response.json();
return data;

}

module.exports = getLastTrades;

