const fetch = require("node-fetch");
 
const query = `
{
  uniswapFactories(first: 5) {
    id
    pairCount
    totalVolumeUSD
    totalVolumeETH
  }
  tokens(first: 5) {
    id
    symbol
    name
    decimals
  }
}
`;

const url = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06";

const opts = {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query
    })
};

async function getInfo() {

  const response = await fetch(url, opts);
  const data = await response.json();
  return data;

}

module.exports = getInfo;

