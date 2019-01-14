const async = require('async');

const propublicaService = require('../services/propublica');
const config = require('../config');
const twitterService = require('../services/twitter');
const Vote = require('../models/vote');
const PACContribution = require('../models/pacContribution');
const moment = require('moment');

module.exports = tweetContribution = (cb) => {

    PACContribution.findOne({
    	tweetedAt: null, 
    	'data.committee_id': config.fec.committee_id
    }).sort({createdAt: 1}).exec((err, contribution) => {
      if (err) {
        return cb(err);
      }
      // need to handle Null values so string methods don't break
      handleNullValues(contribution.data)
      // if there's nothing there
      if (!contribution) {
        console.log('No new PAC contribution data available to tweet')
        return cb()
      }
      if (!okayToTweet(contribution)) {
        console.log(`Skipping tweeting PAC contribution because it didn't pass validation`);
        return cb();
      }

      const pacMessage = getPacTweetString(contribution.data);
      console.log('Tweeting PAC data:', pacMessage);

      // tweet the FEC message
      twitterService.tweet(pacMessage, (err) => {
      if (err) {
        return cb(err);
      }

      // save a new PAC data contribution entry to the database
      contribution.tweetedAt = new Date();
      contribution.save(cb);

      console.log('PAC data successfully tweeted at', contribution.tweetedAt)
      });
    });
}

// tweeting PAC contributions every 2 hours
const okayToTweet = (contribution) => {
  if (!contribution.tweetedAt) {
    return true;
  }
  const tweetedAt = new moment(contribution.tweetedAt);
  const cutoff = new moment().subtract(2, 'h');
    if (tweetedAt.isBefore(cutoff)) {
      return true;
    }
  return false;
}

// properCase helper
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// handle null values for string methods
const handleNullValues = (obj) => {
  Object.keys(obj).forEach(function(key) {
    if(obj[key] === null) {
      obj[key] = '-';
    }
  })
  return obj;
}


// PACs tweet
const getPacTweetString = (contribution) => {

  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  const handle = config.congressPerson.handle;
  const committee = contribution.committee.name.toProperCase();
  const donor = contribution.donor_committee_name.toProperCase();
  const loadDate = moment(contribution.load_date).format('YYYY-MM-DD');
  const amount = contribution.contribution_receipt_amount.toLocaleString()
  const donorDescription = contribution.entity_type_desc.toProperCase();
  const donorState = contribution.contributor_state
  const donorCity = contribution.contributor_city.toProperCase();
  const pdf = contribution.pdf_url


  const pacMessage = `On ${loadDate}, "${committee}" reported a $${amount} contribution to ${name} (${handle} ${party}-${jurisdiction}) from ${donor}, a ${donorDescription} registered in ${donorCity}, ${donorState}. \n\n More info: ${pdf}`;

  return pacMessage;
} 