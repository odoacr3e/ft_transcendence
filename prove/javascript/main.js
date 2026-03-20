async function test2(){

 setTimeout(()=> console.log("1"),10);

 setTimeout(()=> console.log("2"),0);

 await Promise.resolve();

 console.log("3");

}

test2();

console.log("4");