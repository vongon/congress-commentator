const config = require('../config');

const Congress = require( 'propublica-congress-node' );

const client = new Congress( config.propublicaKeys.datastore );

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

if(!module.parent) {
  getLatestVoteData((err, res) => {
    if (err) throw err;
    console.log('reponse:', JSON.stringify(res));
  });
}
