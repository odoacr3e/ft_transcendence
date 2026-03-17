function Food(carbo, protein, fat)
{
	this.carbo = carbo;
	this.protein = protein;
	this.fat = fat;
	this.total = carbo * 4 + protein * 4 + fat * 9;
	this.update_total = function ()
	{
		this.total = this.carbo * 4 + this.protein * 4 + this.fat * 9;
	};
}

const dict = new Map([
	// PROTEINE ANIMALI (CRUDE)
	["pollo", new Food(0, 23, 1)],
	["uovo", new Food(1.1, 13, 11)],
	["salmone", new Food(0, 20, 13)],
	["bistecca", new Food(0, 20, 5)],
	["latte", new Food(4.8, 3.3, 3.6)],

	// CEREALI E LEGUMI (SECCHI/CRUDI)
	["pasta", new Food(71, 13, 1.5)],
	["riso", new Food(80, 7, 0.6)],
	["ceci", new Food(61, 19, 6)],
	["lenticchie", new Food(60, 25, 1)],

	// FRUTTA
	["mela", new Food(14, 0.3, 0.2)],
	["banana", new Food(23, 1.1, 0.3)],
	["ananas", new Food(13, 0.5, 0.1)],
	["cocomero", new Food(8, 0.6, 0.2)],

	// VERDURA
	["lattuga", new Food(2.9, 1.4, 0.2)],
	["zucchine", new Food(3.1, 1.2, 0.3)],
	["zucca", new Food(6.5, 1, 0.1)],

	// GRASSI E CONDIMENTI
	["tahina", new Food(18, 17, 54)],
	["mandorle", new Food(22, 21, 49)],
	["avocado", new Food(8.5, 2, 15)]
]);

for (let [key, val] of dict)
{
	console.log(key, ": ");
	console.table(val);
}