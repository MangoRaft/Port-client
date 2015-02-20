var util = require('util'),
    request = require('request'),
    client = require('./client');

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
	this._request('/container/' + id + '/wait', callback, function(res, result) {
		callback(null, result);
	});
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

