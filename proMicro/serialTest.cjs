const fs = require('fs');

// Replace with your Arduino's serial port
// const portName = '/dev/cu.usbmodem14101';
const portName = '/dev/cu.usbserial-1450';

// Open the serial port for read/write
const serialPort = fs.createWriteStream(portName, { flags: 'w+' });

serialPort.on('error', (err) => {
	console.error('Error:', err.message);
});

serialPort.write(
	Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff]),
	(err) => {
		if (err) {
			console.error('Error writing to port:', err.message);
		} else {
			console.log('Message sent to Arduino.');
		}
	}
);

// Open the serial port for reading
fs.createReadStream(portName)
	.on('data', (data) => {
		console.log('Received from Arduino:', data.toString());
	})
	.on('error', (err) => {
		console.error('Error reading from port:', err.message);
	});
