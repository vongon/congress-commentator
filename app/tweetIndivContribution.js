const async = require('async');
const moment = require('moment');
const config = require('../config');

const propublicaService = require('../services/propublica');
const twitterService = require('../services/twitter');
const bitlyService = require('../services/bitly')

const Vote = require('../models/vote');
const IndividualContribution = require('../models/indivContribution');

const okayToTweet = require('../util/helpers').okayToTweet;
const indivContrOkayToTweet = require('../util/helpers').indivContrOkayToTweet;
const handleNullValues = require('../util/helpers').handleNullValues;
const handleDonorName = require('../util/helpers').handleDonorName;
const toProperCase = require('../util/helpers').toProperCase;
const handleIndivContributorName = require('../util/helpers').handleIndivContributorName;

module.exports = tweetIndivContribution = (cb) => {
  IndividualContribution.findOne({
    tweetedAt: null,
    'data.committee_id': config.fec.committee_id
  }).sort({ createdAt: 1 }).exec((err, contribution) => {
    if (err) {
      return cb(err);
    }
    // if there's nothing there
    if (!contribution) {
      console.log('No new individual contributions available to tweet')
      return cb()
    }
    if (!indivContrOkayToTweet(contribution)) {
      console.log(`Skipping tweeting individual contribution because it didn't pass validation`);
      return cb();
    }
    // need to handle Null values so string methods don't break
    handleNullValues(contribution.data)

    // get tweet string + shortened URL
    getIndividualContributionTweetString(contribution.data, (err, individualContributionMessage) => {
      if (err) {
        return cb(err);
      }
      // now we have individualContributionMessage with shortened url and can tweet:
      twitterService.tweet(individualContributionMessage, (err) => {
        if (err) {
          console.log('IndividualContribution tweet err with contribution._id: ', contribution._id)
          console.log('problem with this individualContributionMessage: ', individualContributionMessage)
          return cb(err);
        }

        console.log('Tweeting individual contribution data:', individualContributionMessage)
        // save any new individual data contribution entries to the database

        contribution.tweetedAt = new Date();
        contribution.save(cb);

        console.log('Individual contribution data successfully tweeted at', contribution.tweetedAt)
      });
    });
  })
}

getIndividualContributionTweetString = (contribution, cb) => {
  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  const handle = config.congressPerson.handle;
  const committee = toProperCase(contribution.committee.name);
  const donor = toProperCase(contribution.contributor_name);
  const handledDonorName = handleIndivContributorName(donor);
  const loadDate = moment(contribution.load_date).format('YYYY-MM-DD');
  const amount = contribution.contribution_receipt_amount.toLocaleString();
  const donorTitle = toProperCase(contribution.contributor_occupation);
  const donorEmployer = toProperCase(contribution.contributor_employer);
  const donorState = contribution.contributor_state;
  const donorCity = toProperCase(contribution.contributor_city)
  const pdf = contribution.pdf_url;

  bitlyService.shortenUrl(pdf, (err, shortUrl) => {
    if (err) {
      return cb(err);
    }
    // handle bitly response data:
    var json = JSON.parse(shortUrl);
    const shortLink = json.data.url;

    const indivContributionMessage = `On ${loadDate}, "${committee}" reported a $${amount} contribution to ${handle} (${party}-${jurisdiction}) from "${handledDonorName}", ${donorTitle} at ${donorEmployer} in ${donorCity}, ${donorState}.\n\n🔎 : ${shortLink}`;
    return cb(null, indivContributionMessage);

  })
}

