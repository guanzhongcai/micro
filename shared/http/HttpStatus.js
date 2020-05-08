/**
 * by gzc 19/10/28
 * http的状态码
 */
module.exports = {

    // 200状态码表示操作成功，但是不同的方法可以返回更精确的状态码。
    GET_OK: 200, //OK
    POST_Created: 201,// Created
    PUT_OK: 200, // OK
    PATCH_OK: 200, //
    DELETE_No_Content: 204,// No Content

    //3xx 状态码
    Redirect_Forever: 301, //永久重定向
    Redirect_Temporary: 302, //暂时重定向

    // 4xx状态码表示客户端错误，主要有下面几种。
    Bad_Request: 400,//服务器不理解客户端的请求，未做任何处理。
    Unauthorized: 401, //用户未提供身份验证凭据，或者没有通过身份验证。
    Forbidden: 403, //用户通过了身份验证，但是不具有访问资源所需的权限。
    Not_Found: 404, //所请求的资源不存在，或不可用。
    Method_Not_Allowed: 405, //用户已经通过身份验证，但是所用的 HTTP 方法不在他的权限之内。
    Gone: 410, //所请求的资源已从这个地址转移，不再可用。
    Unsupported_Media_Type: 415, //客户端要求的返回格式不支持。比如，API 只能返回 JSON 格式，但是客户端要求返回 XML 格式。
    Unprocessable_Entity: 422, // 客户端上传的附件无法处理，导致请求失败。
    Too_Many_Requests: 429, // 客户端的请求次数超过限额。

    // 5xx状态码表示服务端错误。一般来说，API 不会向用户透露服务器的详细信息，所以只要两个状态码就够了。
    Internal_Server_Error: 500, // 客户端请求有效，服务器处理时发生了意外。
    Service_Unavailable: 503, // 服务器无法处理请求，一般用于网站维护状态。

};

/**
 * HTTP 状态码就是一个三位数，分成五个类别。
 * 1xx: // 相关信息
 2xx: // 操作成功
 3xx: // 重定向
 4xx: // 客户端错误
 5xx: // 服务器错误
 */
