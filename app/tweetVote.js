const async = require('async');
const config = require('../config');

const processData = require('./processData');
const propublicaService = require('../services/propublica');
const twitterService = require('../services/twitter');
const Vote = require('../models/vote');
const Contribution = require('../models/contribution');
const trimString = require('../util/helpers').trimString;
const handleNullValues = require('../util/helpers').handleNullValues;

module.exports = tweetVote = (cb) => {
  // find oldest vote that has not been tweeted yet
  Vote.findOne({
    tweetedAt: null,
    'data.member_id': config.propublicaKeys.memberId
  }).sort({ createdAt: 1 }).exec((err, vote) => {
    console.log('line 18 tweetVote', { vote })

    if (err) {
      return cb(err);
    }
    if (!vote) {
      console.log('No votes available to tweet');
      return cb()
    }

    processData(vote._id, (err) => {
      console.log(`line 29 tweetVote: ${vote}`)
      if (err) {
        return cb(err);
      }
      Vote.findOne({ _id: vote._id }).exec((err, refreshedVote) => {
        if (err) {
          return cb(err);
        }
        vote = refreshedVote;
        const message = getTweetString(vote);
        console.log('Tweeting vote data:', message);
        twitterService.tweet(message, (err) => {
          if (err) {
            console.log('Vote tweet err with vote._id: ', vote._id)
            console.log('tweetVote err', err)
            return cb(err);
          }
          vote.tweetedAt = new Date();
          vote.save(cb);

          console.log('Vote data successfully tweeted at', vote.tweetedAt)
        });
      });
    });
  });
};

// Votes tweet 
const getTweetString = (vote) => {
  // console.log('This vote: ', vote)
  // Speaker vote has no bill number and vote totals were strings
  if (vote.question == "Election of the Speaker") {
    var handle = config.congressPerson.handle
    var abbreviatedBillQuestion = vote.data.question;
    var name = config.congressPerson.name;
    var party = config.congressPerson.party;
    var jurisdiction = config.congressPerson.jurisdiction;
    var position = vote.data.position;
    var pelosiCount = vote.data.total["Pelosi"];
    var mcCarthyCount = vote.data.total["McCarthy"];
    var otherCount = 0;
    Object.keys(vote.data.total).map((item) => {
      if (!(item == "Pelosi" || item == "McCarthy")) {
        console.log(item, vote.data.total[item]);
        otherCount += vote.data.total[item];
      }
    })
    var notCount = vote.data.total["Not Voting"];
    var presentCount = vote.data.total["Present"];
    var result = vote.data.result
    var voteDate = vote.data.date;

    var message = `
On "${abbreviatedBillQuestion}", ${name} (${handle} ${party}-${jurisdiction}) voted "${position}". \n\n
${pelosiCount} member(s) voted "Pelosi". ${mcCarthyCount} member(s) voted "McCarthy". ${notCount} not voting, ${presentCount} "Present", ${otherCount} voted for other candidates.\n\n
Result: ${result} elected Speaker of the House on ${voteDate}.`;

    return message;
  }

  var handle = config.congressPerson.handle
  var abbreviatedBillQuestion = trimString(vote.data.question, 25)
  var abbreviatedBillDescription = trimString(vote.data.description, 45)
  var billNumber = vote.data.bill.number;
  var name = config.congressPerson.name;
  var party = config.congressPerson.party;
  var jurisdiction = config.congressPerson.jurisdiction;
  var position = vote.data.position;
  var yesCount = vote.data.total.yes;
  var noCount = vote.data.total.no;
  var notCount = vote.data.total.not_voting;
  var result = vote.data.result
  var voteDate = vote.data.date;
  // need to remove extension and any quotes to embed img in tweet
  var imgurUrl = JSON.stringify(vote.imgur.url)
  imgurUrl = imgurUrl.replace(/\.[^/.]+$/, "")
  imgurUrl = imgurUrl.replace(/^"/, "");

  var message = `"${abbreviatedBillQuestion}" on ${billNumber}, ${name} (${handle} ${party}-${jurisdiction}) voted "${position}".\n\nShort Description: '${abbreviatedBillDescription}'.\n\n${yesCount} member(s) voted "Yes". ${noCount} voted "No". ${notCount} not voting. Result: ${result} ${voteDate}.\n${imgurUrl}`;

  return message;
}

