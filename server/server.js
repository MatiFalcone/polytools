// Requires
const http = require("http");
const express = require("express");
//const expressGraphQL = require("express-graphql").graphqlHTTP;
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

// Config file
require("./config/config");

// Process ID
console.log(process.pid);

const io = new Server(server);

// All active connections go in this object
const clients = {};

/////////////////////////////
// INICIO MANEJO DE SOCKETS//
/////////////////////////////

// CONNECTION
io.on("connection", (client) => {

  const userID = getUniqueID();
  
  console.log((new Date()) + ": Received a new connection from origin " + client.id + ".");
  // You can rewrite this part of the code to accept only the requests from allowed origin
  //const connection = io.accept(null, socket.origin);
  clients[userID] = client;
  console.log("Connected: " + userID + " in " + Object.getOwnPropertyNames(clients))

  // Send initial message to client


  // DISCONNECTION
  client.on("disconnect", (reason) => {
    const disconnectedUser = userID;
    delete clients[userID];
    console.log("The client disconnected.");
  });

  // Emitir que terminé a todos los clientes
  //client.broadcast.emit("Esta es la señal SIGUSR2");

});

// LISTEN
server.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.PORT}`);

});

////////////////////////////
// INICIO API REST TOKENS //
////////////////////////////
const getTokenInfo = require("./query/token_info");
const getLastTrades = require("./query/token_last_trades");
const getCandleData = require("./query/ohlc");
const getPairData = require("./query/pair_mint_burn_swap");
const getPairInfoAt = require("./query/pair_info");
const getBlockNumber = require("./query/blocks");

// Retrieves the information of the token address specified in :token using WMATIC as quote currency
app.get("/tokenInfo", async (req, res) => {

  let tokenAddress = req.query.token;

  const tokenInfo = await getTokenInfo(tokenAddress);

  res.json({
    ok: true,
    tokenInfo
  });

});

// Retrieves the last 5 QuickSwap trades of the token address specified in :token
app.get("/lastTrades", async (req, res) => {

  let tokenAddress = req.query.token;
  let exchangeAddress = req.query.exchange;

  const tokenLastTrades = await getLastTrades(tokenAddress, exchangeAddress);

  res.json({
    ok: true,
    tokenLastTrades
  });

});

// Retrieves OHLC data 
app.get("/ohlc", async (req, res) => {

  let base = req.query.baseToken;
  let quote = req.query.quoteCurrency;
  let since = req.query.since;
  let until = req.query.until;
  let window = req.query.window;
  let limit = req.query.limit;

  const dataOHLC = await getCandleData(base, quote, since, until, window, limit);

  res.json({
    ok: true,
    dataOHLC
  });

});

// Retrieves the information of a Pair
app.get("/pairData", async (req, res) => {

  let pairAddress = req.query.pair;

  const pairData = await getPairData(pairAddress);

  res.json({
    ok: true,
    pairData
  });

});

// Retrieves the block number at the last height of the MATIC network 
app.get("/pairInfo", async (req, res) => {

  let pairAddress = req.query.pair;

  let timestamp = Math.floor(Date.now() / 1000);

  const blockData = await getBlockNumber(timestamp);

  let blockNumber = parseInt(blockData.data.blocks[0].number);
  console.log(blockNumber);

  const pairInfo = await getPairInfoAt(blockNumber, pairAddress);

  res.json({
    ok: true,
    pairInfo
  });

});