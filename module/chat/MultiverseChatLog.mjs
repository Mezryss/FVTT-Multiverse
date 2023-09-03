import MultiverseDie from '../dice/MultiverseDie.mjs';

/**
 * Handles re-rolling a Multiverse Roll chat message with Edge or with Trouble.
 *
 * @param {JQuery} messageElement
 * @param forceLowest Whether it should forcibly re-roll the lowest die (for re-rolling with Trouble).
 */
async function doReRollForMessage(messageElement, forceLowest = false) {
	/** @type ChatMessage */
	const message = game.messages.get(messageElement.data('messageId')).clone();
	/** @type Roll */
	const roll = message.rolls[0];

	// Clone the roll & preserve its existing terms.
	const reRoll = roll.clone();
	reRoll.terms = [...message.rolls[0].terms];

	// Identify which term needs to be re-rolled.
	let dieIndex = 0;
	if (forceLowest) {
		let highestValue = reRoll.terms[0].total;

		// An M die is always considered the highest, no matter what.
		if (reRoll.terms[2].results[0]?.result === 1) {
			dieIndex = 2;
		} else {
			if (reRoll.terms[2].total > highestValue) {
				highestValue = reRoll.terms[2].total;
				dieIndex = 2;
			}

			if (reRoll.terms[4].total > highestValue) {
				dieIndex = 4;
			}
		}
	} else {
		const selectedDie = $(messageElement).find('.selected[data-die-index]');
		if (selectedDie.length === 0) {
			let lowestValue = reRoll.terms[0].total;
			if (reRoll.terms[2].total < lowestValue) {
				lowestValue = reRoll.terms[2].total;
				dieIndex = 2;
			}
			if (reRoll.terms[4].total < lowestValue) {
				dieIndex = 4;
			}
		} else {
			dieIndex = +selectedDie.first().data('die-index') * 2;
		}
	}

	// Ensure the selected die is set for re-roll.
	/** @type Die */
	let newDie = null;
	if (dieIndex === 2) {
		newDie = new MultiverseDie();
	} else {
		newDie = new Die({ faces: 6 });
	}
	reRoll.terms[dieIndex] = newDie;

	// Execute the re-roll and send to chat.
	await reRoll.reroll({ async: true });
	await reRoll.toMessage(message);
}

export class MultiverseChatLog extends ChatLog {
	/**
	 * @inheritDoc
	 */
	_getEntryContextOptions() {
		return [
			...super._getEntryContextOptions(),
			{
				name: 'Chat.ReRollWithEdge',
				icon: '<i class="fas fa-rotate"></i>',
				condition: (li) => {
					return $(li).find('.multiverse-roll').length;
				},
				callback: async (li) => await doReRollForMessage(li, false),
			},
			{
				name: 'Chat.ReRollWithTrouble',
				icon: '<i class="fas fa-rotate"></i>',
				condition: (li) => {
					return $(li).find('.multiverse-roll').length;
				},
				callback: async (li) => await doReRollForMessage(li, true),
			},
		];
	}
}

/**
 * Registers the custom ChatLog class which provides for Edge & Trouble re-roll functionality.
 */
export function registerChatLog() {
	CONFIG.ui.chat = MultiverseChatLog;
}

Hooks.on(
	'renderChatMessage',
	/**
	 * @param app
	 * @param {JQuery} html
	 */
	(app, html) => {
		html.find('[data-action="chat-select-die"]').on('click', (event) => {
			const target = $(event.currentTarget);
			const siblings = target.siblings();

			target.toggleClass('selected');
			siblings.removeClass('selected');
		});
	},
);
