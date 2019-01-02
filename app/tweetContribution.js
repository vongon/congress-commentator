const async = require('async');

const propublicaService = require('../services/propublica');
const config = require('../config');
const twitterService = require('../services/twitter');
const Vote = require('../models/vote');
const Contribution = require('../models/contribution');

module.exports = tweetContribution = (cb) => {
	/*find PPC Contribution data - The ProPublica FEC contribution data 
   isn't updated very frequently, so we'll want to tweet about this on a 
   different schedule than votes. Could we do a query like this to grab 
   something that we haven't tweeted about, say, within the last 2 hours?
   
   Contribution.findOne({
          tweetedAt: {
            $lte: new Date().getTime() - (1000 * 60 * 120)
          } 
    */ 
    Contribution.findOne({
    tweetedAt: null,
    'data.id': config.propublicaFEC.fec_id
  }).sort({createdAt: 1}).exec((err, contribution) => {
    if (err) {
      return cb(err);
    }

    // if there's nothing there
    if (!contribution) {
      console.log('No contribution data available to tweet')
      return cb()
    }

    const FECmessage = getFECTweetString(contribution.data);
    console.log('Tweeting FEC data:', FECmessage);

    // tweet the FEC message
    twitterService.tweet(FECmessage, (err) => {
    if (err) {
      return err;
    }

    // save the ProPublica data to the database
    contribution.tweetedAt = new Date();
    contribution.save(cb);

    console.log('FEC data successfully tweeted at', contribution.tweetedAt)
    }); 
  });
}

// FEC tweet
const getFECTweetString = (contribution) => {

  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  const handle = config.congressPerson.handle
  
  const fecURI = contribution.fec_uri
  const upToDate = contribution.date_coverage_to
  const totalMoney = contribution.total_contributions
  const totalMoneyCommas = totalMoney.toLocaleString();
  const pacMoney = contribution.total_from_pacs 
  const pacMoneyWithCommas = pacMoney.toLocaleString(); // format dollar amount in a better way?
  const percentFromPACs = (pacMoney/totalMoney * 100).toFixed(2)

  // const fecMessage = `Testing FEC API.`
  const fecMessage = `As of the reporting period ending ${upToDate}, ${name} (${handle} ${party}-${jurisdiction}) had accepted $${totalMoneyCommas}, and $${pacMoneyWithCommas} of those contributions (${percentFromPACs}%) came from PACs. \n\n
More information: ${fecURI}`;

  return fecMessage;
}