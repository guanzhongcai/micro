/**
 * 服务链路追踪
 */


const {Tracer, ExplicitContext, BatchRecorder, ConsoleRecorder, jsonEncoder: {JSON_V2}} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const noop = require('noop-logger');
const http = require('http');

const zipkinMiddleware = require('zipkin-instrumentation-express').expressMiddleware;
/**
 *
 * @param endpoint string zipkin服务URI 'http://localhost:9411/api/v2/spans'
 * @param localServiceName string 服务名称 service-a
 * @param port number 服务端口 8990
 */
module.exports = function (endpoint, localServiceName, port){

    if (!endpoint || endpoint.length === 0){
        console.warn(`serviceTrace disabled by no endpoint ?!`, __filename);
        return function (req, res, next) {
            next();
        }
    }
    console.debug(`service trace::`, endpoint, localServiceName, port);

    const ctxImpl = new ExplicitContext();

// const recorder = new ConsoleRecorder();
    const recorder = new BatchRecorder({
        logger: new HttpLogger({
            endpoint: endpoint, // Required
            jsonEncoder: JSON_V2, // JSON encoder to use. Optional (defaults to JSON_V1)
            httpInterval: 1000, // How often to sync spans. Optional (defaults to 1000)
            headers: {'Authorization': 'secret'}, // Custom HTTP headers. Optional
            timeout: 1000, // Timeout for HTTP Post. Optional (defaults to 0)
            maxPayloadSize: 0, // Max payload size for zipkin span. Optional (defaults to 0)
            agent: new http.Agent({keepAlive: true}), // Agent used for network related options. Optional (defaults to null)
            log: noop, // Logger to use. Optional (defaults to console)
            fetchImplementation: require('node-fetch') // Pluggable fetch implementation (defaults to global fetch or fallsback to node fetch)
        })
    });

//  const localServiceName = 'service-a'; // name of this application
    const tracer = new Tracer({
        ctxImpl,
        recorder: recorder,
        localServiceName});

    return zipkinMiddleware({tracer, port});
};
