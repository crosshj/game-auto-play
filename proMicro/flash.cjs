const { exec } = require('child_process');

// const portName = process.argv[2]; // Get port name from command line args
// if (!portName) {
// 	console.error('Usage: node resetProMicro.js <port_name>');
// 	process.exit(1);
// }

//TODO: get list of devices from `ls /dev/{tty,cu}.*`
const listDevices = () =>
	new Promise((resolve) => {
		const command = 'ls /dev/{tty,cu}.*';
		console.log(command);
		exec(command, (err, stdout) => {
			if (err) {
				resolve({ error: err.message });
				return;
			}
			resolve({ list: stdout.split('\n') });
		});
	});

const getUserChoice = async (devices) => {
	console.log(devices);
	const deviceChoices = devices
		.filter((x) => x)
		.map((device, index) => `${index + 1}: ${device}`);
	console.log('Choose a device to reset:');
	console.log(deviceChoices.join('\n'));

	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const choice = await new Promise((resolve) => {
		rl.question('\nEnter choice: ', (answer) => {
			rl.close();
			resolve(answer);
		});
	});
	return devices[choice - 1];
};

const resestSignal = ({ portName }) =>
	new Promise((resolve) => {
		const command = `stty 1200 < ${portName}`;
		console.log(command);
		exec(command, (err) => {
			resolve(err ? { error: err.message } : {});
		});
	});

const confirmDevice = ({ portName, avrDudeConf }) =>
	new Promise((resolve) => {
		// const command = `avrdude -C ${avrDudeConf} -v -p atmega32u4 -c avr109 -P ${portName} -b 57600`;
		const command = `avrdude -v -p atmega32u4 -c avr109 -P ${portName} -b 57600`;
		console.log(command);
		exec(command, (err, stdout, stderr) => {
			if (err) {
				resolve({ error: err.message.split('\n')[1] });
				return;
			}
			resolve({ output: stdout, errorOutput: stderr });
		});
	});

const flashHex = ({ portName, hexFilePath, avrDudeConf }) =>
	new Promise((resolve) => {
		// const command = `avrdude -C ${avrDudeConf} -v -p atmega32u4 -c avr109 -P ${portName} -b 57600 -D -U flash:w:${hexFilePath}:i`;
		// const command = `avrdude -v -p atmega32u4 -c avr109 -P ${portName} -b 19200 -D -U flash:w:${hexFilePath}:i`;

		const command1 = `"/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/bin/avrdude" "-C/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/etc/avrdude.conf" -v -patmega32u4 -cstk500v1 -P/dev/cu.usbmodem1461201 -b19200 -e -Ulock:w:0x3F:m -Uefuse:w:0xCB:m -Uhfuse:w:0xD8:m -Ulfuse:w:0xFF:m`;
		const command2 = `"/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/bin/avrdude" "-C/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/etc/avrdude.conf" -v -patmega32u4 -cstk500v1 -P/dev/cu.usbmodem1461201 -b19200 "-Uflash:w:${hexFilePath}:i" -Ulock:w:0x2F:m`;
		//"/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/bin/avrdude" "-C/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/etc/avrdude.conf" -v -patmega32u4 -cstk500v1 -P/dev/cu.usbmodem1461201 -b19200 -e -Ulock:w:0x3F:m -Uefuse:w:0xCB:m -Uhfuse:w:0xD8:m -Ulfuse:w:0xFF:m
		//"/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/bin/avrdude" "-C/Users/anthrowareadmin/Library/Arduino15/packages/arduino/tools/avrdude/6.3.0-arduino17/etc/avrdude.conf" -v -patmega32u4 -cstk500v1 -P/dev/cu.usbmodem1461201 -b19200 "-Uflash:w:/Users/anthrowareadmin/Library/Arduino15/packages/SparkFun/hardware/avr/1.1.13/bootloaders/caterina/Caterina-promicro16.hex:i" -Ulock:w:0x2F:m

		//TODO: run command1 and then command2, be verbose with output
		console.log('Running command1...');
		exec(command1, (err, stdout, stderr) => {
			if (err) {
				resolve({ error: err.message.split('\n') });
				return;
			}
			console.log(stdout);
			console.error(stderr);

			console.log('Running command2...');
			exec(command2, (err, stdout, stderr) => {
				if (err) {
					resolve({ error: err.message.split('\n') });
					return;
				}
				console.log(stdout);
				console.error(stderr);
				resolve({ output: stdout, errorOutput: stderr });
			});
		});

		// console.log(command);
		// exec(command, (err, stdout, stderr) => {
		// 	if (err) {
		// 		resolve({ error: err.message.split('\n') });
		// 		return;
		// 	}
		// 	resolve({ output: stdout, errorOutput: stderr });
		// });
	});

(async () => {
	// const devices = await listDevices();
	// if (devices.error) {
	// 	console.error(`Error: ${devices.error}`);
	// 	return;
	// }
	// const portName = await getUserChoice(devices.list);
	// console.log(`Selected device: ${portName}\n`);

	// const result = await resestSignal({ portName });
	// if (result.error) {
	// 	console.error(`Error: ${result.error}`);
	// 	return;
	// }
	// console.log('Reset signal sent.  Now in bootloader flash mode.\n');

	// wait after reset signal
	// await new Promise((resolve) => setTimeout(resolve, 1000));

	// const devicesToFlash = await listDevices();
	// console.log(devicesToFlash.list);

	// const avrDudeConf = '/usr/local/etc/avrdude.conf';
	// const hexFilePath = 'promicro_Joystick.hex';
	const hexFilePath =
		'/Users/anthrowareadmin/repos/game-auto-play/proMicro/promicro_Joystick.hex';

	// const deviceConfirmed = await confirmDevice({ portName, avrDudeConf });
	// console.log(deviceConfirmed);

	const flashResult = await flashHex({
		// portName,
		hexFilePath,
		// avrDudeConf,
	});
	// console.log(flashResult);
	console.log('\n');
})();
