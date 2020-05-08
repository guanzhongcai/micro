/**
 * demo
 */

let person = require('./person.json');
let ProtoBuf = require('./ProtoBuf.js');

const pbDemo = new ProtoBuf(person);

//序列化
let infoData = {};
let game = {};
game.name = 'lol';
game.type = 'MOBA';
infoData.game = [game];
infoData.name = 'ezLeo';
infoData.age = 24;
infoData.sex = 0;
let infoEncodeMessage = pbDemo.Encode("user.UserInfo", infoData);
console.log(`infoData len`, JSON.stringify(infoData).length);
console.log(`infoEncodeMessage len`, infoEncodeMessage.length);

//反序列化
let infoUnSerialized = pbDemo.Decode("user.UserInfo", infoEncodeMessage);
console.log(`infoUnSerialized len`, JSON.stringify(infoUnSerialized).length);
console.log("unserialized info message:");
console.log(infoUnSerialized);
