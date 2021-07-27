// Requires
//const process = require("process");
const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
require("./config/config");

// Imports
const getUniqueID = require("./users");
const checkPrice  = require("./api");
const { Session } = require("inspector");

// Process ID
console.log(process.pid);

// Handle signal
process.on("SIGUSR1", function() {
  // Call API
  checkPrice();
  // Emitir que terminé a todos los clientes
  //client.broadcast.emit("Esta es la señal SIGUSR2");
})

process.on("SIGTERM", signal => {
  console.log(`Process ${process.pid} received a SIGTERM signal`)
  process.exit(0)
})

process.on("SIGINT", signal => {
  console.log(`Process ${process.pid} has been interrupted`)
  process.exit(0)
})

const io = new Server(server);

// All active connections go in this object
const clients = {};

// Parse x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Servir contenido estático siempre desde la carpeta "public"
app.use(express.static("public"));

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

///////////////////////////
// INICIO API REST USERS //
///////////////////////////

// GET
app.get("/user", (req, res) => {
  res.json("GET User");
});

// POST
app.post("/user", (req, res) => {

  let body = req.body;

  if ( body.name === undefined ) {

      res.status(400).json({
        ok: false,
        mensaje: "User name is mandatory."
      });

  } else {

      res.json({
        body
      });

  }



});

// PUT
app.put("/user/:id", (req, res) => {
  
  let id = req.params.id;

   res.json({
     id
   });

});

// DELETE
app.delete("/user", (req, res) => {
  res.json("DELETE User");
});