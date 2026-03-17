/*
  Azzecca e azzera
  Scrivi un programma che dato un array di 100 elementi, lo riempia con numeri interi casuali da 1 a 50.
  Permetti all'utente di inserire un numero e azzera tutti i gli elementi nell'array principale che sono suoi multipli.
  Richiedi all'utente un altro numero e così via.
  Il programma termina quando tutti gli elementi dell'array principale sono uguali a zero.

  Consigli:
  Se non ricordi come generare un numero random e come convertirlo nel tuo intervallo riguarda l'esercizio sulle condizioni "Chi l'azzecca?".
  Per richiedere un numero all'utente puoi usare il comando prompt(), se vuoi saperne di più puoi controllare nella
  documentazione: https://developer.mozilla.org/it/docs/Web/API/Window/prompt

  http://www.imparareaprogrammare.it
*/
let element = function ()
{
    for (let n = 0; n < 100; ++n)
    {
        let rand = Math.floor(Math.random() * 50) + 1;
        this[n] = rand;
    }
}

let getNum = function ()
{
    let num = prompt("Insert your number from 1 to 50");
    while (1)
    {
        if (num >= 1 && num <= 50)
            break;
        num = prompt("I told ya we need a number from 1 to 50 mf")
    }
    return num;
}


let checkMultiple = function (num)
{
    arr.forEach(check = (value, index, arr) => {
        if ((value % num) == 0)
            arr[index] = 0;
    });
}

let arr = new Array();
arr.element = element;
arr.checkMultiple = checkMultiple;
arr.element();
while (arr.some(valid = (n) => {return n > 0;}))
{
    num = getNum();
    document.getElementById("demo").innerHTML = "<h2>" + num + "</h2>";
    arr.checkMultiple(num);
    console.log(arr);
}