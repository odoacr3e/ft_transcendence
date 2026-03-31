const { ALL } = require("node:dns");

function plus(n) {n += 1;return n;};

let ar = new Array();
ar = [1, 1, 1];
console.log("before");
console.table(ar);
let  arr = ar.map(p => plus(p));
console.log("after");
console.table(arr);
let map = new Map();
let map2 = new Map();
map["test"] = 42;
map.set("test3", 42);
map2["test2"] = 42;
const {test} = map;
const {test3} = map;
const {test2} = map2;
map["assurdo"] = 4242;
const {assurdo, pippo} = map;
// map.clear();
console.log(`${test3}`);