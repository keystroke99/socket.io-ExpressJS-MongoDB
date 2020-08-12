#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require("../app");
var debug = require("debug")("socket:server");
var http = require("http");

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
let io = require("socket.io")(server);
let jwt = require("jsonwebtoken");

// Generate Custom SocketID based on UserID
io.engine.generateId = (req) => {
  try {
    return req._query.userId; // custom id must be unique
  } catch (error) {
    throw error;
  }
};
io.on("connection", (socket) => {
  // Authenticate User
  if ("token" in socket.handshake.query) {
    let token = socket.handshake.query.token;
    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        socket.emit("error", { message: "Not Authorized :(" });
      } else {
        console.log("id==" + socket.id);
        io.to(socket.id).emit("message", {
          message: `Socket Connection established... Welcome ${decoded.email} FASAK`,
        });
      }
    });
  }
});
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Running at === ", bind);
  debug("Listening on " + bind);
}
