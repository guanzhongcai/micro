let ExpressServer = require("../shared/server/ExpressServer");
const serverConfig = require('./demo-service');
const dbAccess = require('./db/dbAccess');

const server_type = "demo";

let server = new ExpressServer({
    serverType: server_type,
    configServer: serverConfig.configServer,
    listen: serverConfig.listen,
    logs: console.log
});

const discoverServers = [
    "lobby",
];

server.InitServer(dbAccess.initDB, discoverServers).then(async function () {

    server.EnableJsonWebToken();
    server.EnableSerialTask();

    server.AddRouter('/match', require('./routes/match'));

    server.EnableErrorHandler();

}).catch(console.error);

process.on('SIGINT', function () {

    server.GracefulStop(dbAccess.Close);
});

module.exports = server;


