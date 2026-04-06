/** @type {string} */ let url = "https://jsonplaceholder.typicode.com/users/1";

main();

function main()
{
	getJson(url).then((obj) =>
	{
		printAll(obj);
	}
	);
}

/**
 * returns json data of the url
 * @param {string} url http url to fetch
 * @throw on failure, prints the error
 * @returns {JSON} on error returns an empty object
 */
async function getJson(url)
{
	try
	{
		let res = await fetch(url);
		let json = await res.json();
		return (json);
	}
	catch (error)
	{
		console.log(error);
	}
	return ({});
}

/**
 * print.
 * @param {*} x anything
 * @param {number} depth level of recursion
 */
function printAll (x, depth = 0)
{
	if (typeof(x) == "object")
	{
		for (let key in x)
		{
			print(depth, "\033[32mkey\033[0m: \"" + key + "\"");
			print(depth, "{");
			printAll(x[key], depth + 1);
			print(depth, "}\n");
		}
	}
	else
		print(depth, "\033[33mvalue\033[0m: \"" + x + "\"");
}

/**
 * 
 * @param {number} depth 
 * @param {*} x 
 */
function print(depth, x)
{
	let tab = "";
	while (depth--)
	{
		tab += "\t";
	}
	console.log(tab, x);
}
