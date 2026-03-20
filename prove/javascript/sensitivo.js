/*
  Fai il sensitivo
  Scrivi una funzione che calcoli la vicinanza tra tre numeri: A, B e N, e restituisca:
    - 0 Se A e B sono equidistanti da N
    - 1 Se B è più vicino a N rispetto ad A
    - -1 Se A è più vicino a N rispetto a B

  Variante:
  Utilizza questa funzione per creare un programma che simuli un gioco tra due utenti:
  vince chi indovina per primo il numero N che verrà generato casualmente tra 1 e 100.

  Consigli per la variante:
  Se non ricordi come generare un numero random e come convertirlo nel tuo intervallo riguarda l'esercizio sulle condizioni "Chi l'azzecca?".
  Se non ricordi come richiedere all'utente un valore in input, rivedi l'esercizio sugli array "Azzecca e azzera"

  http://www.imparareaprogrammare.it
*/

let checkValue = function (guess, num)
{
  if (guess > num)
    return "<h2 style=\"color:white;text-align:center;\">Number too high</h2>";
  else if (guess < num)
    return "<h2 style=\"color:white;text-align:center;\">Number too low</h2>";
  else
    return "<h2 style=\"color:white;text-align:center;\">Right guess</h2>";
}

let num = Math.floor(Math.random() * 100) + 1;
console.log(num);

let win1 = window.open("", "Player1");
let win2 = window.open("", "Player2");
while (1)
{
  let guess2 = win2.window.prompt("Choose a number between 1 and 100");
  let guess1 = win1.window.prompt("Choose a number between 1 and 100");

  if (guess1 == guess2 && guess1 == num)
  {
    win1.document.body.innerHTML += "<h2>Tie!</h2>";
    win2.document.body.innerHTML += "<h2>Tie!</h2>";
    break;
  }
  let alert2 = checkValue(guess2, num);
  win2.document.body.innerHTML += alert2;
  let alert1 = checkValue(guess1, num);
  win1.document.body.innerHTML += alert1alert2;
  if (alert1 == "Right guess" || alert2 == "Right guess")
    break;
}
win1.close;
win2.close;
