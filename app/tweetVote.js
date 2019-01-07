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

// trim tweet Question & Description without cutting off mid-word
function trimString(string, maxLength) {
  var trimmedString = string.substr(0, maxLength);
  //re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  return trimmedString;
}

// Votes tweet 
const getTweetString = (vote) => {
  // Speaker vote has no bill number and vote totals were strings
  if (vote.question == "Election of the Speaker") {
    var handle = config.congressPerson.handle
    var abbreviatedBillQuestion = vote.question;
    var name = config.congressPerson.name;
    var party = config.congressPerson.party;
    var jurisdiction = config.congressPerson.jurisdiction;
    var position = vote.position;
    var pelosiCount = vote.total["Pelosi"];
    var mcCarthyCount = vote.total["McCarthy"];
    var otherCount = 0;
    Object.keys(vote.total).map((item) => {
      if(!(item == "Pelosi" || item == "McCarthy")) {
        console.log(item, vote.total[item]);
        otherCount += vote.total[item];
      }
    })
    var notCount = vote.total["Not Voting"];
    var presentCount = vote.total["Present"];
    var result = vote.result
    var voteDate = vote.date;

    var message = `
On "${abbreviatedBillQuestion}", ${name} (${handle} ${party}-${jurisdiction}) voted "${position}". \n\n
${pelosiCount} member(s) voted "Pelosi". ${mcCarthyCount} member(s) voted "McCarthy". ${notCount} not voting, ${presentCount} "Present", ${otherCount } voted for other candidates.\n\n
Result: ${result} elected Speaker of the House on ${voteDate}.`;

    return message;
  }

    var handle = config.congressPerson.handle
    var abbreviatedBillQuestion = trimString(vote.question, 25)
    var abbreviatedBillDescription = trimString(vote.description, 50)
    var billNumber = vote.bill.number;
    var name = config.congressPerson.name;
    var party = config.congressPerson.party;
    var jurisdiction = config.congressPerson.jurisdiction;
    var position = vote.position;
    var yesCount = vote.total.yes;
    var noCount = vote.total.no;
    var notCount = vote.total.not_voting;
    var result = vote.result
    var voteDate = vote.date;

    var message = `
"${abbreviatedBillQuestion}" on ${billNumber}, ${name} (${handle} ${party}-${jurisdiction}) voted "${position}". \n\n
Short Description: '${abbreviatedBillDescription}'. \n\n
${yesCount} member(s) voted "Yes". ${noCount} member(s) voted "No". ${notCount} not voting.
Result: ${result} ${voteDate}.
    `;

    return message;
}

