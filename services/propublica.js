const config = require('../config');
const Congress = require( 'propublica-congress-node' );
const client = new Congress( config.propublicaKeys.datastore );
const request = require('request-promise');
const async = require('async');

// Vote data
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

// FEC data
exports.getCampaignFinanceData = getCampaignFinanceData = (cb) => {
  // retry request 3 times before returning error because it has time-out errors
  async.retry(3, _getCampaignFinanceData, cb);
}

const _getCampaignFinanceData = (cb) => {
  request({
    "method":"GET", 
    "uri": config.propublicaFEC.url,
    "json": true,
    "headers": {
      'X-API-Key': config.propublicaFEC.fec_key
    },
    timeout: 120000 // 2 minutes
  })
  .then(function(response) {
    return cb(null, response);
  }).catch(function(err) {
    consol.log(err.code === 'ETIMEDOUT');
    console.log(err.connect === true);
    return cb(err);
    process.exit(0);
  });
}

