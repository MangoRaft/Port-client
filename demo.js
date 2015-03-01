var eyes = require('eyes'),
    port = require('./lib'),
    seaport = require('seaport');

var redis0 = {
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
	"index" : 0,
	"uid" : "uid",
	"source" : "app",
	"channel" : "redis.0",
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
	"image" : ".../test/test:27",
	"ports" : ["8080/tcp"],
	cmd : "herokuish procfile start web".split(' ')
};
var redis1 = {
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
	"image" : ".../test/test:27",
	"ports" : ["8080/tcp"],
	cmd : "herokuish procfile start wseb".split(' ')
};

// Create a new client for communicating with the port server
var client = port.createClient({
	host : '127.0.0.1',
	port : 9090,
	secret : '123abc'
});

function loop() {
	// Attempt to start up a new container
	client.start(redis0, function(err, result) {
		if (err) {
			console.log('Error spawning container: ' + redis0.name);
			return console.log(err);
		}
		var id = result.container.id;

		console.log('Successfully spawned container:');
		eyes.inspect(result);
		client.stop(id, function(err, result) {
			if (err) {
				console.log('Error stopping for container: ' + redis0.name);
				return eyes.inspect(err);
			}

			console.log('stop container:');
			eyes.inspect(result);
		});

	});
	client.start(redis1, function(err, result) {
		if (err) {
			console.log('Error spawning container: ' + redis1.name);
			return eyes.inspect(err);
		}
		var id = result.container.id;

		console.log('Successfully spawned container:');
		eyes.inspect(result);
		client.stop(id, function(err, result) {
			if (err) {
				console.log('Error stopping for container: ' + redis1.name);
				return eyes.inspect(err);
			}

			console.log('stop container:');
			eyes.inspect(result);
		});

	});
}

loop();
