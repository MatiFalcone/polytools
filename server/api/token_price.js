const Web3 = require('web3')

async function getTokenPrice (token) {

let addr;

switch(token) {
    case "BTC":
        addr = "0x007A22900a3B98143368Bd5906f8E17e9867581b";
        break;
    case "DAI":
        addr = "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046";
        break;
    case "ETH":
        addr = "0x0715A7794a1dc8e42615F059dD6e406A6594651A";
        break;
    case "MATIC":
        addr = "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada";
        break;
    default:
      // code block
      console.log(`The token ` + token + ` is not recognized`);
      return -1;
  }

const web3 = new Web3("https://polygon-mumbai.infura.io/v3/a2120af3f51d4f45bfe5f6482c324a1a");
const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
priceFeed.methods.latestRoundData().call()
    .then((roundData) => {
        // Do something with roundData
        //console.log("Latest price: ", roundData.answer)
        console.log(`The price of ` + token + ` in USD is ` + Number(roundData.answer)/100000000);
    });

}

module.exports = getTokenPrice;