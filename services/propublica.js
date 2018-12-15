var { propublicaKeys } = require('../config');

var Congress = require( 'propublica-congress-node' );

var client = new Congress( propublicaKeys.datastore );

exports.getLatestVoteData = getLatestVoteData = (cb) =>
  client.memberLists({
    congressNumber: '114', // we should move this data to config.js
    chamber: 'house'
  }).then(function(res) {
    return cb(null, res);
  }).catch((err) => {
    return cb(err);
  });

if(!module.parent) {
  getLatestVoteData((err, res) => {
    if (err) throw err;
    console.log('reponse:', res);
  });
}