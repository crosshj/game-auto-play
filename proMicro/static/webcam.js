import { captureVideo } from './webcam.utils.js';

const stopVideo = ({ videoElement, stream }) => {
	const tracks = stream.getTracks();
	tracks.forEach((track) => track.stop());
	videoElement.srcObject = null;
};

const startVideo = async () => {
	const videoElement = document.getElementById('webcam');
	let stream;
	if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
		return { videoElement, stream };
	}
	stream = await navigator.mediaDevices
		.getUserMedia({ video: true })
		.catch((err) => {
			console.error('Error accessing webcam: ', err);
		});
	videoElement.srcObject = stream;
	return { videoElement, stream };
};

const saveImage = (frame) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.width = frame.width;
	canvas.height = frame.height;
	context.putImageData(frame, 0, 0);
	const image = canvas.toDataURL('image/png');
	const link = document.createElement('a');
	link.href = image;
	link.download = 'capture.png';
	link.click();
};

const populateVideoSources = async () => {
	const videoSelect = document.getElementById('videoSource');
	const devices = await navigator.mediaDevices.enumerateDevices();
	const videoDevices = devices.filter(
		(device) => device.kind === 'videoinput'
	);
	videoDevices.forEach((device, index) => {
		const option = document.createElement('option');
		option.value = device.deviceId;
		option.text = device.label || `Camera ${index + 1}`;
		videoSelect.appendChild(option);
	});
	return videoDevices;
};

const startVideoWithSource = async (deviceId) => {
	const videoElement = document.getElementById('webcam');
	let stream;
	if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
		return { videoElement, stream };
	}
	stream = await navigator.mediaDevices
		.getUserMedia({ video: { deviceId: { exact: deviceId } } })
		.catch((err) => {
			console.error('Error accessing webcam: ', err);
		});
	videoElement.srcObject = stream;
	return { videoElement, stream };
};

const domContentLoaded = async (event) => {
	const devices = populateVideoSources();
	const deviceId = localStorage.getItem('deviceId') || devices[0]?.deviceId;
	let { videoElement, stream } = await startVideoWithSource(deviceId);
	// console.log({ videoElement, stream });

	document
		.getElementById('videoSource')
		.addEventListener('change', async (event) => {
			const deviceId = event.target.value;
			localStorage.setItem('deviceId', deviceId);
			({ videoElement, stream } = await startVideoWithSource(deviceId));
		});
	document.getElementById('videoSource').value = deviceId;

	document
		.getElementById('stopButton')
		.addEventListener('click', async () => {
			stopVideo({ videoElement, stream });
		});
	document
		.getElementById('startButton')
		.addEventListener('click', async () => {
			({ videoElement, stream } = await startVideo());
		});
	document
		.getElementById('captureButton')
		.addEventListener('click', async () => {
			const frame = await captureVideo({ videoElement, stream });
			saveImage(frame);
		});
};

document.addEventListener('DOMContentLoaded', domContentLoaded);
