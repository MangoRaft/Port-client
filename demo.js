var eyes = require('eyes'),
    port = require('./lib'),
    seaport = require('seaport');

var ports = seaport.connect('localhost', 9090);

var redis = {
	"logs" : {
		"web" : {
			"port" : 80,
			"host" : "..."
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
	"name" : "docker.test",
	"index" : 1,
	"uid" : "uid",
	"source" : "app",
	"channel" : "redis.1",
	"process" : "web",
	"volumes" : {},
	"env" : {
		"hello" : "world"
	},
	"limits" : {
		"memory" : 128,
		"cpuShares" : 256,
		"cpuset" : "0,1"
	},
	"image" : "redis",
	"ports" : ["6379/tcp"]
};

ports.get('us-dev-test', function(ps) {

	// Create a new client for communicating with the port server
	var client = port.createClient({
		host : ps[0].host,
		port : ps[0].port,
		secret : ps[0].secret
	});
	client.wait(function(err, result) {
		if (err) {
			console.log('Error waiting for container: ' + redis.name);
			return eyes.inspect(err);
		}
		console.log('global wait');
		eyes.inspect(result);
		loop();
	});

	function loop() {
		// Attempt to start up a new container
		client.start(redis, function(err, result) {
			if (err) {
				console.log('Error spawning container: ' + redis.name);
				return eyes.inspect(err);
			}
			var id = result.container.id;

			console.log('Successfully spawned container:');
			eyes.inspect(result);
			client.stop(id, function(err, result) {
				if (err) {
					console.log('Error stopping for container: ' + redis.name);
					return eyes.inspect(err);
				}

				console.log('stop container:');
				eyes.inspect(result);
			});

		});
	}

	loop();
});
