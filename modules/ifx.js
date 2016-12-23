module.exports.getCodByCuenta = function(data){
    var ibmdb = require('ifx_db');
    var connectionString = "SERVER=munivl_tcp;DATABASE=catastro;HOST=192.9.200.5;PROTOCOL=onsoctcp;SERVICE=1521;UID=catas01;PWD=catas208;";        
    var query = "select imagen from imagenes where c_cuenta=" + data;
    ibmdb.open(connectionString, function (err, connection) {
        var res = "HOLA MUNDO";
        if (err)
        {
          console.log(err);
          return;
        }
        connection.query(query, function (err1, data) 
        {
          if (err1) console.log(err1);
          else res = data;
          console.log(data);
          connection.close(function(err2){
          if(err2) console.log(err2);
          });
        });
        return res;
    });
}
module.exports.getCodByNomen = function(data){
    var ibmdb = require('ifx_db');
    var connectionString = "SERVER=munivl_tcp;DATABASE=catastro;HOST=192.9.200.5;PROTOCOL=onsoctcp;SERVICE=1521;UID=catas01;PWD=catas208;";        
    var query = "select * from imagenes where c_cuenta=" + cuenta;
    ibmdb.open(connectionString, function (err, connection) {
        if (err)
        {
          console.log(err);
          return;
        }
        connection.query(query, function (err1, rows) 
        {
          if (err1) console.log(err1);
          else console.log(rows);
          connection.close(function(err2){ 
          if(err2) console.log(err2);
          });
        });
    });
}