const sign = require('../util/sign');
const httpUtil = require('../util/httpUtil');

let configData = {
    redis: {},
    mongo: {
        uri: "",
        options: {},
    },
    mq: {
        url: "",
        connOptions: {},
    },
    ali_sls: {},
    etcd: {},
    signale: {
        logLevel: "info",
        config: {
            displayDate: true,
            displayTimestamp: true,
            displayFilename: true
        }
    },
    mysql: {},
    traceEndpoint: "http://localhost:9411/api/v2/spans",
    monitorServer: "http://localhost:5801/",
};

/**
 *
 * @param serverType string
 * @param confHost string
 * @param confPort number
 * @constructor
 */
configData.Init = async function (serverType, confHost, confPort) {

    const msg = {
        type: serverType,
    };
    sign.addSign(msg);

    return new Promise(((resolve, reject) => {

        httpUtil.httpPost(confHost, confPort, '/config/get', msg, function (err, result) {

            // console.debug(`result`, result);
            if (err) {
                throw err;
            }

            try {
                Object.assign(configData, JSON.parse(result));
                resolve(null);
            } catch (e) {
                reject(e);
                throw e;
            }
        });

    })).then(data => {
        // console.log(`done`, data);
    }).catch(err => console.error(err));
};


module.exports = configData;
