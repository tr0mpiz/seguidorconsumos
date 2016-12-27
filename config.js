var argv = require('yargs').argv;
var ip = require('ip');
/*OBJECT TREE*/
var config = {};
config.server = {};
config.db = {};
config.db.mysql = {};
config.db.mysql.tab = {};
config.socket = {};

/*SERVER*/
config.server.ip = process.env.IP || ip.address();
config.server.port = process.env.PORT || 3000;
config.server.pid = process.pid || "desconocido";
/*SOCKET*/
config.socket.ip = argv.socketIp || ip.address;
config.socket.port = argv.socketPort || (process.env.PORT || 3000);
/*DB MYSQL*/
config.db.mysql.host = argv.mysqlIp || 'localhost';
config.db.mysql.port = argv.mysqlPort || '3006';
config.db.user = argv.mysqlUser ||'dev';
config.db.mysql.password = argv.mysqlPassword || '1234';
config.db.mysql.db = argv.mysqlDb || 'mvl';
config.db.mysql.tab.sessions = argv.mysqlTabSessions || 'sesiones';
config.db.mysql.tab.users = argv.mysqlTabSessions || 'usuarios';

module.exports = config;
