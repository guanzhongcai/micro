/**
 * 指令发送太快check
 */

class TooQuick {
    /**
     * 构造函数
     * @param route 路由命令名称
     * @param eachMaxTime 单次请求最小间隔-ms
     * @param checkNum 每多少个指令检查一次
     */
    constructor(route, eachMaxTime = 2000, checkNum = 1){

        this.route = route;
        this.eachMaxTime = eachMaxTime || 2000;
        this.checkNum = checkNum || 1;

        this.commandMap = new Map(); //uid -> {count, lastTime}
    }
}

/**
 * 检查指令是否快速发送了
 * @param uid
 * @returns {boolean}
 */
TooQuick.prototype.isQuick = function (uid) {

    const data = this.commandMap.get(uid);
    const tnow = Date.now();
    let isTooQuick = false;
    if (!data){
        this.commandMap.set(uid, {count: 1, tlast: tnow});
        return isTooQuick;
    }

    const {count, tlast} = data;
    if (count % this.checkNum > 0){ //特定数次不检查 但更新次数
        this.commandMap.set(uid, {count: count+1, tlast: tlast});
        return isTooQuick;
    }

    if (tnow - tlast < this.eachMaxTime * this.checkNum){
        isTooQuick = true;
        console.error("tooQuick::", this.route, uid, count, tnow - tlast, 'ms');
        return isTooQuick;
    }

    this.commandMap.set(uid, {count: count+1, tlast: tnow});
    return isTooQuick;
};


module.exports = TooQuick;