/**
 * A specialized d6 that replaces the value '1' with an 'M', which counts
 * as a 6 and turns the roll into a Fantastic result.
 */
export default class MultiverseDie extends Die {
	static DENOMINATION = 'M';

	constructor(termData) {
		super({ ...termData, faces: 6 });
	}

	/**
	 * CSS classes to apply based on the result of the die.
	 * @param {DiceTermResult} result
	 */
	getResultCSS(result) {
		let resultStyle = '';

		if (result.result === 1) {
			resultStyle = 'fantastic';
		} else if (result.result === 6) {
			resultStyle = 'max';
		}

		return ['d-multiverse', 'd6', resultStyle];
	}

	/**
	 * Returns an 'M' in place of a roll of 1.
	 *
	 * @param {DiceTermResult} result
	 * @returns {string}
	 */
	getResultLabel(result) {
		if (result.result === 1) {
			return 'M';
		}

		return result.result.toString();
	}

	/**
	 * Override default roll behavior for this die to make an 'M' result (1) count as a value of 6.
	 */
	roll({ minimize = false, maximize = false } = {}) {
		const roll = super.roll({ minimize, maximize });

		if (roll.result === 1) {
			this.results[this.results.length - 1].count = 6;
		}

		return roll;
	}
}
