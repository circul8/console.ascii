{
	const ascii = require('./lib.js');

	if (window.console) {
		console.ascii = function(find, settings = {}) {
			const asciiObj = new ascii(settings);
			asciiObj.get(find);
		}
	}
}