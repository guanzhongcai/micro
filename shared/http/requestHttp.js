const request = require('request');
let exp = module.exports;

//http动词
const VERBS = {
    PUT: "PUT",
    DELETE: "DELETE",
    POST: "POST",
    GET: "GET",
};

/**
 *
 * @param host string
 * @param port number
 * @param route 路由
 * @param params object
 * @param protocol string 协议
 * @returns {string}
 */
exp.getUri = function (host, port, route, params = {}, protocol = "http") {

    if (route[0] !== "/") {
        route = "/" + route;
    }
    let uri = `${protocol}://${host}:${port}${route}`;
    if (Object.keys(params).length > 0) {
        uri += '?';
        for (let key in params) {
            const val = typeof (params) === "object" ? JSON.stringify(params[key]) : params[key];
            uri += key + '=' + val;
        }
    }

    return uri;
};
/**
 *
 * @param verb string http动词
 * @param uri string http://host:port/route...
 * @param params object
 * @param cb
 */
exp.send = function (verb, uri, params, cb) {

    // console.debug(`>>> post ${url} %j`, params);
    request({
            method: verb.toUpperCase(),
            uri,
            json: true,
            headers: {
                "Content-Type": "application/json",
            },
            body: params
        },
        function (error, response, body) {
            if (!error && response.statusCode === 200) {
                // console.log(body) // 请求成功的处理逻辑
            } else {
                console.error('exp.post error:', uri, params, error, body);
            }

            if (cb && typeof (cb) === 'function') {
                cb(error, body);
            }
        });
};

exp.VERBS = VERBS;
