exports.Port = exports.Client = require('./port').Port;

exports.createClient = function(options) {
	return new exports.Port(options);

}; 