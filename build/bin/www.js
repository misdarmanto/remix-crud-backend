"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const config_1 = require("../apps/config");
const os_1 = __importDefault(require("os"));
const cluster_1 = __importDefault(require("cluster"));
const http_1 = __importDefault(require("http"));
app_1.app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, content-type, Authorization, Content-Type');
    next();
});
const port = normalizePort(config_1.CONFIG.port || '8888');
const numCPUs = os_1.default.cpus().length;
app_1.app.set('port', port);
if (cluster_1.default.isMaster) {
    for (var i = 0; i < numCPUs; ++i) {
        cluster_1.default.fork();
    }
}
else {
    var server = http_1.default.createServer(app_1.app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}
// FUNCTIONS DEFINITION //
/* 1. Normalize a port into a number, string, or false */
function normalizePort(val) {
    const port = typeof val === 'string' ? parseInt(val, 10) : val;
    if (isNaN(port)) {
        return val;
    } // named pipe
    if (port >= 0) {
        return port;
    } // port number
    return false;
}
/* 2. Event listener for HTTP server "error" event */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/* 3. Event listener for HTTP server "listening" event */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr?.port;
    console.log('Listening on ' + bind);
    console.log('*** Server listening on port: ', bind);
}
