// this is configuration file for local-web-server module

const stack = [
	// this only logs the request, here for future ref
	'lws.plugin.js',

	// DEFAULT STACK
	// 'lws-basic-auth',
	// 'lws-body-parser',
	// 'lws-request-monitor',
	// 'lws-log',
	// 'lws-cors',
	// 'lws-json',
	// 'lws-compress',
	'lws-rewrite',

	// 'lws-blacklist',
	// 'lws-conditional-get',
	// 'lws-mime',
	// 'lws-range',
	// 'lws-spa',
	'lws-static',
	// 'lws-index',
];

export default {
	hostname: '127.0.0.1',
	port: 9000,
	rewrite: [{ from: '^/(.*)/$', to: '/$1/index.html' }],
	stack,
};
