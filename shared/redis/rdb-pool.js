var _poolModule = require('generic-pool');
var redis = require('redis');

/*
 * Create redis connection pool.
 */
var createRedisPool = function({host, port, auth_pass, db, poolsize}) {
    if (!poolsize){
        poolsize = 100;
        console.warn('未配置redis的poolsize！使用默认::', poolsize);
    }

    return new _poolModule.Pool({
        name: 'redis',
        create: function(callback) {
            const options = {
                host,
                port,
                auth_pass,
            };
            let client = redis.createClient(options);
            client.select(db, function(err, res){
                callback(null, client);
            });
        },
        destroy: function(client) {
            client.quit();
        },
        max: poolsize,
        idleTimeoutMillis : 30000,
        log : false
    });
};

exports.createRedisPool = createRedisPool;
