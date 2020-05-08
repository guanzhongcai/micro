var utils = module.exports;

// control variable of func "myPrint"
var isPrintFlag = false;
// var isPrintFlag = true;

/**
 * Check and invoke callback function
 */
utils.invokeCallback = function(cb) {
  if(!!cb && typeof cb === 'function') {
    cb.apply(null, Array.prototype.slice.call(arguments, 1));
  }
};

/**
 * clone an object
 */
utils.clone = function(origin) {
  if(!origin) {
    return;
  }

  var obj = {};
  for(var f in origin) {
    if(origin.hasOwnProperty(f)) {
      obj[f] = origin[f];
    }
  }
  return obj;
};

utils.size = function(obj) {
  if(!obj) {
    return 0;
  }

  var size = 0;
  for(var f in obj) {
    if(obj.hasOwnProperty(f)) {
      size++;
    }
  }

  return size;
};

// print the file name and the line number ~ begin
function getStack(){
  var orig = Error.prepareStackTrace;
  Error.prepareStackTrace = function(_, stack) {
    return stack;
  };
  var err = new Error();
  Error.captureStackTrace(err, arguments.callee);
  var stack = err.stack;
  Error.prepareStackTrace = orig;
  return stack;
}

function getFileName(stack) {
  return stack[1].getFileName();
}

function getLineNumber(stack){
  return stack[1].getLineNumber();
}

utils.myPrint = function() {
  if (isPrintFlag) {
    var len = arguments.length;
    if(len <= 0) {
      return;
    }
    var stack = getStack();
    var aimStr = '\'' + getFileName(stack) + '\' @' + getLineNumber(stack) + ' :\n';
    for(var i = 0; i < len; ++i) {
      aimStr += arguments[i] + ' ';
    }
    console.log('\n' + aimStr);
  }
};
// print the file name and the line number ~ end


// get all methods of object
utils.getAllMethods = function(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] == 'function';
    });
}

utils.validRemoteCallback = function(err, ret, next){
    if(err !== null){
        next(err, { code:Code.FAIL, msg:err.msg });
        return;
    }

    if(ret.code !== Code.OK){
        next(null, {code: ret.code});
        return;
    }
}

/**
 * 获取Ali API所需的日期格式
 * @param date: 输入的日期参数
 * */
utils.dateAliString = function(date){
    function pad(number) {
        var r = String(number);
        if ( r.length === 1 ) {
            r = '0' + r;
        }
        return r;
    }

    return date.getUTCFullYear()
        + '-' + pad( date.getUTCMonth() + 1 )
        + '-' + pad( date.getUTCDate() )
        + 'T' + pad( date.getUTCHours() )
        + ':' + pad( date.getUTCMinutes() )
        //+ ':' + pad( date.getUTCSeconds() )
        //+ '.' + String( (date.getUTCMilliseconds()/1000).toFixed(3) ).slice( 2, 5 )
        + 'Z';
};


let lastCpuUsage = null;
let cpuTime = null;
/**
 * 获取进程查到cpu和内存使用情况
 * @returns {{heapUsed: (Number.heapUsed|*), uptime: number, cpuUser: string}}
 */
utils.getProcessProfile = function () {

    const cpuUsage = process.cpuUsage(lastCpuUsage); //{ user: 10296976, system: 2220284 } 属性值的单位都是微秒(百万分之一秒)
    const tlast = cpuTime;
    cpuTime = Date.now();
    let cpuUser = '-';
    if (tlast > 0){
        const {user, system} = cpuUsage;
        cpuUser = user/((cpuTime-tlast)*1000);
        cpuUser = Math.round(cpuUser*100)/100;
    }

    let {heapUsed, heapTotal} = process.memoryUsage();
    heapUsed = Math.round((heapUsed/1024/1024)*100)/100;
    const uptime = process.uptime();
    // console.log(`getProcessProfile::heapUsed=${heapUsed}M, uptime=${uptime}秒 cpu使用率${cpuUser}%`);
    return {heapUsed, uptime, cpuUser};
};