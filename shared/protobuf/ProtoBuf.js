/**
 * by gzc 19/11/9
 * protobuf的编解码 proto3
 */

let protobufRoot = require('protobufjs').Root;

class ProtoBuf {

    /**
     * 构造
     * @param jsonFormat object
     */
    constructor(jsonFormat={}){

        this.root = protobufRoot.fromJSON(jsonFormat);
    }

}

ProtoBuf.prototype.RootAdd = function(jsonFormat) {

    this.root = protobufRoot.fromJSON(jsonFormat, this.root);
};

/**
 * 编码为字节数据
 * @param path string packageName.commandName
 * @param jsonObj object
 * @returns Uint8Array
 */
ProtoBuf.prototype.Encode = function (path, jsonObj) {

    let Type = this.root.lookupType(path);

    const encodeBuff = Type.encode(Type.create(jsonObj)).finish();
    console.debug(`Encode %j`, jsonObj, JSON.stringify(jsonObj).length, encodeBuff.length);

    return encodeBuff;
};

/**
 * 解码为json对象
 * @param path string
 * @param buff bytes
 * @returns object json
 * @constructor
 */
ProtoBuf.prototype.Decode = function(path, buff){

    let Type = this.root.lookupType(path);

    const decodeJson = Type.decode(buff).toJSON();
    // console.debug(`string len`, buff.length);
    console.debug(`Decode %j`, decodeJson, buff.length, JSON.stringify(decodeJson).length);

    return decodeJson;
};

module.exports = ProtoBuf;
