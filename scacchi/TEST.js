/**
 * 
 * @param {string} str 
 */
export function strDelAnsi(str)
{
	let	i;
	let	j;

	while (str.includes("\x1b"))
	{
		i = str.indexOf("\x1b");
		j = str.indexOf("m");
		str = str.slice(0, i) + str.slice(j + 1);
	}
	return (str);
}

console.log(strDelAnsi(`\x1b[33mci\x1b[32mao\x1b[0m`));
console.log(strDelAnsi(`\x1b[33m\x1b[0m`));