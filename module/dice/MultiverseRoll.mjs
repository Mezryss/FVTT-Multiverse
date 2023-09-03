import MultiverseDie from './MultiverseDie.mjs';

export default class MultiverseRoll extends Roll {
	static CHAT_TEMPLATE = 'systems/multiverse/templates/dice/roll.hbs';

	/**
	 * Override the default Roll rendering behavior to account for a difference between d616 rolls and other rolls.
	 *
	 * @param {string} flavor Optional flavor text for the roll.
	 * @param {string} template Chat template path.
	 * @param {boolean} isPrivate Whether the roll is private.
	 */
	async render({ flavor, template = this.constructor.CHAT_TEMPLATE, isPrivate = false } = {}) {
		if (!this._evaluated) {
			await this.evaluate({ async: true });
		}

		const isMultiverseRoll = this.dice.length === 3 && this.dice[0].faces === 6 && this.dice[1] instanceof MultiverseDie && this.dice[2].faces === 6;

		if (!isMultiverseRoll) {
			const useTemplate = template === this.constructor.CHAT_TEMPLATE ? Roll.CHAT_TEMPLATE : template;

			return super.render({ flavor, template: useTemplate, isPrivate });
		}

		const isFantastic = this.dice[1].getResultLabel(this.dice[1].results[0]) === 'M';

		const modifierTerms = [...this.terms];
		modifierTerms.splice(0, 5);

		const modifiers = modifierTerms.reduce(
			/**
			 * @typedef {object} ResolvedModifier
			 * @property {string} operator Term symbol
			 * @property {number} value The actual term
			 * @property {string} flavor Flavor text
			 */
			/**
			 * @param {ResolvedModifier[]} mods
			 * @param term
			 */
			(mods, term) => {
				if (term.operator) {
					return [
						...mods,
						{
							operator: term.operator,
							number: 0,
							flavor: undefined,
						},
					];
				} else {
					mods[mods.length - 1].number = term.number;
					mods[mods.length - 1].flavor = term.options?.flavor;

					return mods;
				}
			},
			[],
		);

		const chatData = {
			dice: this.dice.map((d) => d.getTooltipData()),
			flavor: isPrivate ? null : flavor,
			isFantastic,
			isPrivate,
			modifiers,
			total: isPrivate ? '?' : Math.round(this.total * 100) / 100,
			user: game.user.id,
		};

		return renderTemplate(template, chatData);
	}
}
