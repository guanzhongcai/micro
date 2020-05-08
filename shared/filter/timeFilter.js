/**
 * Filter for response time statistics for pomelo.
 * Record used time for each request.
 */

module.exports = function() {
    return new Filter();
};

let Filter = function() {
    this.timeMap = new Map();
};

Filter.prototype.before = function(msg, session, next) {
    session.__startTime__ = Date.now();
    next();
};

Filter.prototype.after = function(err, msg, session, resp, next) {

    const start = session.__startTime__;
    const route = msg.__route__;

    if(typeof start === 'number') {
        const timeUsed = Date.now() - start;

        let obj = this.timeMap.get(route);
        if (!obj){
            let temp = {
                method : route, //指令方法名
                time : timeUsed, //平均耗费时间
                total : timeUsed, //总时间
                max : timeUsed, //最大时间
                min : timeUsed, //最小时间
                num : 1,    //总次数
                ov1 : 0,    //超过100ms
                ov5 : 0,    //超过500ms
                ov10 : 0    //超过1000ms
            };
            this.timeMap.set(route, temp);
        }
        else {
            if (timeUsed > obj.max){
                obj.max = timeUsed;
            }
            else if (timeUsed < obj.min){
                obj.min = timeUsed;
            }

            if (timeUsed > 1000){
                obj.ov10 += 1;
            }
            else if (timeUsed > 500){
                obj.ov5 += 1;
            }
            else if (timeUsed > 100){
                obj.ov1 += 1;
            }

            obj.total += timeUsed;
            obj.num += 1;
            //obj.time = obj.total / obj.num;
        }
    }

    if (route.indexOf('cmdTime') !== -1){
        let msgTimeArray = [];
        for (let val of this.timeMap.values()){
            msgTimeArray.push(val);
        }
        resp.msgTimeArray = msgTimeArray;
        console.log('msgTimeArray::', msgTimeArray.length, route);
    }

    next(err);

};
