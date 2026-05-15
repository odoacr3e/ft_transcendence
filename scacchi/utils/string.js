// @ts-check

/**
 * checks if one on the strings is present in the source string
 * @param {String} str  the source string 
 * @var .one or more string to compare, OR an Array
 * @returns {string} the first string found if a match exists, else ""
 */
function includesOneOf(str)
{
	let list = arguments;
	let i = 0;

	if (list[1] == "")
		return ("");
	if (typeof(list[1]) != "string")
		list = list[1];
	else
		i = 1;
    for (; i != list.length; i++)
    {
        if (str == list[i])
            return (list[i]);
    }
    return ("");
}

module.exports = {includesOneOf};