export function registerHandlebarsHelpers() {
	Handlebars.registerHelper('nonEmpty', (arr) => {
		return arr.filter((v) => v !== undefined && v !== null && v !== '');
	});

	Handlebars.registerHelper('join', (arr, joinBy) => {
		return arr.join(joinBy);
	});
}
