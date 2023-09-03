import { registerChatLog } from './chat/MultiverseChatLog.mjs';
import MultiverseDie from './dice/MultiverseDie.mjs';
import MultiverseRoll from './dice/MultiverseRoll.mjs';
import { registerHandlebarsHelpers } from './HandlebarsHelpers.mjs';

Hooks.once('init', () => {
	console.log('Multiverse RPG | Init');

	// Initialize the value of `game.Multiverse`.
	initMultiverseObject();

	// Handle registration of misc. subsystems.
	registerChatLog();
	registerDice();
	registerHandlebarsHelpers();

	console.log('Multiverse RPG | Init Complete');
});

/**
 * Value of `game.Multiverse`, enabling access to Multiverse system classes for modules and macros.
 *
 * @typedef {object} MultiverseGame
 *
 * @property {typeof MultiverseRoll} Roll Multiverse Roll class.
 */

/**
 * @typedef {object} Game
 *
 * @property {MultiverseGame} Multiverse
 */

/**
 * Initialize the Multiverse object within the global `game` object.
 */
function initMultiverseObject() {
	game.Multiverse = {
		// Register classes we want to make available to modules & macros.
		Roll: MultiverseRoll,
	};
}

/**
 * Register custom dice terms.
 */
function registerDice() {
	CONFIG.Dice.rolls[0] = MultiverseRoll;
	CONFIG.Dice.terms.m = MultiverseDie;
}
