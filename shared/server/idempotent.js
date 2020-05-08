/**
 * TODO 幂等操作：是其任意多次执行所产生的影响均与一次执行的影响相同（不用担心重复执行会对系统造成改变）
 * token机制，防止重复提交
 (1). 数据提交前要向服务的申请token，token放到redis中，token有效时间
 (2). 提交后后台校验token，同时删除token，生成新的token返回
 */

const TTL = 3; //超时时间

let exp = module.exports;

exp.apply = function (requestId, cb) {

};

exp.delete = function (requestId, cb) {

};
