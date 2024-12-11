const { exec } = require('child_process');

// const portName = process.argv[2]; // Get port name from command line args
// if (!portName) {
// 	console.error('Usage: node resetProMicro.js <port_name>');
// 	process.exit(1);
// }

const listDevices = () =>
	new Promise((resolve) => {
		exec('ls /dev/{tty,cu}.*', (err, stdout) => {
			if (err) {
				resolve({ error: err.message });
				return;
			}
			resolve({ list: stdout.split('\n') });
		});
	});

(async () => {
	const devices = await listDevices();
	if (devices.error) {
		console.error(`Error: ${devices.error}`);
		return;
	}
	console.log(devices.list);
})();
