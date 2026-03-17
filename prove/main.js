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