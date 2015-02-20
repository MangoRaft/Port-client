var eyes = require('eyes'),
    port = require('./lib'),
    seaport = require('seaport');

var ports = seaport.connect('localhost', 9090);

ports.get('us-dev-test', function(ps) {

	// Create a new client for communicating with the port server
	var client = port.createClient({
		host : ps[0].host,
		port : ps[0].port,
		secret : ps[0].secret
	});

	var redis = {
		"metrics" : {
			"port" : 4001,
			"host" : "127.0.0.1"
		},
		"metricSesion" : "docker.test",
		"logs" : {
			"web" : {
				"port" : 5000,
				"host" : "127.0.0.1"
			},
			"udp" : {
				"port" : 5000,
				"host" : "127.0.0.1"
			},
			"view" : {
				"port" : 5000,
				"host" : "127.0.0.1"
			}
		},
		"logSession" : "docker.test",
		"source" : "app",
		"channel" : "redis.1",
		"name" : "docker.test",
		"index" : 1,
		"env" : {
			"hello" : "world"
		},
		"uid" : "uid",
		"username" : "demo",
		"limits" : {
			"memory" : 128,
			"cpuShares" : 256,
			"cpuset" : "0,1"
		},
		"image" : "redis",
		"exposedPorts" : ["6379/tcp"]
	};

	// Attempt to start up a new container
	client.start(redis, function(err, result) {
		if (err) {
			console.log('Error spawning container: ' + redis.name);
			return eyes.inspect(err);
		}
		var id = result.container.id;

		console.log('Successfully spawned container:');
		eyes.inspect(result);
		client.wait(id, function(err, result) {
			if (err) {
				console.log('Error waiting for container: ' + redis.name);
				return eyes.inspect(err);
			}

			eyes.inspect(result);
		});
		setTimeout(function() {
			client.stop(id, function(err, result) {
				if (err) {
					console.log('Error stopping for container: ' + redis.name);
					return eyes.inspect(err);
				}

				eyes.inspect(result);
			});
		}, 500);

	});
});
