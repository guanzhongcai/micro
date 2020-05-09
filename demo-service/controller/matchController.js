const decisionModel = require('../model/decisionModel');
const Code = require('../../shared/code');
const mq = require('../db/mq');

let logic = module.exports;


logic.startMatch = function (uid, cb) {

    mq.RequestLobby('decisionController.getUserInfo', {uid}, function (err, result) {
        if (err || result.code !== Code.OK) {
            return cb(err, result);
        }
        const {user} = result;
        decisionModel.addUser(uid, user);

        cb(null, {code: Code.OK});
    });
};

logic.cancelMatch = function (uid, cb) {

    const ok = decisionModel.deleteUser(uid);
    return cb(null, {code: Code.OK, ok});
};

