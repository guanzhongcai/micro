const RedisAccess = require('./RedisAccess');
let r = new RedisAccess();
const config = {
    host: "localhost",
    port: 6379,
    auth_pass: "gotech123",
    db: 0,
    poolsize: 100
};

r.Init(config);

const key = 'key';
let val = 1;

setInterval(function () {

    r.exec("SET", [key, val], function (err, value) {
        console.debug(`set::`, err, value);
        r.exec("GET", [key], function (err, value) {
            console.debug(`get::`, err, value, typeof (value));

            val++;
            // r.shutdown();
        })
    });
}, 2000);
