export const captureVideo = async ({ videoElement, stream }) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');
	canvas.width = videoElement.videoWidth;
	canvas.height = videoElement.videoHeight;
	context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
	const frame = context.getImageData(0, 0, canvas.width, canvas.height);
	return frame;
};

export const grabFrame = async ({ x = 0, y = 0, w = 640, h = 480 } = {}) => {
	const canvas = document.createElement('canvas');
	const video = document.getElementById('webcam');
	const ctx = canvas.getContext('2d');

	canvas.width = w;
	canvas.height = h;
	ctx.drawImage(video, x, y, w, h, 0, 0, w, h);

	return { canvas, ctx };
};
