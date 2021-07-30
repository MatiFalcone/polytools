const fetch = require("node-fetch");
 
const query = `
{
    ethereum(network: bsc) {
      smartContractCalls(
        options: {asc: "block.height", limit: 2147483647}
        smartContractMethod: {is: "Contract Creation"}
        smartContractType: {is: Token}
        time: {after: "2021-06-01T00:00:00"}
      ) {
        block {
          height
        }
        smartContract {
          contractType
          address {
            address
          }
          currency {
            name
            symbol
            decimals
          }
        }
      }
    }
  }
`;

const url = "https://graphql.bitquery.io/";

const opts = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQY5wayTu6KZOqVhwqhGLGBHqQfxPTKV"
    },
    body: JSON.stringify({
        query
    })
};

async function getTokenList() {

  const response = await fetch(url, opts);
  const data = await response.json();
  return data;

}

module.exports = getTokenList;

