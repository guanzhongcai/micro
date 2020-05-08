/**
 * 服务间的注册和发现
 * by gzc 2019.9.17
 */

const EtcdAccess = require('./EtcdAccess');

class ServiceAccess extends EtcdAccess {

    constructor({hosts, username, password, ttl}) {

        super();
        // this.etcdClient = new EtcdAccess().init({hosts, username, password, ttl});
        this.init({hosts, username, password, ttl});
        this.servers = {}; //字典 {serverType: {serverID: {host: "ip address",port: 3010,..}}
    }

    /**
     * 组etcd的key 默认有反斜杠前缀
     * @param type string 服务类型
     * @param host string 服务地址
     * @param port int 服务端口
     * @returns {string}
     */
    static Name(type, host, port) {

        return type + "@" + host + ":" + port;
    };
}

/**
 * 服务注册
 * @param type string 服务器类型
 * @param server object {host,port,name,..}
 * @returns {Promise<void>}
 */
ServiceAccess.prototype.register = async function (type, server) {

    const {host, port} = server;
    if (!type || !host || !port) {
        throw `参数错误！${type} ${host} ${port}`;
    }
    const key = ServiceAccess.Name(type, host, port);
    await this.putWithLease(key, JSON.stringify(server));
    console.debug(`server register:: ${key} %j`, server);
};

/**
 * 服务发现
 * @param type string
 * @param cb function
 * @returns {Promise<*>}
 */
ServiceAccess.prototype.discover = async function (type, cb) {

    const self = this;

    let server = self.servers[type] = await self.getAll(type);
    console.debug(`server discover:: ${type}`, server);

    const key = type + "@";
    self.watchPrefix(key, function (err, result) {
        if (!err && !!result) {
            const {event, key, value} = result;
            switch (event) {
                case "put":
                    server[key] = value;
                    if (cb) {
                        cb(result);
                    }
                    break;

                case "delete":
                    delete server[key];
                    if (cb) {
                        cb(result);
                    }
                    break;

                default:
                    console.error(`未处理 %j`, result);
                    break;
            }
        } else {
            //TODO 异常处理
        }
    });

    return server;
};

/**
 * 获取所有同类型不同host的server
 * @param type
 */
ServiceAccess.prototype.getDiffHostServers = function (type) {
    const server = this.servers[type];
    if (!server) {
        return console.error(`未配置服务发现type=${type}`);
    }

    let set = new Set();
    let servers = [];
    for (let id in server) {
        const {host, port} = JSON.parse(server[id]);
        if (set.has(host)) {
            continue;
        }
        set.add(host);
        servers.push({host, port});
    }

    return servers;
};

/**
 * 获取所有此类型的服务
 * @param type string
 * @returns {*} object
 */
ServiceAccess.prototype.getOneRandServer = function (type) {
    const server = this.servers[type];
    if (!server) {
        return console.error(`未配置服务发现type=${type}`);
    }

    let array = Object.values(server);
    const size = array.length;
    if (size === 0) {
        return console.warn(`当前没有可用的服务！type=${type}`);
    }

    let idx = 0;
    if (size > 1) {
        idx = Math.floor(Math.random() * size);
    }
    const {host, port} = JSON.parse(array[idx]);
    return {host, port};
};

/**
 * 获取某服务类型的所有服务
 * @param type string 服务类型
 * @returns {Array}
 */
ServiceAccess.prototype.getTypeServers = function (type) {

    const server = this.servers[type];
    let array = [];
    for (let key in server) {
        array.push(JSON.parse(server[key]));
    }
    return array;
};

/**
 *
 * @param type string
 * @param host string
 * @param port number
 * @returns {Promise<void>}
 * @constructor
 */
ServiceAccess.prototype.Delete = async function (type, {host, port}) {

    const key = ServiceAccess.Name(type, host, port);
    await this.delete(key);
};

ServiceAccess.prototype.Close = function () {

    this.close();
};

ServiceAccess.prototype.getAllService = async function () {

    let s = {};
    const keys = Object.keys(SERVER_TYPE);
    for (const key of keys) {
        s[key] = await this.getAllJson(key + "@");
    }
    return s;
};

module.exports = ServiceAccess;
