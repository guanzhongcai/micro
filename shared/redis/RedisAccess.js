/**
 * redis访问类
 */

class RedisAccess {

    constructor() {
        this._execOK = 0;
        this._execFail = 0;
    }

    Init({host, port, auth_pass, db, poolsize}, cb) {
        const redisConfig = {host, port, auth_pass, db, poolsize};
        console.debug(`redisConfig=%j`, redisConfig);
        this._pool = require('./rdb-pool').createRedisPool(redisConfig);

        this.exec('PING', [], function (err, PONG) {
            if (cb && typeof (cb) === "function") {
                cb(err);
            }
        })
    }

    exec(command, args, cb) {

        let self = this;
        const _pool = this._pool;

        _pool.acquire(function (err, client) {
            if (err) {
                self._execFail++;
                return cb && cb(err);
            }

            client.send_command(command, args, function (err, res) {
                _pool.release(client);
                if (err) {
                    self._execFail++;
                    console.warn("RedisAccess_error::", err, res, command, args);
                    _pool.destroy(client);
                } else {
                    self._execOK += 1;
                }

                return cb && cb(err, res);
            });
        });
    }

    shutdown(cb) {
        this._pool.destroyAllNow(function (err) {
            if (err) {
                console.debug(err);
            }
            console.debug(`close redis pool ok`);
            return cb && cb(err);
        });
    };

    getProfile() {

        return {
            poolSize: this._pool.getPoolSize(),
            execOK: this._execOK,
            execFail: this._execFail,
        }
    }
}

/**
 * 同步操作redis
 * @param command
 * @param args
 * @returns {Promise<*>}
 */
RedisAccess.prototype.execSync = async function (command, args) {

    let self = this;

    return new Promise((resolve, reject) => {

        self.exec(command, args, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

/**
 * 设置key的超时时间
 * @param key string 键
 * @param seconds int 秒
 * @param cb
 */
RedisAccess.prototype.setKeyExpire = function (key, seconds, cb) {

    this.exec('EXPIRE', [key, seconds], cb);
};

/**
 * redis中update/insert增加key
 * @param command string 命令 set类
 * @param args array
 * @param key string
 * @param expire int 有效时间/秒
 * @param cb function
 */
RedisAccess.prototype.upsertWithExpire = function (command, args, key, expire, cb) {

    let self = this;

    self.exec(command, args, function (err) {

        self.setKeyExpire(key, expire, function (err) {

            if (cb && typeof (cb) === "function") {
                cb(err);
            }
        });
    });
};

/**
 * 分布式锁：key不存在时才获取锁
 * @param key string redis键
 * @param expireSeconds number 过期时间-秒
 * @param cb function true表示加锁成功
 */
RedisAccess.prototype.TryLock = function (key, expireSeconds, cb) {

    let self = this;
    const args = [key, Date.now(), 'EX', expireSeconds, "NX"];
    self.exec("SET", args, function (err, OK) {
        console.debug(`lock key=${key} ${expireSeconds}秒: ${OK}`);
        cb(null, OK === "OK");
    })
};

/**
 * 分布式环境下只执行一次
 * @param key string redis键
 * @param expireSeconds number 过期时间-秒
 * @param callback function 业务函数
 * @param param object 业务参数
 */
RedisAccess.prototype.ExecuteOnce = function (key, expireSeconds, callback, param = {}) {

    let self = this;
    self.TryLock(key, expireSeconds, function (err, ok) {
        if (ok) {
            callback(param);
        }
    });
};


//排行榜相关 分数从大到小

/**
 *
 * @param key string
 * @param memberIncPair object {member: inc}
 * @param cb
 */
RedisAccess.prototype.rankScoreInc = function (key, memberIncPair, cb) {

    let args = [key];
    for (let member in memberIncPair){
        const inc = memberIncPair[member];
        args.push(inc, member);
    }
    this.exec('ZINCRBY', args, cb);
};

/**
 *
 * @param key string
 * @param start number 0
 * @param stop number
 * @param cb [member, score, ..]
 */
RedisAccess.prototype.rankList = function (key, start, stop, cb) {

    const args = [
        key,
        start,
        stop,
        'WITHSCORES',
    ];
    this.exec('ZREVRANGE', args, cb);
};

/**
 * 获取一个成员的排名和分数-从高到低
 * @param key
 * @param member
 * @param cb
 */
RedisAccess.prototype.rankMemberInfo = function (key, member, cb) {

    let rank = 0, score = 0;
    const self = this;
    const args = [key, member];
    self.exec('zrevrank', args, function (err, value) {
        if (value === null) {
            return cb(null, rank, score);
        }

        rank = Number(value) + 1;
        self.exec('zscore', args, function (err, value) {
            score = value;
            cb(null, rank, score);
        });
    });
};


module.exports = RedisAccess;
