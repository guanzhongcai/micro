// mysql CRUD
var rdbclient = module.exports;

var _pool;

var NND = {};

/*
 * Init sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function(redisConfig){
    _pool = require('./rdb-pool').createRedisPool(redisConfig);
};

// -------------------- hash -----------------------

NND.exec = function(command, args, cb){
    _pool.acquire(function(err, client) {
        if (err) {
            return cb && cb(err);
        }

        client.send_command(command, args, function(err, res){
            if (err){
                _pool.destroy(client);
            }
            else {
                _pool.release(client);
            }

            if (err) return cb && cb(err);

            if (cb) cb(null, res);
        });
    });
};

/**
 * Close connection pool.
 */
NND.shutdown = function(){
    _pool.destroyAllNow();
};

/**
 * init database
 */
rdbclient.init = function(redisConfig) {
    if (!!_pool){
        return rdbclient;
    } else {
        NND.init(redisConfig);
        rdbclient.exec = NND.exec;
        return rdbclient;
    }
};

/**
 * shutdown database
 */
rdbclient.shutdown = function() {
    NND.shutdown();
};






