const config = require('../config');

const Congress = require( 'propublica-congress-node' );

const client = new Congress( config.propublicaKeys.datastore );

const request = require('request');

exports.getLatestVoteData = getLatestVoteData = (cb) => {
  client.memberVotePositions({
    memberId: config.propublicaKeys.memberId
  }).then((response) => {
    const result = response.results[0];
    return cb(null, result);
  }).catch((err) => {
    return cb(err)
  });
}

exports.getCampaignFinanceData = getCampaignFinanceData = (cb) => {
	var headers = {
	    'X-API-Key': config.propublicaFEC.fec_key
	};
	var options = {
	    url: config.propublicaFEC.url,
	    headers: headers
	};
	function callback(error, response, body) {
	    if (!error && response.statusCode == 200) {
	        console.log('Got the campaign finance data:', body);
	        // Do something with the data here
	        // console.log(body)
	        // return cb(body);
	    }
	}
	request(options, callback)
}

