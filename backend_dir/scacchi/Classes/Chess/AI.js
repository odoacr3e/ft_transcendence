//@ts-check

/** @template T */
class AI
{
	/** @param {string} profile */
	constructor(profile)
	{
		this.Eval = () => {};
		this.Simulate = () => {};
		this.Cancel = () => {};
		this.profile = profile;
		/** @type {T}*/
		this.data;
	}
};
