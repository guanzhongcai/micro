/**
 * admin api
 */

let router = require('../ExpressServer').Router();
let command = require('../../metrics/command');

module.exports = router;

router.post('/commandMetricGet', function (req, res) {

    res.json({code: 200, data: command.get()});
});
