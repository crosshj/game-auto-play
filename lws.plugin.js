class Plugin {
	middleware() {
		return async (ctx, next) => {
			const { request } = ctx;
			console.log(`${request.method}: ${request.path}`);
			await next();
		};
	}
}

export default Plugin;
