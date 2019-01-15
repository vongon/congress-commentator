var BitlyAPI = require('node-bitlyapi');
const config = require('../config');

var Bitly = new BitlyAPI({
	client_id: config.bitly.client_id,
	client_secret: config.bitly.client_secret	
});

exports.shortenUrl = (url, cb) => {
	Bitly.shortenLink(url, (err, result) => {
		if (err) {
			return cb(err)
		}
	return cb(null, result);
	});
} 