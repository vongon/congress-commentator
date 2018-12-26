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

    // FEC data
    propublicaService.getCampaignFinanceData((err, data) => {
    if (err) {
      return cb(err);
    }
    const contributions = data.results[0]
    console.log('Now we are inside the getCampaignFinanceData function. Total from PACs this cycle to date: ', contributions.total_from_pacs)
    async.eachSeries(contributions.date_coverage_to, (data, sCb) => {
      Contribution.find({'contributions.date_coverage_to': contributions.date_coverage_to}).lean(true).exec((err, contributions) => {
        if (err) {
          return sCb(err);
        } 
        if (contributions.length > 0) {
          console.log('Skipping vote uploaded because found existing entry for FEC data from API:', contributions.date_coverage_to);
          return setImmediate(sCb);
        }
        console.log('Uploading new contributions record:', contributions.date_coverage_to);
        const newContributionData = new Contribution({data});
        newContributionData.save(sCb);
      });
    }, cb);
  });




  });
}

