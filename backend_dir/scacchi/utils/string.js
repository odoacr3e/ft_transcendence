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

/**
 * counts the occurences of needle in haystack
 * @param {string} haystack the bigger string
 * @param {string} needle the substring to find
 */
function strCount(haystack, needle)
{
	let	needleLen;
	let	count;
	let	i;

	needleLen = needle.length;
	count = 0;
	i = 0;
	while (i != haystack.length)
	{
		if (haystack.slice(i, i + needleLen) == needle)
			count++;
		i++;
	}
	return (count);
}

/**
 * 
 * @param {String} string 
 */
function isLowerCase(string)
{
	let	chr = string.charCodeAt(0);

	if (string.length <= 0)
		return (false);
	return (chr >= 97 && chr <= 122);
}

export {includesOneOf, strCount, isLowerCase};