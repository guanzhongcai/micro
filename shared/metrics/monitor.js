/**
 * 监控数据接口
 * author gzc
 * 2020-3-10
 */

let monitor = require('pomelo-monitor');
const pidusage = require('pidusage');

// Compute statistics every second:

exports.getProfile = function (cb) {

    getSystemInfo(function (err, system) {

        pidusage(process.pid, function (err, stats) {
            // => {
            //   cpu: 10.0,            // percentage (from 0 to 100*vcore)
            //   memory: 357306368,    // bytes
            //   ppid: 312,            // PPID
            //   pid: 727,             // PID
            //   ctime: 867000,        // ms user + system time
            //   elapsed: 6650000,     // ms since the start of the process
            //   timestamp: 864000000  // ms since epoch
            // }

            let profile = {
                process: stats,
                system: system,
                uptime: process.uptime(),
            };
            // console.debug(`getProfile:: %j`, result);
            cb(null, profile);
        })
    });
};

function getSystemInfo(cb) {

    monitor.sysmonitor.getSysInfo(function (err, data) {
        // console.debug(`getSysInfo`, data);
        let system = {
            hostname: 'localhost',
            type: 'Darwin',
            platform: 'darwin',
            arch: 'x64',
            release: '19.3.0',
            // uptime: 0.15,
            // loadavg: [2.89404296875, 2.880859375, 2.8125],
            totalmem: 17179869184,
            freemem: 88674304,
            memoryUsage:
                {
                    rss: 20770816,
                    heapTotal: 9207808,
                    heapUsed: 4339456,
                    external: 8686
                },
            cpuInfo: {
                speed: 0,
                core: 0
            }
        };
        for (const key in system) {
            if (data[key] === undefined) {
                continue;
            }
            system[key] = data[key];
        }
        system.cpuInfo.speed = data.cpus[0].speed;
        system.cpuInfo.core = data.cpus.length;
        cb(err, system);
    });
}
