/**
 * BY GZC 19-10-25
 */

let mysql = require('mysql');

class MysqlClient {

    constructor() {

        this._queryOK = 0;
        this._queryFail = 0;
    }
}

/**
 * 初始化构建连接池
 * @param host '192.168.1.119'
 * @param port 3306
 * @param user admin
 * @param password 111111
 * @param database sg2web
 * @param poolsize 100
 * @param cb function 回调函数
 */
MysqlClient.prototype.Init = function ({host, port, user, password, database, poolsize}, cb) {

    console.debug(`MySql: ${user}:${password}@${host}:${port}/database=${database}&poolsize=${poolsize}`);
    this._pool = mysql.createPool({
        connectionLimit: poolsize || 10,
        host: host,
        port: port,
        user: user,
        password: password,
        database: database,
        connectTimeout: 2000,
        supportBigNumbers: true,
        multipleStatements: false, //disable SQL injection attacks
    });

    this.Query("select 1", [], function (error) {
        if (error) {
            throw error;
        }
        if (cb && typeof (cb) === "function"){
            cb(error);
        }
    })
};

MysqlClient.prototype.Query = function (sql, args, cb) {

    let self = this;
    this._pool.query(sql, args, function (error, results, fields) {

        if (error) {
            self._queryFail++;
        } else {
            self._queryOK++;
        }
        return cb && cb(error, results, fields);
    });
};

MysqlClient.prototype.End = function (cb) {

    this._pool.end(function (err) {
        if (!err) {
            console.log(`MysqlClient End Success`);
        }

        return cb && cb(err);
    })
};

MysqlClient.prototype.getProfile = function () {

    return {
        poolSize: this._pool._allConnections.length,
        queryOK: this._queryOK,
        queryFail: this._queryFail,
    }
};

module.exports = MysqlClient;
