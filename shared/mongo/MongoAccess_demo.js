
let Schema = require('mongoose').Schema;
const MongoAccess = require('./MongoAccess');

let m1 = new MongoAccess();
let m2 = new MongoAccess();

const uri1 = "mongodb://root:gotech123@gocc.gotechgames.com:4717/sggame1?authSource=admin";
const uri2 = "mongodb://root:gotech123@gocc.gotechgames.com:4717/sggame2?authSource=admin";

let Player1 = new Schema({
    uid: Number,
    nick: String
});

let Player2 = new Schema({
    uid: Number,
    nick: String
});

let models1 = {
    Player: Player1,
};

let models2 = {
    Player: Player2,
};

m1.connect(uri1, {}, models1,function (err, ret) {
     console.log("connect1 ", err, ret);
     m1.updateOne(models1.Player, {uid: 10001}, {$set: {nick: "one1"}}, {upsert: true});

     m2.connect(uri2, {}, models2, function (err, ret2) {
         console.log("connect2 ", err, ret);
         m2.updateOne(models2.Player, {uid: 10002}, {$set: {nick: "two2"}}, {upsert: true});

         m1.updateOne(models1.Player, {uid: 10001}, {$set: {nick: "one-1"}}, {upsert: true});
         m2.updateOne(models2.Player, {uid: 10002}, {$set: {nick: "two-2"}}, {upsert: true});
     })
});
