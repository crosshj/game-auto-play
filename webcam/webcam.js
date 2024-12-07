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

const captureVideo = async ({ videoElement, stream }) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.width = videoElement.videoWidth;
	canvas.height = videoElement.videoHeight;
	context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
	const frame = context.getImageData(0, 0, canvas.width, canvas.height);
	return frame;
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

	console.log('TODO: submit this to backend or to AI model');
};

const domContentLoaded = async (event) => {
	let { videoElement, stream } = await startVideo();
	// console.log({ videoElement, stream });

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
