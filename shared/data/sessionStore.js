/**
 * 玩家在线状态的持久化
 * redis hash存储 key为uid
 */

let exp = module.exports;
let RedisAccess = require('../redis/RedisAccess');
const async = require('async');
const {COMMAND, EXPIRE} = require('../redis/const');

let redisDB = new RedisAccess();
const PREFIX = "session:";

/**
 *
 * @param redisConfig object {host/port/..}
 * @param cb
 * @constructor
 */
exp.Init = function (redisConfig, cb) {

    redisDB.Init(redisConfig, cb);
};

exp.Shutdown = (cb) => redisDB.shutdown(cb);

/**
 *
 * @param uid number
 * @param session object {clientIP, serverIP, serverPort, ..}
 * @param cb
 */
exp.Online = function (uid, session, cb) {

    // console.debug(`>>> online`, uid, session);
    const key = PREFIX + uid;
    const args = [key, JSON.stringify(session)];
    redisDB.upsertWithExpire(COMMAND.SET, args, key, EXPIRE.OneDay, cb);
};

exp.GetSession = function (uid, cb) {

    const key = PREFIX + uid;
    redisDB.exec(COMMAND.GET, [key], cb);
};

exp.MGetSession = function (uids, cb) {

    let keys = [];
    for (let uid of uids) {
        keys.push(PREFIX + uid);
    }
    redisDB.exec(COMMAND.MGET, keys, cb);
};

exp.Offline = function (uid, cb) {

    const key = PREFIX + uid;
    redisDB.exec(COMMAND.DEL, [key], cb);
};

//
exp.Clean = function () {

};

exp.getSize = function (cb) {

    redisDB.exec(COMMAND.DBSIZE, [], cb);
};

exp.getUsers = function (cb) {

    //SCAN 0 MATCH session* COUNT 10
    let cursor = 0;
    let flag = true;
    let users = [];

    async.whilst(
        function () {
            return flag;
        },
        function (callback) {
            redisDB.exec(COMMAND.SCAN, [cursor], function (err, result) {
                cursor = result[0];
                let keys = result[1];

                if (cursor === "0" || keys.length === 0) {
                    flag = false;
                }

                let userKeys = [];
                for (let key of keys){
                    if (key.substring(0, PREFIX.length) === PREFIX){
                        userKeys.push(key);
                    }
                }

                if (userKeys.length > 0) {
                    redisDB.exec(COMMAND.MGET, keys, function (err, array) {
                        for (let u of array) {
                            users.push(JSON.parse(u));
                        }
                        callback(null);
                    });
                } else {
                    callback(null);
                }
            })
        },
        function (err) {

            cb(err, users);
        }
    )
};

