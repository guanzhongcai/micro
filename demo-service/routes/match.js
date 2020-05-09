const Code = require('../../shared/code');
let router = require('../../shared/server/ExpressServer').Router();
let {matchController} = require('../controller');

module.exports = router;


router.post('/startMatch', function (req, res) {

    const {uid} = req.user;
    matchController.startMatch(uid, function (err, result) {
        res.json(result);
    });
});

router.post('/cancelMatch', function (req, res) {

    const {uid} = req.user;
    matchController.cancelMatch(uid, function (err, result) {
        res.json(result);
    });
});

router.post('/healthCheck', function (req, res) {

    res.json({code: Code.OK});
});
