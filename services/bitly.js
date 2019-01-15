var BitlyAPI = require('node-bitlyapi');
const config = require('../config');

var Bitly = new BitlyAPI({
	client_id: config.bitly.client_id,
	client_secret: config.bitly.client_secret	
});

exports.shortenUrl = (url) => {
	Bitly.shortenLink(url, (err, result) => {
		console.log('url', url)
		return result;
	});
}