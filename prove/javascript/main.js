const promise1 = new Promise(resolve => setTimeout(() => resolve('First result'), 1000));
const promise2 = new Promise(resolve => setTimeout(() => resolve('Second result'), 500));
const promise3 = new Promise(resolve => setTimeout(() => resolve('Third result'), 200));

Promise.race([promise1, promise2, promise3])
  .then(result => {
    console.log('Fastest result:', result);
  });