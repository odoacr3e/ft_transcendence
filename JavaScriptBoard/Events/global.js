import { ROOT_DIV } from "../Helper/constants.js";
import { Board } from "../main.js";

function globalEvents()
{
	ROOT_DIV.addEventListener("click", function (event) {
		if (event.target.localName === "img")
			console.log(event.target.parentNode.id);
		});
}

export { globalEvents };
