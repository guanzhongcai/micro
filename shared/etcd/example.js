const EtcdAccess = require('./EtcdAccess');

// const host = "team.gotechgames.com";
// const host = "192.168.1.119";
const host = "localhost";
const config = {
    hosts: [`http://${host}:2379`],
    username: "",
    password: "",
    ttl: 10
};

let client = new EtcdAccess(config);

async function demo() {

    const value = await client.get("key1");
    console.log(`get value=${value}`);

    client.put("key3", "bad").catch(console.error);

    let prefixValue = "/test";
    prefixValue = "key";
    const keyVals = await client.getAll(prefixValue);
    console.log(`getAll keyVals=%j`, keyVals);

    client.watchPrefix("key", function (err, result) {
        console.log(result);
    });

    return value;
}

demo().catch(console.error);
