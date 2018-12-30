const async = require('async')

const propublicaService = require('../services/propublica');
const Vote = require('../models/vote');
const Contribution = require('../models/contribution')

module.exports = importData = (cb) => {
  // get votes
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
  
  // get FEC data
  propublicaService.getCampaignFinanceData((err, data) => {
	  if (err) {
	    return cb(err);
	  }
  
	  const contributions = data.results;
	  async.eachSeries(contributions, (data, sCb) => {
	  	Contribution.find({'data.fec_uri': data.fec_uri}).lean(true).exec((err, contributions) => {
	  		if (err) {
	  			return sCb(err);
	  		}

	  		if (contributions.length > 0) {
	  			console.log('Skipping this contribution upload becase we have an existing entry for fec_uri:', data.fec_uri);
	  			return setImmediate(sCb);
	  		}
	  		console.log('Uploading new fec_uri:', data.fec_uri);
	  		const newContribution = new Contribution({data});
	  		newContribution.save(sCb);
	  	})
	  }, cb)
  });
}

