const async = require('async');

const config = require('../config');
const twitterService = require('../services/twitter');
const Contribution = require('../models/contribution')

const request = require('request-promise');

module.exports = tweet = (cb) => {

  const fecMessage = getFECTweetString();
  console.log('Tweeting:', fecMessage);
  
  twitterService.tweet(fecMessage, (err) => {
    if (err) {
      return err;
    }
    console.log('Successfully test tweeted.')
    }); 
};

const getFECTweetString = () => {

  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  
  // const upToDate = __.date_coverage_to
  // const pacMoney = __.total_from_pacs

  const fecMessage = `Testing FEC API.`
//   const fecMessage = `Testing FEC API.
// As of ${upToDate}, ${name} (${party}-${jurisdiction}) had accepted $${pacMoney} from PACs".
//   `;
  return fecMessage;
}




