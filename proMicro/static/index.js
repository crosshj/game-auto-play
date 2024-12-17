import {
	command,
	nurseryMan,
	range,
	setupFramework,
	shinyCheck,
	sleep,
	timer,
} from './framework.js';

const t = timer();

const tap = async (fn, number = 1) => {
	for (const _ of new Array(number)) {
		await fn();
		await sleep(200);
		await command.BTN_NONE();
		await sleep(200);
	}
};

const rideBike = async () => {
	t.start();
	for (const it of range(1, 17)) {
		console.log(`Ride bike: ${it}`);
		if (it % 2 == 1) {
			await command.DPAD_U();
		} else {
			await command.DPAD_D();
		}
		await sleep(11000);
	}
	tap(command.NO_INPUT);
	await sleep(1000);
	command.DPAD_U();
	await sleep(3000);
	await command.NO_INPUT();
	t.stop();
};

const openHatched = async () => {
	t.start();
	for (const it of range(1, 6)) {
		console.log(`Opening hatched: ${it}`);
		for (const it of range(0, 5)) {
			//console.log('Pressing A', it);
			await tap(command.BTN_A);
			if (it === 3) {
				console.log('Waiting...');
				await sleep(17000);
			} else {
				await sleep(1000);
			}
		}
		console.log('Hatched opened');
		await sleep(3000);
	}
	t.stop();
};

const release = async () => {
	t.start();
	for (const it of range(1, 6)) {
		console.log(`Releasing: ${it}`);
		await tap(command.BTN_A);
		await sleep(500);
		await tap(command.DPAD_U);
		await sleep(500);
		await tap(command.DPAD_U);
		await sleep(1000);
		await tap(command.BTN_A);
		await sleep(1000);
		await tap(command.DPAD_U);
		await sleep(500);
		await tap(command.BTN_A);
		await sleep(1000);
		await tap(command.BTN_A);
		console.log(`Released: ${it}`);
		await sleep(2000);
	}
	t.stop();
};

const load = async (batchNumber) => {
	t.start();
	const batchInput = document.getElementById('batch');
	const batch =
		typeof batchNumber !== 'undefined' &&
		!(batchNumber instanceof PointerEvent)
			? batchNumber
			: Number(batchInput.value);
	// console.log('Loading Batch:', {
	// 	batch,
	// 	batchNumber: typeof batchNumber,
	// 	batchInputValue: batchInput.value,
	// });
	for (const it of range(1, 6)) {
		await tap(command.DPAD_R, batch);
		await tap(command.BTN_A, 2);
		await tap(command.DPAD_L, batch);
		await tap(command.DPAD_D);
		await tap(command.BTN_A);
		await sleep(500);
	}
	t.stop();
};

const eggGrindOne = async () => {
	t.start();

	for (const it of range(1, 301)) {
		if (it > 50 && it % 14 === 0) {
			command.DPAD_R();
			await sleep(1500);
			const direction = await nurseryMan();
			if (direction === 'right') break;
		}

		if (it % 2 === 1) {
			console.log(`Egg grind: ${it}`);
			await command.DPAD_L();
		} else {
			await command.DPAD_R();
		}
		if (it === 1) {
			await sleep(1200);
		} else {
			await sleep(900);
		}
	}
	command.DPAD_CENTER();
	for (const it of range(1, 12)) {
		await tap(command.BTN_A);
		await sleep(1000);
	}
	await sleep(2000);
	await tap(command.BTN_A);
	await sleep(2000);
	await tap(command.BTN_A);
	await sleep(4000);
	await tap(command.BTN_A);

	t.stop();
};

const eggGrind = async () => {
	t.start();
	const fillBoxes = 10;
	for (const it of range(1, fillBoxes * 30 + 1)) {
		console.log(`Box fill: ${it}`);
		await eggGrindOne();
	}
	t.start();
};

const batchHatch = async () => {
	const withLoad = true;
	const t2 = timer();
	t2.start();
	for (const it of range(1, 7)) {
		if (withLoad) {
			//await release();
			//await sleep(1500);
			await tap(command.DPAD_U);
			await load();
			const batchInput = document.getElementById('batch');
			batchInput.value = Number(batchInput.value) - 1;

			await tap(command.BTN_B, 10);
		}
		await rideBike();
		await openHatched();

		await command.DPAD_D();
		await sleep(9000);
		await tap(command.BTN_X);
		await sleep(500);
		await tap(command.BTN_A);
		await sleep(1000);
		await tap(command.BTN_R);
		await sleep(1500);
		await tap(command.DPAD_L);
		await sleep(500);
		await tap(command.DPAD_D);
		await sleep(500);
	}
	console.log('check for shiny!');
	t2.stop();
};

const scripts = {
	eggGrind,
	load,
	//rideBike,
	//openHatched,
	//release,
	batchHatch,
	// nurseryMan: async () => {
	// 	const direction = await nurseryMan();
	// 	console.log({ direction });
	// },
	shinyCheck: async () => {
		const result = await shinyCheck();
		console.log({ result });
	},
};

const domLoaded = async () => {
	await setupFramework();

	const scriptsContainer = document.getElementById('scripts');
	for (const scriptName of Object.keys(scripts)) {
		let container = scriptsContainer;
		if (scriptName === 'load') {
			container = document.createElement('div');
			container.className = 'flex-row-reverse no-gap';
			container.innerHTML = `
				<input id="batch" type="number" value="1" min="1" max="6" />
			`;
			scriptsContainer.appendChild(container);
		}
		const button = document.createElement('button');
		button.id = scriptName;
		button.textContent = scriptName;
		container.appendChild(button);
		button.onclick = scripts[scriptName];
	}
};

document.addEventListener('DOMContentLoaded', domLoaded);
