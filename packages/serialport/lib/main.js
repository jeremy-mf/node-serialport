const SerialPort = require('./index');

const readyData = Buffer.from('READY')

var MESSAGE = 'z\n';
var MAX_ITERATIONS = 1000;
var num_iterations = 0;

const port = new SerialPort('/dev/ttyACM0', { baudRate: 2000000 });

const ready = port.pipe(new SerialPort.parsers.Ready({ delimiter: readyData }))

ready.on('data', (data) => {
	if(data.includes('\n')) {
		num_iterations += 1;
		if(num_iterations % 50 == 0) {
			console.log("Got response:", num_iterations)
		}
		if(num_iterations < MAX_ITERATIONS) {
			port.write(MESSAGE);
		} else {
			process.exit(0);
		}
	}
});

ready.on('ready', () => {
	port.set({ low_latency: true });
	port.write(MESSAGE);
});
