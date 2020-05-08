const MysqlClient = require('./MysqlClient');

 let client = new MysqlClient({
  "poolsize": 10,
  "host": "192.168.1.119",
  "port": "3306",
  "user": "go",
  "password": "goodluck",
  "database": "sg2web"
});
 client.Query("select uid from tb_serveruid where uid>? limit 3", [10000], function (err, result) {
    console.log(err, result);
    client.End();
});
