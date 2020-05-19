const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const _ = require('lodash');
//_.filter(iterable 변수, 콜백함수) // 콜백함수가 트루인 애들만 배열에 담아서 반환
db.defaults({ user: [] }).write();
//db.get('user').push({name:"hyunsoo",age:13,id:"hyunsooklm"}).write();
// db.get('user').push({name:"jinsoo",age:15,id:"jinsooklm"}).write();
// db.get('user').push({name:"minsoo",age:12,id:"minsooklm"}).write();
let arr = db.get('user').value();
console.log(_.every(arr,function(e){return e.age>13;}));
console.log(_.find(arr,function(e){return e.id==="kinsooklm"},0));

// var users = [
//   { 'user': 'barney', 'age': 36, 'active': false },
//   { 'user': 'fred',   'age': 40, 'active': false }
// ];

// var s=_.every(users, ['active', true]);
// console.log(s);