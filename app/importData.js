const async = require('async');

const propublicaService = require('../services/propublica');
const Vote = require('../models/vote');

module.exports = importData = (cb) => {
  propublicaService.getLatestVoteData((err, data) => {
    if (err) {
      return cb(err);
    }
    const votes = data.votes;
    async.eachSeries(votes, (data, sCb) => {
      Vote.find({'data.vote_uri': data.vote_uri}).lean(true).exec((err, votes) => {
        if (err) {
          return sCb(err);
        } 
        if (votes.length > 0) {
          console.log('Skipping vote uploaded because found existing entry for vote_uri:', data.vote_uri);
          return setImmediate(sCb);
        }
        console.log('Uploading new vote_uri:', data.vote_uri);
        const newVote = new Vote({data});
        newVote.save(sCb);
      });
    }, cb);
  });

  propublicaService.getCampaignFinanceData((err, data) => {
    if (err) {
      return cb(err);
    }
    const contributions = data.results[0]
    console.log('Now we are inside the getCampaignFinanceData function')
  });

}

