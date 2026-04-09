let arr = new Array();
arr.push(1);
arr.push(2);
console.log(arr); // [ 1, 2 ]
console.log(arr[0], arr[1]); // 1 2
//*array accede all' oggetto arr con la chiave "0" e "1"*
arr["0"] = 12;
console.log(arr); // [ 12, 2 ]
arr["ciao"] = 2;
console.log(arr); // [ 12, 2, ciao: 2 ]
// //*dimostrazione che metodi e variabili sono interscambiabili*
console.log(arr.push);
arr[2] = arr["push"];
arr["push"] = 2;
console.log(arr.push); // 2
// arr[2](42);
// console.log(arr); // [ 12, 2, [Function: push], 42, ciao: 2, push: 2 ]