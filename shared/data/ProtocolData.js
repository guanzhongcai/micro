/**
 * 服务间通讯的消息体
 */

const uuid = require('../util/uuid');

class ProtocolData {

    constructor() {
        this.requestId = "";
        this.time = "";
        this.caller = "";
        this.api = "";
        this.param = {};
        this.sign = ""; //签名
    }

    /**
     *
     * @param caller string 调用者 发起的服务 server_type
     * @param api string 调用接口名称 controller.method 组成形式
     * @param param object 调用参数
     * @constructor
     */
    static New(caller, api, param) {

        let p = new ProtocolData();

        p.requestId = uuid.nextID();
        p.time = new Date().toLocaleString();
        p.caller = caller;
        p.api = api || "";
        p.param = param;

        return p;
    }

    static Parser(data) {
        const obj = typeof (data) === "object" ? data : JSON.parse(data);
        let p = new ProtocolData();
        for (let key in obj) {
            p[key] = obj[key];
        }
        return p;
    }
}

module.exports = ProtocolData;
