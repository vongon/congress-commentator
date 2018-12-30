const async = require('async');

const propublicaService = require('../services/propublica');
const config = require('../config');
const twitterService = require('../services/twitter');
const Contribution = require('../models/contribution');

module.exports = tweet = (cb) => {
  // first find ProPublica FEC contribution record in db that hasn't been tweeted about in last hour
  Contribution.findOne({
    tweetedAt: {
      $gte: new Date(ISODate().getTime() - 1000 * 60 * 60)
    },
    'data.id': config.propublicaFEC.fec_id
  }).sort({createdAt: 1}).exec((err, contribution) => {
    if (err) {
      return cb(err);
    }
    if (!contribution) {
      console.log('No contributions available to tweet')
      return cb()
    }
    const FECmessage = getFECTweetString(contribution.data);
    console.log('Tweeting:', FECmessage);

    // tweet the FEC message
    twitterService.tweet(FECmessage, (err) => {
    if (err) {
      return err;
    }
    contribution.tweetedAt = new Date();
    contribution.save(cb);

    console.log('Successfully test tweeted.')
    }); 
  });
};

const getFECTweetString = (contribution) => {

  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  
  const upToDate = contribution.date_coverage_to
  const pacMoney = contribution.total_from_pacs 
  const pacMoneyWithCommas = pacMoney.toLocaleString(); // format dollar amount in a better way?

  // const fecMessage = `Testing FEC API.`
  const fecMessage = `As of the reporting period ending ${upToDate}, ${name} (${party}-${jurisdiction}) had accepted $${pacMoneyWithCommas} from PACs.`;
  return fecMessage;
}
