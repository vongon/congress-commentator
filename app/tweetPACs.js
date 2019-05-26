const async = require('async');
const moment = require('moment');
const config = require('../config');

const propublicaService = require('../services/propublica');
const twitterService = require('../services/twitter');
const bitlyService = require('../services/bitly')

const Vote = require('../models/vote');
const PACContribution = require('../models/pacContribution');

const okayToTweet = require('../util/helpers').okayToTweet;
const handleNullValues = require('../util/helpers').handleNullValues;
const handleDonorName = require('../util/helpers').handleDonorName;
const toProperCase = require('../util/helpers').toProperCase; 


module.exports = tweetContribution = (cb) => {
    PACContribution.findOne({
    	tweetedAt: null, 
    	'data.committee_id': config.fec.committee_id
    }).sort({createdAt: 1}).exec((err, contribution) => {
      if (err) {
        return cb(err);
      }
      // if there's nothing there
      if (!contribution) {
        console.log('No new PAC contribution data available to tweet')
        return cb()
      }
      if (!okayToTweet(contribution)) {
        console.log(`Skipping tweeting PAC contribution because it didn't pass validation`);
        return cb();
      }       
      // need to handle Null values so string methods don't break
      handleNullValues(contribution.data)
      // get tweet string + shortened URL
      getPacTweetString(contribution.data, (err, pacMessage) => {
        if (err) {
          return cb(err);
        }
        // now we have pacMessage with shortened url and can tweet:
        twitterService.tweet(pacMessage, (err) => {
          if (err) {
            console.log('PAC tweet err with contribution._id: ', contribution._id)
            console.log('problem with this pacMessage: ', pacMessage)
            return cb(err);
        }
        console.log('Tweeting PAC data:', pacMessage) 
        // save any new PAC data contribution entries to the database
        
        contribution.tweetedAt = new Date();
        contribution.save(cb);

        console.log('PAC data successfully tweeted at', contribution.tweetedAt)
      });         
    });
  })
}

getPacTweetString = (contribution, cb) => {
  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  const handle = config.congressPerson.handle;
  const committee = toProperCase(contribution.committee.name)
  const donor = toProperCase(contribution.donor_committee_name)
  const abbrevDonor = handleDonorName(donor);
  const loadDate = moment(contribution.load_date).format('YYYY-MM-DD');
  const amount = contribution.contribution_receipt_amount.toLocaleString();
  const donorDescription = toProperCase(contribution.entity_type_desc)
  const donorState = contribution.contributor_state;
  const donorCity = toProperCase(contribution.contributor_city)
  const pdf = contribution.pdf_url;
  
  bitlyService.shortenUrl(pdf, (err, shortUrl) => {
    if (err) {
      return cb(err);
    }
    if (committee == 'Texans For Henry Cuellar Congressional Campaign') {
        // handle bitly response data:
      var json = JSON.parse(shortUrl);    
      const shortLink = json.data.url;
      const pacMessage = `On ${loadDate}, "Texans For Henry Cuellar" reported a $${amount} contribution to ${handle} (${party}-${jurisdiction}) from "${abbrevDonor}", a(n) ${donorDescription} registered in ${donorCity}, ${donorState}.\n\n🔎 : ${shortLink}`;

      return cb(null, pacMessage);
    }
    // handle bitly response data:
    var json = JSON.parse(shortUrl);    
    const shortLink = json.data.url;
    const pacMessage = `On ${loadDate}, "${committee}" reported a $${amount} contribution to ${handle} (${party}-${jurisdiction}) from "${abbrevDonor}", a(n) ${donorDescription} registered in ${donorCity}, ${donorState}.\n\n🔎 : ${shortLink}`;

    return cb(null, pacMessage);
  })
}

    