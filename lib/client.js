var request = require('request'),
    base64 = require('utile').base64;

var Client = exports.Client = function(options) {
	this.options = options || {};

	if ( typeof this.options.get !== 'function') {
		this.options.get = function(key) {
			return this[key];
		};
	}

	this.config = {
		host : options.host || 'localhost',
		port : options.port || 9002,
		secret : options.secret
	};
};

Client.prototype.failCodes = {
	400 : 'Bad Request',
	401 : 'Not authorized',
	403 : 'Forbidden',
	404 : 'Item not found',
	500 : 'Internal Server Error'
};

Client.prototype.successCodes = {
	200 : 'OK',
	201 : 'Created'
};

Client.prototype.__defineGetter__('remoteUri', function() {
	return 'http://' + this.config.host + ':' + this.config.port;
});

Client.prototype._request = function(options, callback, success) {
	var self = this;

	if ( typeof options === 'string') {
		options = {
			path : options
		};
	}

	options.method = options.method || 'GET';
	options.uri = this.remoteUri + options.path;
	options.headers = options.headers || {};
	options.headers['content-type'] = options.headers['content-type'] || 'application/json';
	if (this.config.secret)
		options.headers['secret'] = this.config.secret;
	options.timeout = 120 * 60 * 60 * 1000;

	if (options.headers['content-type'] === 'application/json' && options.body) {
		options.body = JSON.stringify(options.body);
	}

	return request(options, function(err, response, body) {
		if (err) {
			return callback(err);
		}

		var statusCode = response.statusCode.toString(),
		    result,
		    error;

		try {
			result = JSON.parse(body);
		} catch (ex) {
			// Ignore Errors
		}

		if (Object.keys(self.failCodes).indexOf(statusCode) !== -1) {
			error = new Error('port Error (' + statusCode + '): ' + self.failCodes[statusCode]);
			error.result = result;
			error.status = statusCode;
			return callback(error);
		}

		success(response, result);
	}).on('error', function(err) {
		console.log(err)
	});
};
Client.prototype._stream = function(options, callback, success) {
	var self = this;

	if ( typeof options === 'string') {
		options = {
			path : options
		};
	}

	options.method = 'GET';

	options.hostname = this.config.host;
	options.port = this.config.port;

	options.headers = options.headers || {};
	options.headers['content-type'] = options.headers['content-type'] || 'application/json';
	if (this.config.secret)
		options.headers['secret'] = this.config.secret;

	var req = http.request(options, function(res) {
		res.setTimeout(120 * 60 * 60 * 100, callback);
		success(null, res);
	});
	req.setTimeout(120 * 60 * 60 * 100, callback);
	req.end()
	return req;
};
