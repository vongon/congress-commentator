const BitlyClient = require('bitly');
const config = require('../config');
const bitly = new BitlyClient(config.bitly.api_key);

exports.shortenUrl = (url) => {	 
	bitly
	  .shorten(url)
	  .then(function(result) {
	    console.log('Url shortened!', result);
	    return result
	  })
	  .catch(function(error) {
	    console.error(error);
	  });
}

