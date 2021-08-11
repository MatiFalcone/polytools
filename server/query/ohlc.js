const fetch = require("node-fetch");
 
async function getCandleData(baseToken, quoteCurrency, since, until, window, limit) {

  const query = `
  {
    ethereum(network: matic) {
      dexTrades(
        options: {asc: "timeInterval.minute", limit: ` + limit + `}
        date: {since: "` + since + `", till: "` + until + `"}
        exchangeName: {in: "QuickSwap"}
        baseCurrency: {is: "` + baseToken + `"}
        quoteCurrency: {is: "` + quoteCurrency + `"} # WMATIC
        tradeAmountUsd: {gt: 10}
      ) {
        timeInterval {
          minute(count: ` + window + `, format: "%Y-%m-%dT%H:%M:%SZ")
        }
        baseCurrency {
          symbol
          address
        }
        quoteCurrency {
          symbol
          address
        }
        tradeAmount(in: USD)
        trades: count
        quotePrice
        maximum_price: quotePrice(calculate: maximum)
        minimum_price: quotePrice(calculate: minimum)
        open_price: minimum(of: block, get: quote_price)
        close_price: maximum(of: block, get: quote_price)
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

module.exports = getCandleData;

