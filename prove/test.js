function plus(n) {n += 1;return n;};

let ar = new Array();
ar = [1, 1, 1];
console.log("before");
console.table(ar);
let  arr = ar.map(p => plus(p));
console.log("after");
console.table(arr);