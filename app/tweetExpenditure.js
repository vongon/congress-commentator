const async = require('async');
const moment = require('moment');
const config = require('../config');

const propublicaService = require('../services/propublica');
const twitterService = require('../services/twitter');
const bitlyService = require('../services/bitly')

const Expenditure = require('../models/expenditure');

const okayToTweet = require('../util/helpers').okayToTweet;
const handleNullValues = require('../util/helpers').handleNullValues;
const handleRecipientDesc = require('../util/helpers').handleRecipientDesc;
const toProperCase = require('../util/helpers').toProperCase;


module.exports = tweetExpenditure = (cb) => {
  Expenditure.findOne({
    tweetedAt: null,
    'data.committee_id': config.fec.committee_id
  }).sort({ createdAt: 1 }).exec((err, expenditure) => {
    if (err) {
      return cb(err);
    }
    // if there's nothing there
    if (!expenditure) {
      console.log('No new campaign expenditure data available to tweet')
      return cb()
    }
    if (!okayToTweet(expenditure)) {
      console.log(`Skipping tweeting campaign expenditure because it didn't pass validation`);
      return cb();
    }
    // need to handle Null values so string methods don't break
    handleNullValues(expenditure.data)
    // get tweet string + shortened URL
    getExpenditureTweetString(expenditure.data, (err, expenditureMessage) => {
      if (err) {
        return cb(err);
      }
      // now we have expenditureMessage with shortened url and can tweet:
      twitterService.tweet(expenditureMessage, (err) => {
        if (err) {
          console.log('Expenditure tweet err with expenditure._id: ', expenditure._id)
          console.log('problem with this expenditureMessage: ', expenditureMessage)
          return cb(err);
        }
        console.log('Tweeting expenditure data:', expenditureMessage)
        // save any new campaign expenditure entries to the database

        expenditure.tweetedAt = new Date();
        expenditure.save(cb);

        console.log('Expenditure data successfully tweeted at', expenditure.tweetedAt)
      });
    });
  })
}

getExpenditureTweetString = (expenditure, cb) => {
  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  const handle = config.congressPerson.handle;
  const committee = toProperCase(expenditure.committee.name)
  const recipient = toProperCase(expenditure.recipient_name)
  const loadDate = moment(expenditure.load_date).format('YYYY-MM-DD');
  const amount = expenditure.disbursement_amount.toLocaleString();
  const recipientDescription = toProperCase(expenditure.disbursement_description);
  const recipientState = expenditure.recipient_state;
  const recipientCity = toProperCase(expenditure.recipient_city)
  const pdf = expenditure.pdf_url;
  const handledDesc = handleRecipientDesc(recipientDescription);

  bitlyService.shortenUrl(pdf, (err, shortUrl) => {
    if (err) {
      return cb(err);
    }
    // handle bitly response data:
    var json = JSON.parse(shortUrl);
    const shortLink = json.data.url;
    const expenditureMessage = `On ${loadDate}, ${handle} (${party}-${jurisdiction})'s' "${committee}" reported a $${amount} expenditure to "${recipient}", in ${recipientCity}, ${recipientState} for "${handledDesc}".\n\n🔎 : ${shortLink}`;

    return cb(null, expenditureMessage);
  })
}

