const os = require('os');

const m = module.exports;

m.getLocalIP = function () {
    const interfaces = os.networkInterfaces(); // 在开发环境中获取局域网中的本机iP地址
    let IPAddress = '';
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                IPAddress = alias.address;
                // console.log(`IPAddress`, IPAddress); //云服上会有两个 内网&外网
            }
        }
    }
    return IPAddress;
};

/**
 * 获取git最近一次提交的commit id
 * @returns {string}
 */
m.getGitLatestCommitID = function(){
    const cmd = 'git log -1 --pretty=format:"%h"';
    const commitID = require("child_process").execSync(cmd);
    // console.log(`commitID=${commitID}`);
    return commitID.toString();
};
