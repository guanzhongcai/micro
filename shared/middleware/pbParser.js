/***
 * 解析post请求的pb数据到body中
 * 提供res发送pb数据的接口
 * by gzc 19/11/14
 */

const ProtoBuf = require('../protobuf/ProtoBuf');

/**
 *
 * @param clientProto object
 * @param serverProto object
 * @param urlProto object {url: {package: protobuf接口}}
 * @returns {Function}
 */
module.exports = function ({clientProto, serverProto, urlProto}) {

    let pb = new ProtoBuf(clientProto);
    pb.RootAdd(serverProto);

    /**
     *
     * @param url string http original url
     * @param pkg string package name: client/server/..
     * @returns {*}
     */
    function getPath(url, pkg) {

        if (urlProto[url]) return urlProto[url][pkg];

        //todo: case sensitive routing
        url = url.toLowerCase();
        for (let key in urlProto) {
            if (key.toLowerCase() === url) {
                return urlProto[key][pkg];
            }
        }

        //默认的pb解析
        const _default = urlProto["default"];
        if (_default && _default[pkg]) {
            return _default[pkg];
        }
        return null;
    }


    return function (req, res, next) {

        if (req.method !== "POST") return next();

        if (!req.is('application/x-protobuf')) return next();

        let data = [];
        req.on('data', function (chunk) {
            data.push(chunk);
        });

        req.on('end', function () {
            if (data.length <= 0) return next();

            const path = getPath(req.originalUrl, 'client');
            if (!path) {
                console.warn(`未定义的pb接口的url=${req.originalUrl}`);
            } else {
                //解析post请求的pb数据到body中
                const raw = Buffer.concat(data);
                req.body = pb.Decode(path, raw);

                //提供res发送pb数据的接口
                res.protobuf = function (jsonObj) {

                    if (req.is('application/x-protobuf')) {
                        const path = getPath(req.originalUrl, 'server');
                        const buff = pb.Encode(path, jsonObj);
                        res.set('Content-Type', 'application/x-protobuf');
                        res.send(buff);
                    } else {
                        res.send(jsonObj);
                    }
                }
            }
            next();
        });

    }
};

