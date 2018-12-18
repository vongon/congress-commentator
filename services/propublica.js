var { propublicaKeys } = require('../config');

var Congress = require( 'propublica-congress-node' );

var client = new Congress( propublicaKeys.datastore );

exports.getLatestVoteData = getLatestVoteData = (cb) =>
  // client.memberLists({
  //   congressNumber: '115', // we should move this data to config.js
  //   chamber: 'house'
  // }).then(function(res) {
  //   return cb(null, res);
  // }).catch((err) => {
  //   return cb(err);
  // });

  // just looking for the votes taken by this specific member; so use this endpoint
  client.memberVotePositions({
    memberId: 'W000816'
  }).then(function(res) {
    return cb(null, res);
  }).catch((err) => {
    return cb(err)
  });
  
if(!module.parent) {
  getLatestVoteData((err, res) => {
    if (err) throw err;
    console.log('reponse:', res);
  });
}