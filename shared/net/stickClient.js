/**
 * 处理粘包的tcp客户端，可自动重连
 * @type {Object}
 */
const net = require('net');
const stick = require('./stickpackage');
const utils = require('../util/utils');
const Code = require('../code');

const options = {
    // type: 16,   //包头长度为2，short类型
    type: 32,   //包头长度为4，int类型
};
let msgCenter = new stick.msgCenter(options);

let stickClient = module.exports;

let client;

//消息请求ID
let ReqId = 1;

//需要回调的请求队列
let requestMap = new Map(); //ReqId -> cb

//当前和服务器的链接状态
let isConnected = false;

//服务器的ip和端口信息
let _hostIP = '127.0.0.1';
let _port = 3563;


stickClient.setHost = function(hostIP, port){

    _hostIP = hostIP;
    _port = port;
};

stickClient.initConnection = function () {

    client = net.createConnection({host: _hostIP, port: _port}, function (err) {
        if (err){
            throw err;
        }
        console.log("connect server success", _hostIP, _port);
        isConnected = true;
    });

    client.on('data', data => msgCenter.putData(data));

    client.on('end', () => {
        console.error('disconnect from server', _hostIP, _port);
        isConnected = false;
        reconnect();
    });

    client.on('error', (err) => {
        isConnected = false;
        // console.error('ERROR %j', err);
        reconnect();
    });

    msgCenter.onMsgRecv(data => recvData(data.toString()));
};

/**
 * 自动重连
 */
const reconnect = function(){

    if (isConnected){
        return
    }
    setTimeout(stickClient.initConnection, 3 * 1000);
};

stickClient.testLeaf = function(){

    stickClient.writeData('Hello', {Name: "leaf"}, function (err, result) {
        console.log(err, result)
    });
};

/**
 * 处理从服务端收到的消息
 * @param data -> {"Response":{"ReqId":3,"Result":{"code":200,"msg":"","rankList":[{"uid":12231,"realm":3,"nick":"good1","rank":1,"score":70}]}}}
 */
const recvData = function(data){

    // console.log('recvData', data);

    try {
        const response = JSON.parse(data)['Response'];
        if (!response){
            console.log('recvData>>', data);
            return;
        }
        const {ReqId, Result} = response;
        if (ReqId > 0) {
            const cb = requestMap.get(ReqId);
            if (!!cb) {
                cb(null, Result);
                requestMap.delete(ReqId);
            }
        }
    }
    catch (e) {
        // console.error(e);
        console.error('parse_object_fail' + data);
    }
};

/**
 * 向服务端发送请求
 * @param route
 * @param obj json格式的消息对象
 * @param cb
 */
stickClient.writeData = function (route, obj, cb) {

    if (!isConnected){
        utils.invokeCallback(cb, null, {code: Code.ERR_TOO_BUSY, msg: "server_not_connected"});
        return;
    }

    //如果需要回调就set请求ID
    if (!!cb && typeof (cb) === 'function'){
        obj.ReqId = ReqId++;
        requestMap.set(obj.ReqId, cb);
    }

    let req = {};
    req[route] = obj;
    const data = JSON.stringify(req);
    // console.log('writeData', data);
    const msgBuffer = msgCenter.publish(data);
    client.write(msgBuffer);
};

