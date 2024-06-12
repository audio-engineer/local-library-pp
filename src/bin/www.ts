import app from "../app.js";
import debug from "debug";
import http from "http";
import dotenv from "dotenv";

dotenv.config();

const debugWrapper = debug("hello");

const normalizePort = (port: string): number => {
  const portNumber = parseInt(port, 10);

  if (0 <= portNumber) {
    return portNumber;
  }

  throw new Error("Port is not a valid port number");
};

let port = 0;

try {
  port = normalizePort(process.env.PORT ?? "3000");
} catch (error) {
  console.error(error);

  process.exit(1);
}

app.set("port", port);

const server = http.createServer(app);

server.listen(port);

const onError = (error: NodeJS.ErrnoException): void => {
  if ("listen" !== error.syscall) {
    throw error;
  }

  const bind = "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      break;
    default:
      throw error;
  }

  process.exit(1);
};

server.on("error", onError);

const onListening = (): void => {
  const addr = server.address();
  if (null === addr) {
    process.exit(1);
  }

  let bind = "";

  if ("string" === typeof addr) {
    bind = "pipe " + addr;
  } else {
    bind = "port " + addr.port;
  }

  debugWrapper("Listening on " + bind);
};

server.on("listening", onListening);
