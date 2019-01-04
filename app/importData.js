const async = require('async')

const propublicaService = require('../services/propublica');
const Vote = require('../models/vote');
const Contribution = require('../models/contribution')

module.exports = importData = (cb) => {

    async.series([
      (sCb)=> { 
        // get votes
        propublicaService.getLatestVoteData((err, data) => {
          if (err) {
            return sCb(err);
          }
          const votes = data.votes;
          async.eachSeries(votes, (data, voteCb) => {
             
             // weird temporary special case for JSON data in Speaker of the House vote
              if(data.total && data.total['Hon. Tammy']) {
                data.total['Hon'] = data.total['Hon. Tammy']
                delete data.total['Hon. Tammy']
              }
            
            Vote.find({'data.vote_uri': data.vote_uri}).lean(true).exec((err, votes) => {
              if (err) {
                return voteCb(err);
              } 
              if (votes.length > 0) {
                console.log('Skipping vote uploaded because found existing entry for vote_uri:', data.vote_uri);
                return setImmediate(voteCb);
              }
              console.log('Uploading new vote_uri:', data.vote_uri);
              const newVote = new Vote({data});
              console.log('console.logging "newVote" :', newVote)
              newVote.save(voteCb);
            });
          }, sCb);
        }); // end getLatestVoteData

      },
      (sCb)=> { 
        // get FEC data
        propublicaService.getCampaignFinanceData((err, data) => {
          if (err) {
            return sCb(err);
          }
        
          const contributions = data.results;
          async.eachSeries(data.results, (contribution, contributionCb) => {
            Contribution.find({'data.fec_uri': contribution.fec_uri}).lean(true).exec((err, contributions) => {
              if (err) {
                return contributionCb(err);
              }

              if (contributions.length > 0) {
                console.log('Skipping this contribution upload becase we have an existing entry for fec_uri:', contribution.fec_uri);
                return setImmediate(contributionCb);
              }
              console.log('Uploading new fec_uri:', contribution.fec_uri);
              const newContribution = new Contribution({data: contribution});
              newContribution.save(contributionCb);
            })
          }, sCb)
        }); // end getCampaignFinanceData
      },  
    ], cb);
  
  }

