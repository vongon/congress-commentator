const async = require('async')

const propublicaService = require('../services/propublica');
const Vote = require('../models/vote');
const Contribution = require('../models/contribution')

const fecService = require('../services/fec');
const PACContribution = require('../models/pacContribution');

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
       // get FEC data from proPublica
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

    (sCb)=> { 
      // get FEC data from the FEC
      fecService.getPacContributions((err, pacData) => {
        if (err) {
          console.log('error from getPacContributions', err);
          return sCb(err);
        }
        
        async.eachSeries(pacData.results, (data, contributionCb) => {
          PACContribution.countDocuments({'data.transaction_id': data.transaction_id}).exec((err, contribution) => {
            
            if (err) {
              return contributionCb(err);
            }

            if (contribution) {
              console.log('Skipping contribution uploaded because found existing entry for transaction_id:', data.transaction_id);
              return setImmediate(contributionCb);

            } else {
              console.log(`Creating contribution data for transaction id: ${data.transaction_id}`);
              const newPacContribution = new PACContribution({data});
              return newPacContribution.save(contributionCb);              
            }  
          }) // end findOne
        }, sCb)
      }); // end getPacContributions
    }

  ], cb);
}
