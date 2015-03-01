var util = require('util'),
    request = require('request')
http = require('http'),
client = require('./client'),
readline = require('readline');

var Port = exports.Port = function(options) {
	client.Client.call(this, options);
};
util.inherits(Port, client.Client);

Port.prototype.start = function(config, callback) {
	this._request({
		method : 'POST',
		path : '/container',
		body : config
	}, callback, function(res, result) {
		callback(null, result);
	});
};

Port.prototype.get = function(id, callback) {
	this._request('/container/' + id, callback, function(res, result) {
		callback(null, result);
	});
};

Port.prototype.wait = function(id, callback) {
	var self = this;

	function onError(e) {
		if (e)
			console.log('problem with request: ' + e.message);
		else
			console.log('problem with request: timeout');

		if (e.code !== 'ECONNREFUSED')
			process.nextTick(function() {
				self.wait(id, callback);
			});
		else
			callback(e)
	}

	if (callback) {
		this._stream('/container/' + id + '/wait', callback, function(err, res) {
			
			var rd = readline.createInterface({
				input : res,
				output : process.stdout,
				terminal : false
			});

			rd.on('line', function(line) {
				try {
					var result = JSON.parse(line);
				} catch (ex) {
					return;
				}
				callback(null, result);
			});

			res.on('error', onError);
			res.on('timeout', onError);

		}).on('error', onError);

	} else {
		callback = id;

		this._stream('/wait', callback, function(err, res) {
			
			var rd = readline.createInterface({
				input : res,
				output : process.stdout,
				terminal : false
			});

			rd.on('line', function(line) {
				try {
					var result = JSON.parse(line);
				} catch (ex) {
					return;
				}
				callback(null, result);
			});

			res.on('error', onError);
			res.on('timeout', onError);

		}).on('error', onError);

	}

};

Port.prototype.stop = function(id, callback) {
	this._request({
		method : 'DELETE',
		path : '/container/' + id
	}, callback, function(res, result) {
		callback(null, null);
	});
};

Port.prototype.running = function(callback) {
	this._request('/container', callback, function(res, result) {
		callback(null, result);
	});
};

Port.prototype.distroy = function(callback) {
	this._request({
		method : 'DELETE',
		path : '/container'
	}, callback, function(res) {
		callback();
	});
};

Port.prototype.version = function(callback) {
	this._request('/version', callback, function(res, result) {
		callback(null, result);
	});
};

Port.prototype.info = function(callback) {
	this._request('/info', callback, function(res, result) {
		callback(null, result);
	});
};

