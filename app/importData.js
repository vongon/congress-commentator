const async = require('async');
const propublicaService = require('../services/propublica');
const Vote = require('../models/vote');

exports.importData = importData = (cb) => {
  propublicaService.getLatestVoteData((err, data) => {
    if (err) {
      return cb(err);
    }
    const votes = data.votes;
    async.eachSeries(votes, (vote, sCb) => {
      Vote.find({'vote.vote_uri': vote.vote_uri}).lean(true).exec((err, votes) => {
        if(err) return sCb(err);
        if(votes.length > 0) {
          console.log('Skipping vote uploaded because found existing entry for vote_uri:', vote.vote_uri);
          return sCb();
        }
        console.log('Uploading new vote_uri:', vote.vote_uri);
        const newVote = new Vote({vote});
        newVote.save(sCb);
      });
    }, cb);
  });
}

if(!module.parent) {
  importData((err, res) => {
    if (err) throw err;
    console.log('reponse:', JSON.stringify(res));
  });
}

