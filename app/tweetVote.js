const async = require('async');

const propublicaService = require('../services/propublica');
const config = require('../config');
const twitterService = require('../services/twitter');
const Vote = require('../models/vote');
const Contribution = require('../models/contribution');

module.exports = tweetVote = (cb) => {
  // find oldest vote that has not been tweeted yet
  Vote.findOne({
    tweetedAt: null, 
    'data.member_id': config.propublicaKeys.memberId
  }).sort({createdAt: 1}).exec((err, vote) => {
    if (err) {
      return cb(err);
    }
    if (!vote) {
      console.log('No votes available to tweet');
      return cb()
    }
    const message = getTweetString(vote.data);
    console.log('Tweeting vote data:', message);
    twitterService.tweet(message, (err) => {
      if (err) {
        return cb(err);
      }
      vote.tweetedAt = new Date();
      vote.save(cb);

      console.log('Vote data successfully tweeted at', vote.tweetedAt)
    });
  });

};

// Votes tweet 
const getTweetString = (vote) => {
  const handle = config.congressPerson.handle
  const abbreviatedBillQuestion = vote.question.substring(0,30);
  const abbreviatedBillDescription = vote.description.substring(0,65);
  const billNumber = vote.bill.number;
  const name = config.congressPerson.name;
  const party = config.congressPerson.party;
  const jurisdiction = config.congressPerson.jurisdiction;
  const position = vote.position;
  const yesCount = vote.total.yes;
  const noCount = vote.total.no;
  const notCount = vote.total.not_voting;
  const result = vote.result
  const voteDate = vote.date;

  const message = `
"${abbreviatedBillQuestion}" on ${billNumber}, ${name} (${handle} ${party}-${jurisdiction}) voted "${position}". \n\n
Short Description: '${abbreviatedBillDescription}'. \n\n
${yesCount} member(s) voted "Yes". ${noCount} member(s) voted "No". ${notCount} not voting.
Result: ${result} ${voteDate}.
  `;

  return message;
}

