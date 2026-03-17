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

let guess = Math.floor(Math.random() * 100) + 1;

/*
  prompt
  funzione controllo
  aggiorna html
*/

let win1 = window.open("", "Gioco1");
let win2 = window.open("", "Gioco2");
win1.document.body.innerHTML = "<h1>Pazzo 1</h1>";
win2.document.body.innerHTML = "<h1>Pazzo 2</h1>";
win2.document.body.innerHTML += "<h1>Pazzo 5</h1>";
const canaleGioco = new BroadcastChannel('partita_uno');

// Per inviare un dato (es. il punteggio o la mossa)
canaleGioco.postMessage({ giocatore: "Mario", azione: "indovinato", valore: 42 });

// Per ricevere i dati dall'altra finestra
canaleGioco.onmessage = (event) => {
    console.log("L'altro giocatore ha fatto:", event.data);
    // Qui aggiorni la tua interfaccia con i dati dell'altro
};

// document.getElementById("demo").innerHTML() += "<h1>";
// document.getElementById("demo").innerHTML() += "VAR";
// document.getElementById("demo").innerHTML() += "</h1>";
