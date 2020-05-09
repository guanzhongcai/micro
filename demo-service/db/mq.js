const _ = require('../../shared/code');
const rpc = require('../../shared/amqp/rpc');
const configData = require('../../shared/data/configData');
const utils = require('../../shared/util/utils');
const ProtocolData = require('../../shared/data/ProtocolData');

let mq = module.exports;

let lobbyRpcClient = new rpc.RpcClient("lobbyRPC");

mq.Init = function (cb) {

    const {url, connOptions} = configData.mq;

    lobbyRpcClient.Connect(url, connOptions, function (err) {
        lobbyRpcClient.InitQueue(function (err) {
            cb(err);
        })
    });
};

mq.RequestLobby = function (api, param, cb) {

    const msg = ProtocolData.New("demo", api, param);
    lobbyRpcClient.Request(msg, function (err, result) {
        if (!err) {
            result = JSON.parse(result);
        }
        utils.invokeCallback(cb, err, result);
    });
};

mq.Close = function (cb) {

    lobbyRpcClient.Close(cb);
};
