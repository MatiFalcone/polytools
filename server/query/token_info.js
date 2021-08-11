const fetch = require("node-fetch");
 
async function getTokenInfo(tokenAddress) {

  const query = `
{
  ethereum(network: matic) {
    dexTrades(
      options: {desc: ["block.height","tradeIndex"], limit: 1}
      exchangeName: {in: ["QuickSwap"]}
      baseCurrency: {is: "` + tokenAddress + `"}
      quoteCurrency: {is: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"}
      date: {after: "2021-07-28"}
    ) {
      transaction {
        hash
      }
      tradeIndex
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
      block {
        height
      }
      baseCurrency {
        symbol
        address
      }
      quoteCurrency {
        symbol
        address
      }
      quotePrice
    }
  }
}
`;

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

module.exports = getTokenInfo;

