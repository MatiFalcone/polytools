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

// Retrieves the information of the token address specified in :token using WMATIC as quote currency
app.get("/tokenInfo/:token", async (req, res) => {

  let tokenAddress = req.params.token;

  const tokenInfo = await getTokenInfo(tokenAddress);

  res.json({
    ok: true,
    tokenInfo
  });

});

// Retrieves the last 5 QuickSwap trades of the token address specified in :token
app.get("/lastTrades/:token", async (req, res) => {

  let tokenAddress = req.params.token;

  const tokenLastTrades = await getLastTrades(tokenAddress);

  res.json({
    ok: true,
    tokenLastTrades
  });

});

// Retrieves OHLC data from the last 10 QuickSwap trades of :token (using startTime/endTime range)
app.get("/ohlc", async (req, res) => {

  let base = req.query.baseToken;
  let quote = req.query.quoteCurrency;
  let since = req.query.since;
  let until = req.query.until;
    /* 1m = 1
     5m = 5   
    15m = 15
    30m = 30
     1h = 60
     4h = 240
     1d = 1440
     1w = 10080
  */
  let window = req.query.window;
  let limit = req.query.limit;
  
  //GetCandleData($baseCurrency: String!, $since: ISO8601DateTime, $quoteCurrency: String!,)
  const dataOHLC = await getCandleData(base, quote, since, until, window, limit);

  res.json({
    ok: true,
    dataOHLC
  });

});