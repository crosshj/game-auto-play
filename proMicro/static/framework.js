import { grabFrame } from './webcam.utils.js';

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const range = (start, end) =>
	Array.from({ length: end - start }, (_, i) => start + i);

export const timer = () => {
	let start;
	const minsSecs = (timeTaken) => {
		const minutes = Math.floor(timeTaken / 60000);
		const seconds = ((timeTaken % 60000) / 1000).toFixed(0);
		return { minutes, seconds };
	};
	return {
		start: () => {
			start = Date.now();
		},
		stop: () => {
			const time = minsSecs(Date.now() - start);
			console.log(
				`Time taken: ${time.minutes} minutes and ${time.seconds} seconds`
			);
		},
	};
};

export const command = {
	BTN_NONE: () => sendCommand('BTN_NONE'),
	BTN_Y: () => sendCommand('BTN_Y'),
	BTN_B: () => sendCommand('BTN_B'),
	BTN_A: () => sendCommand('BTN_A'),
	BTN_X: () => sendCommand('BTN_X'),
	BTN_L: () => sendCommand('BTN_L'),
	BTN_R: () => sendCommand('BTN_R'),
	BTN_ZL: () => sendCommand('BTN_ZL'),
	BTN_ZR: () => sendCommand('BTN_ZR'),
	BTN_MINUS: () => sendCommand('BTN_MINUS'),
	BTN_PLUS: () => sendCommand('BTN_PLUS'),
	BTN_LCLICK: () => sendCommand('BTN_LCLICK'),
	BTN_RCLICK: () => sendCommand('BTN_RCLICK'),
	BTN_HOME: () => sendCommand('BTN_HOME'),
	BTN_CAPTURE: () => sendCommand('BTN_CAPTURE'),
	DPAD_CENTER: () => sendCommand('DPAD_CENTER'),
	DPAD_U: () => sendCommand('DPAD_U'),
	DPAD_R: () => sendCommand('DPAD_R'),
	DPAD_D: () => sendCommand('DPAD_D'),
	DPAD_L: () => sendCommand('DPAD_L'),
	DPAD_U_R: () => sendCommand('DPAD_U_R'),
	DPAD_D_R: () => sendCommand('DPAD_D_R'),
	DPAD_U_L: () => sendCommand('DPAD_U_L'),
	DPAD_D_L: () => sendCommand('DPAD_D_L'),
	LSTICK_CENTER: () => sendCommand('LSTICK_CENTER'),
	LSTICK_R: () => sendCommand('LSTICK_R'),
	LSTICK_U_R: () => sendCommand('LSTICK_U_R'),
	LSTICK_U: () => sendCommand('LSTICK_U'),
	LSTICK_U_L: () => sendCommand('LSTICK_U_L'),
	LSTICK_L: () => sendCommand('LSTICK_L'),
	LSTICK_D_L: () => sendCommand('LSTICK_D_L'),
	LSTICK_D: () => sendCommand('LSTICK_D'),
	LSTICK_D_R: () => sendCommand('LSTICK_D_R'),
	RSTICK_CENTER: () => sendCommand('RSTICK_CENTER'),
	RSTICK_R: () => sendCommand('RSTICK_R'),
	RSTICK_U_R: () => sendCommand('RSTICK_U_R'),
	RSTICK_U: () => sendCommand('RSTICK_U'),
	RSTICK_U_L: () => sendCommand('RSTICK_U_L'),
	RSTICK_L: () => sendCommand('RSTICK_L'),
	RSTICK_D_L: () => sendCommand('RSTICK_D_L'),
	RSTICK_D: () => sendCommand('RSTICK_D'),
	RSTICK_D_R: () => sendCommand('RSTICK_D_R'),
	NO_INPUT: () => sendCommand('NO_INPUT'),
	list: (commands) => sendCommand(commands),
};

export const setupFramework = () => {
	document.querySelectorAll('.controls button').forEach((button) => {
		button.addEventListener('mousedown', () => {
			sendCommand(button.dataset.command);
		});
		button.addEventListener('mouseup', () => {
			sendCommand('NO_INPUT');
		});
	});

	document.querySelectorAll('.dpad button').forEach((dpad) => {
		dpad.addEventListener('mousedown', () => {
			sendCommand(dpad.dataset.command);
		});
		dpad.addEventListener('mouseup', () => {
			sendCommand('NO_INPUT');
		});
	});

	document.addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'ArrowUp':
				sendCommand('DPAD_U');
				break;
			case 'ArrowRight':
				sendCommand('DPAD_R');
				break;
			case 'ArrowDown':
				sendCommand('DPAD_D');
				break;
			case 'ArrowLeft':
				sendCommand('DPAD_L');
				break;
		}
	});

	document.addEventListener('keyup', (event) => {
		sendCommand('NO_INPUT');
	});
};

const sendCommand = async (command) => {
	await fetch('./send_cmd', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ command }),
	})
		.then((response) => response.json())
		.then((data) => {
			// console.log('Success:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
};

export const nurseryMan = async () => {
	const frame = await grabFrame({
		x: 345,
		y: 195,
		w: 50,
		h: 50,
	});

	// For debugging, add/update the frame to the DOM
	const existingFrame = document.getElementById('debug-frame');
	if (existingFrame) {
		existingFrame.src = frame.canvas.toDataURL('image/png');
	} else {
		const img = document.createElement('img');
		img.id = 'debug-frame';
		img.src = frame.canvas.toDataURL('image/png');
		document.body.appendChild(img);
	}

	const { direction } = await fetch('/nurseryMan', {
		method: 'POST',
		body: JSON.stringify({ image: frame.canvas.toDataURL('image/png') }),
		headers: { 'Content-Type': 'application/json' },
	}).then((response) => response.json());
	return direction;
};

export const shinyCheck = async () => {
	const frame = await grabFrame({
		x: 610,
		y: 67,
		w: 30,
		h: 30,
	});

	// For debugging, add/update the frame to the DOM
	const existingFrame = document.getElementById('debug-frame');
	if (existingFrame) {
		existingFrame.src = frame.canvas.toDataURL('image/png');
	} else {
		const img = document.createElement('img');
		img.id = 'debug-frame';
		img.src = frame.canvas.toDataURL('image/png');
		document.body.appendChild(img);
	}

	const { shiny } = await fetch('/shinyCheck', {
		method: 'POST',
		body: JSON.stringify({ image: frame.canvas.toDataURL('image/png') }),
		headers: { 'Content-Type': 'application/json' },
	}).then((response) => response.json());
	return shiny;
};
