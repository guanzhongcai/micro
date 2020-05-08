const DEFAULT_EXPIRE_TIME = 7 * 24 * 3600;
const EXPIRE = { //单位秒！
    user: DEFAULT_EXPIRE_TIME,
    OneDay: 24 * 3600,
    OneHour: 3600,
};

const COMMAND = {
    HGET: 'HGET',
    HMGET: 'HMGET',
    HSET: 'HSET',
    HMSET: 'HMSET',
    HGETALL: 'HGETALL',
    HLEN: 'hlen',
    HINCRBY: 'HINCRBY',
    HDEL: 'HDEL',

    DEL: 'DEL',
    KEYS: 'KEYS',
    EXPIRE: 'EXPIRE',   //EXPIRE key seconds 为给定 key 设置生存时间，当 key 过期时(生存时间为 0 )，它会被自动删除
    EXISTS: 'EXISTS',   //key是否存在

    SADD: 'SADD',   //向集合添加一个或多个成员
    SISMEMBER: 'SISMEMBER', //如果成员元素是集合的成员，返回 1 。 如果成员元素不是集合的成员，或 key 不存在，返回 0 。
    SETBIT: 'SETBIT',   //SETBIT key offset value 对指定的key的value的指定偏移(offset)的位置1或0
    GETBIT: 'GETBIT',    //GETBIT key offset 获取offset设置的值，未设置过默认返回0

    SET: 'SET',    //SET
    GET: "GET",
    MGET: "MGET",
    MSET: "MSET",

    DBSIZE: "DBSIZE",
    SCAN: "SCAN",
    ZADD:"ZADD",                    //有序集合添加
    ZREVRANGE:'ZREVRANGE',          //按照分数返回成员 索引加数量
};

module.exports = {
    EXPIRE,
    DEFAULT_EXPIRE_TIME,
    COMMAND,
};
