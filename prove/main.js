
// Function to display something
function myDisplayer(some) {
  console.log(some);
}

// Three functions to run in steps
function step1() {
  return Promise.resolve("A");
}
function step2(value) {
  return Promise.resolve(value + "B");
}
function step3(value) {
  return Promise.resolve(value + "C");
}

// Function to run the three functions in steps
async function run() {
  let v1 = await step1();
  let v2 = await step2(v1);
  let v3 = await step3(v2);
  myDisplayer(v3);
}

run();
