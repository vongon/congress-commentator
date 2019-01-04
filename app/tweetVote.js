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
  // Speaker vote has no bill number and vote totals were strings
  if (vote.question == "Election of the Speaker") {
    const handle = config.congressPerson.handle
    const abbreviatedBillQuestion = vote.question;
    const name = config.congressPerson.name;
    const party = config.congressPerson.party;
    const jurisdiction = config.congressPerson.jurisdiction;
    const position = vote.position;
    const pelosiCount = vote.total["Pelosi"];
    const mcCarthyCount = vote.total["McCarthy"];
    const otherCount = vote.total["Massie"] + vote.total["Jordan"] + vote.total["Bustos"] + vote.total["Joseph Bid"] + vote.total["Lewis"] + vote.total["Kennedy"] + vote.total["Murphy"] + vote.total["Stacey Abr"] + vote.total["Fudge"] + vote.total["Hon Tammy"]
    const notCount = vote.total["Not Voting"];
    const presentCount = vote.total["Present"];
    const result = vote.result
    const voteDate = vote.date;

    const message = `
On "${abbreviatedBillQuestion}", ${name} (${handle} ${party}-${jurisdiction}) voted "${position}". \n\n
${pelosiCount} member(s) voted "Pelosi". ${mcCarthyCount} member(s) voted "McCarthy". ${notCount} not voting, ${presentCount} "Present", ${otherCount } voted for other candidates.\n\n
Result: ${result} elected Speaker of the House on ${voteDate}.`;

    return message;
  }

  const handle = config.congressPerson.handle
  const abbreviatedBillQuestion = vote.question.substring(0,30);
  const abbreviatedBillDescription = vote.description.substring(0,55);
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

