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

        // weird special case for some bills
        if(data.total && data.total['Hon. Tammy']) {
          data.total['Hon Tammy'] = data.total['Hon. Tammy']
          delete data.total['Hon. Tammy']
        }

        const newVote = new Vote({data});
        newVote.save(sCb);
      });
    }, cb);
  });
}

