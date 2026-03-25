import { printPost } from "./pippo.js";

async function caricaUtenti(event) {
  if (event.key != "Enter") {
    return;
  }

  try {
	document.getElementById("lista").innerHTML = "Loading...";
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
	if (!response.ok)
	{
		throw "Error";
	}
    const users = await response.json();
    const ul = document.getElementById("lista");
	document.getElementById("lista").innerHTML = "";

    for (let user of users) {
      console.log(user.name, user.email);

      const li = document.createElement("button");
      li.textContent = user.name;
	  li.id = user.id;
      ul.appendChild(li);
	  document.getElementById(user.id).addEventListener("click", printPost);
    }

  } catch (error) {
    console.log("Errore:", error);
  }
}


document.addEventListener("keydown", caricaUtenti);
