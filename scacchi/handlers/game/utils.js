// @ts-check

class Result
{
	/**
	 * 
	 * @param {Result | null} other 
	 */
	constructor (other=null)
	{
		/** @type {Number | null} */this.status = null;
		/** @type {string | null} */this.msg = "OK";
		
		if (!other)
			return ;
		this.status = other.status;
		this.msg = other.msg;
	}
}

/**
 * check the validity of the input received by the move function.
 * @param {Result} result 
 * @param {String | undefined} from optional: if passed, checks if it's valid
 * @param {String | undefined} to optional: if passed, checks if it's valid
 * @returns {boolean} true if success, false if failure
 */
function paramCheck(result, from="ignoreCheck", to="ignoreCheck")
{
	if (!from)
		return (error(result, 400, `invalid param from "${from}"`));
	if (!to)
		return (error(result, 400, `invalid param from "${to}"`));
	return (true);
}

/**
 * 
 * @param {Result} result 
 * @param {Number} status 
 * @param {String} msg 
 * @returns {boolean} always return false
 */
function error(result, status, msg)
{
	result.msg = msg;
	result.status = status;
	return (false);
}

module.exports = {Result, paramCheck, error};