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
	    'X-API-Key': config.proPublicaFEC.fec_key
	};
	var options = {
	    url: config.proPublicaFEC.url,
	    headers: headers
	};
	function callback(error, response, body) {
	    if (!error && response.statusCode == 200) {
	        console.log('Got the campaign finance data:');
	        // console.log(body)
	        return body
	    }
	}
	request(options, callback);
}

