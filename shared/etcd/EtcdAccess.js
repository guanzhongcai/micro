/**
 * etcd v3的封装类
 * by gzc 2019.9.16
 */

const {Etcd3} = require('etcd3');
const getDateTime = require('../util').getDateTime;
const MODULE = "[etcd]";

class EtcdAccess {

    constructor() {
        this._ttl = 10;
        this._client = null;
    }
}

/**
 * 构造
 * @param hosts array 集群信息
 * @param username string 登陆名
 * @param password string 密码
 * @param ttl int time-to-live 过期时间/秒
 */
EtcdAccess.prototype.init = function({hosts, username, password, ttl}){

    let options = {
        hosts
    };
    if (username && password && username.length > 0 && password.length > 0) {
        options.auth = {username, password}
    }
    this._ttl = ttl || 10;
    this._client = new Etcd3(options);
    this.grantLease();
    console.debug(`${MODULE} %j`, options);

    return this;
};

/**
 * 设置-永久
 * @param key
 * @param value
 * @returns {Promise<void>}
 */
EtcdAccess.prototype.put = async function (key, value) {

    return await this._client.put(key).value(value);
};

/**
 * 设置-基于租约
 * @param key
 * @param value
 */
EtcdAccess.prototype.putWithLease = async function (key, value) {

    await this.lease.put(key).value(value);
};

/**
 * 获取单个-返回string
 * @param key
 */
EtcdAccess.prototype.get = async function (key) {

    return await this._client.get(key).string()
};

/**
 * 获取单个-返回json
 * @param key
 */
EtcdAccess.prototype.getJson = async function (key) {

    return await this._client.get(key).json()
};

/**
 * 按前缀获取
 * @param keyPrefix 前缀
 */
EtcdAccess.prototype.getAll = async function (keyPrefix) {

    return await this._client.getAll().prefix(keyPrefix).strings()
};

/**
 * 按前缀获取
 * @param keyPrefix 前缀
 */
EtcdAccess.prototype.getAllJson = async function (keyPrefix) {

    return await this._client.getAll().prefix(keyPrefix).json();
};

EtcdAccess.prototype.watch = function (key, cb) {

    this._client.watch()
        .key(key)
        .create()
        .then(watcher => {
            watcher
                .on('disconnected', () => console.error('disconnected...'))
                .on('connected', () => console.log(`successfully reconnected!`))
                .on("error", (err) => {
                    console.error(`watch meet error`, err);
                    cb(err);
                })
                // .on("data", (res)=> console.log(`data event`, res.watch_id))
                .on('put', res => {

                    const result = {
                        event: 'put',
                        key: res.key.toString(),
                        value: res.value.toString()
                    };
                    console.debug(`${MODULE} ${getDateTime()}:: event=${result.event}, ${result.key}, ${result.value}`);
                    cb(null, result);
                })
                .on('delete', res => {

                    const result = {
                        event: 'delete',
                        key: res.key.toString(),
                        value: res.value.toString(),
                    };
                    console.debug(`${MODULE} ${getDateTime()}:: event=${result.event}, ${result.key}, ${result.value}`);
                    cb(null, result);
                })
        })
};

/**
 * 监控 & 发现
 * @param keyPrefix
 * @param cb
 */
EtcdAccess.prototype.watchPrefix = function (keyPrefix, cb) {

    this._client.watch()
        .prefix(keyPrefix)
        .create()
        .then(watcher => {
            watcher
                .on('disconnected', () => console.error('disconnected...'))
                .on('connected', () => console.log(`successfully reconnected!`))
                .on("error", (err) => {
                    console.error(`watch meet error`, err);
                    cb(err);
                })
                // .on("data", (res)=> console.log(`data event`, res.watch_id))
                .on('put', res => {

                    const result = {
                        event: 'put',
                        key: res.key.toString(),
                        value: res.value.toString()
                    };
                    console.debug(`${MODULE} ${getDateTime()}:: event=${result.event}, ${result.key}, ${result.value}`);
                    cb(null, result);
                })
                .on('delete', res => {

                    const result = {
                        event: 'delete',
                        key: res.key.toString(),
                        value: res.value.toString(),
                    };
                    // [etcd] 2020/03/16 11:30:41.283:: event=delete, game@192.168.1.121:15011,
                    console.debug(`${MODULE} ${getDateTime()}:: event=${result.event}, ${result.key}, ${result.value}`);
                    cb(null, result);
                })
        })
};

/**
 * 租约授予
 */
EtcdAccess.prototype.grantLease = function () {

    let self = this;
    self.lease = self._client.lease(self._ttl)
        .on("lost", err => {
            console.log('We lost our lease as a result of this error:', err);
            console.log('Trying to re-grant it...');
            self.grantLease(self._ttl);
        })
        .on("keepaliveSucceeded", res => {
            // console.debug(`keepaliveSucceeded`, res.ID.toString(), res.TTL.toString(), new Date().toLocaleString());
        })
        .on("keepaliveFailed", res => {
            console.log(`etcd keep alive Failed!`);
        });
};

/**
 * 删除key
 * @param key string
 * @returns {Promise<void>}
 */
EtcdAccess.prototype.delete = async function (key) {

    await this._client.delete().key(key);
    console.debug(`${MODULE} delete key=${key}`);
};

/**
 * 关闭etcd连接
 * @constructor
 */
EtcdAccess.prototype.close = function () {

    this._client.close();
    console.debug(`${MODULE} close`);
};


module.exports = EtcdAccess;
