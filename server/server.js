// Requires
const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const _ = require("underscore");

require("./config/config");
require("./api/token_list");

// Imports
const getUniqueID = require("../routes/users");
const checkPrice  = require("./api/token_price");

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {

  if (err) throw err;

  console.log("CONNECTED to DB");

});

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

// API USERS
//app.use( require("../routes/users") );

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
const Token = require("./models/token");
const getTokenList = require("./api/token_list");
const getTokenPrice = require("./api/token_price");

app.get("/tokens", async (req, res) => {

  console.log("Querying token list...");
  const tokenList = await getTokenList();
  console.log("This is the list of tokens: " + JSON.stringify(tokenList));

});

app.get("/price/:token", async (req, res) => {

  let token = req.params.token;

  console.log("Querying token prices...");
  getTokenPrice(token);

});

///////////////////////////
// INICIO API REST USERS //
///////////////////////////
const User = require("./models/user");

// GET
app.get("/user", (req, res) => {
  
  let from = req.query.from || 15;
  from = Number(from);

  let limit = req.query.limit || 5;
  limit = Number(limit);
  
  User.find({}, "name email role status google binance")
      .skip(from)
      .limit(limit)
      .exec( (err, users) => {

        if(err) {
          return res.status(400).json({
            ok: false,
            err
          })
        }

        User.countDocuments({}, (err, count) => {

          res.json({
            ok: true,
            users,
            totalUsers: count
          })

        })
        
      })

});

// POST
app.post("/user", (req, res) => {

  let body = req.body;

  let user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  user.save( (err, userDB) => {

    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: userDB
    });

  });

});

// PUT
app.put("/user/:id", (req, res) => {
  
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, body, { new: true , runValidators: true }, (err, userDB) => {

    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      user: userDB
    });

  });
})


// DELETE
app.delete("/user/:id", (req, res) => {
  
  let id = req.params.id;

  User.findByIdAndUpdate(id, { status: false }, { new: true , runValidators: true }, (err, userDeleted) => {

    if(err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!userDeleted) {

      res.status(400).json({
        ok: false,
        err: {
          message: "User not found"
        }
      });
      
    }

    res.json({
      ok: true,
      user: userDeleted
    });


  });

});