#!/usr/bin/env node

/**
 * Module dependencies.
 */
import cluster from "cluster";
import os from "node:os";
import app from '../src/app';
import http from 'http';
import debug from 'debug'

const numCPUs = os.availableParallelism();

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

if (cluster.isPrimary) {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Primary ${process.pid} is running`);
  console.log(`Number of CPUs: ${numCPUs}`);
  console.log(`Forking...`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  /**
   * Create HTTP server.
   */

  var server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
  console.log(`Worker ${process.pid} started`);
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
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

function onError(error: Error) {
  throw error;
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  if(addr === null) throw new Error('no address');

  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    debug('nodejs-express-ts-template:server')('Listening on ' + bind);
}
