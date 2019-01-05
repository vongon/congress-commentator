const async = require('async')

const propublicaService = require('../services/propublica');
const Vote = require('../models/vote');
const Contribution = require('../models/contribution')

module.exports = importData = (cb) => {

    async.series([
      (sCb)=> { 
        // get votes
        propublicaService.getLatestVoteData((err, voteData) => {
          if (err) {
            return sCb(err);
          }
          async.eachSeries(voteData.votes, (data, voteCb) => {
            Vote.find({'data.vote_uri': data.vote_uri}).lean(true).exec((err, votes) => {
              if (err) {
                return voteCb(err);
              } 
              if (votes.length > 0) {
                console.log('Skipping vote uploaded because found existing entry for vote_uri:', data.vote_uri);
                return setImmediate(voteCb);
              }
              console.log('Uploading new vote_uri:', data.vote_uri);

              // weird special case for Speaker vote -- ProPublica fixed this for us so it can be safely removed
              if(data.total && data.total['Hon. Tammy']) {
                data.total['Hon Tammy'] = data.total['Hon. Tammy']
                delete data.total['Hon. Tammy']
              }

              const newVote = new Vote({data});
              newVote.save(voteCb);
            });
          }, sCb);
        }); // end getLatestVoteData
      },
      (sCb)=> { 
        // get FEC data
        propublicaService.getCampaignFinanceData((err, financeData) => {
          if (err) {
            console.log('error from get finance data', err);
            return sCb(err);
          }
          async.eachSeries(financeData.results, (data, contributionCb) => {
            Contribution.findOne({'data.id': data.id}).exec((err, contribution) => {
              if (err) {
                return contributionCb(err);
              }

              if (contribution) {
                console.log(`Updating contribution data for member id: ${contribution.data.id}`);
                contribution.data = data;
                return contribution.save(contributionCb);
              } else {
                console.log(`Creating contribution data for member id: ${data.id}`);
                const newContribution = new Contribution({data});
                return newContribution.save(contributionCb);
              }
            })
          }, sCb)
        }); // end getCampaignFinanceData
      },  
    ], cb);
  }

