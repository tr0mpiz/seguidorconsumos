var argv = require('yargs').argv;
var ip = require('ip');
/*OBJECT TREE*/
var config = {};
config.server = {};
config.db = {};
config.db.mysql = {};
config.db.mysql.tab = {};
config.db.ifx = {};
config.socket = {};
config.imagenes = {};
config.imagenes.planchetas = {};
/*SERVER*/
config.server.ip = argv.ip || ip.address();
config.server.port = argv.port || 3000;
config.server.pid = process.pid;
/*SOCKET*/
config.socket.ip = argv.socketIp || ip.address;
config.socket.port = argv.socketPort || (argv.port || 3000);
/*DB MYSQL*/
config.db.mysql.host = argv.mysqlIp || 'localhost';
config.db.mysql.port = argv.mysqlPort || '3006';
config.db.user = argv.mysqlUser ||'dev';
config.db.mysql.password = argv.mysqlPassword || '1234';
config.db.mysql.db = argv.mysqlDb || 'mvl';
config.db.mysql.tab.sessions = argv.mysqlTabSessions || 'sesiones';
config.db.mysql.tab.users = argv.mysqlTabSessions || 'usuarios';
/*FICHAS Y PLANCHETAS*/
config.imagenes.fichas = 'E:\\Usuario\\Pictures\\imagfichasPNG\\'
config.imagenes.planchetas.ano2000 = '';
config.imagenes.planchetas.ano2005 = '';
/*DB INFORMIX*/
config.db.ifx.host = 'munivl_tcp';
config.db.ifx.ip = 'onsoctcp';
config.db.ifx.service = '1521';
config.db.ifx.protocol = 'onsoctcp';
config.db.ifx.db = 'catastro';
config.db.ifx.user = 'catas01';
config.db.ifx.password = 'catas208';
config.db.ifx.connectionString = 'SERVER=munivl_tcp;DATABASE=catastro;HOST=192.9.200.5;PROTOCOL=onsoctcp;SERVICE=1521;UID=catas01;PWD=catas208;';

module.exports = config;
