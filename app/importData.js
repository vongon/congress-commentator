var async = require('async');
var {getLatestVoteData} = require('../services/propublica');

exports.importData = importData = (cb) => {
  console.log('test');
  getLatestVoteData((err, data) => {
    if (err) {
      return cb(err);
    }
    const votes = data.votes;
    async.series(votes, (vote, sCb) => {
      console.log(vote.vote_uri);
    }, cb
  });
}

if(!module.parent) {
  importData((err, res) => {
    if (err) throw err;
    console.log('reponse:', JSON.stringify(res));
  });
}