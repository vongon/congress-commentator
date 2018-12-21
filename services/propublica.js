var { propublicaKeys } = require('../config');

var Congress = require( 'propublica-congress-node' );

var client = new Congress( propublicaKeys.datastore );

exports.getLatestVoteData = getLatestVoteData = (cb) => {
  client.memberVotePositions({
    memberId: propublicaKeys.memberId
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
