const fs = require('fs');
const path = require('path');
const async = require('async')
const imgur = require('imgur');
const memeLib = require('nodejs-meme-generator');

const propublicaService = require('../services/propublica');
const memeService = require('../services/meme')
const imgurService = require('../services/imgurSvc')
const Vote = require('../models/vote');
const config = require('../config');
const handleNullValues = require('../util/helpers').handleNullValues;
const trimString = require('../util/helpers').trimString; 

module.exports = processData = (voteId, cb) => {
  async.series([ 
   
   (sCb) => {
    // add imgur url to db
    Vote.find({
      '_id': voteId,
      'imgur.url': null
     }).exec((err, votes) => {
      if(err) {
        return sCb(err)
      }
      if (votes.length == 0) {
        console.log('No votes need an imgur Url at this time.')
        return sCb();
      }
      async.eachSeries(votes, (vote, voteCb) => {
        addMemeUrl(vote, voteCb);
      }, sCb);
    });
   }
  ], cb)
}

const addMemeUrl = (vote, cb) => {
  const topText = getMemeTopString(vote.data);
  const bottomText = getMemeBottomString(vote.data);

  console.log("vote: ", vote)
  // deal with Speaker vote
  if (vote.data.question == "Election of the Speaker") {
    var name = config.congressPerson.name;
    var position = vote.data.position;
    var result = vote.data.result;
    var title = `${vote.data.question}: ${config.congressPerson.name} voted "${vote.data.position}".` ;
     
    var description = `Result: ${result} elected Speaker of the House.`

    memeService.createMeme(topText, bottomText, title, description, (err, link) => {
      if (err) {
        return cb(err)
      }
      console.log(`Inserting imgur url to db for ${config.congressPerson.name}'s vote on ${vote.data.question}`)
          
      Vote.updateOne({_id: vote._id}, { $set: { 'imgur.url': link, 'imgur.title': title, 'imgur.description': description} }, cb)
      })
  }

  var title = `${vote.data.question} for ${vote.data.bill.number}: ${config.congressPerson.name} voted "${vote.data.position}".`
  var description = `Title: ${vote.data.bill.title}`


  memeService.createMeme(topText, bottomText, title, description, (err, link) => {
    if (err) {
      return cb(err)
    }
    description = handleNullValues(description);
    console.log(`Inserting imgur url to db for ${config.congressPerson.name}'s vote on ${vote.data.bill.number}`)
        
    Vote.updateOne({_id: vote._id}, { $set: { 'imgur.url': link, 'imgur.title': title, 'imgur.description': description} }, cb)
  })
}

const getMemeTopString = (vote) => {
  // deal with Speaker vote
  if (vote.question == "Election of the Speaker") {
    var abbreviatedBillQuestion = vote.question;
    var name = config.congressPerson.name;
    var position = vote.position; 
    var topText = `On "${abbreviatedBillQuestion}", ${name} voted "${position}".`;
    return topText;
  }

  // var title = vote.bill.title
  // // deal with super long bill titles:
  // if (!title) {
  //   title = String(title);
  //   title = title.replace(/null\b/g, '');
  //   var topText = vote.bill.number + ': ' + config.congressPerson.name + ' voted ' + '"' + vote.position + '"' + '.';
  //   return topText
  // }

  // var abbrevTitle = trimString(title, 350)
  //   // hack-y way to deal with null values in bill titles
  var topText = vote.bill.number + ': ' + config.congressPerson.name + ' voted ' + '"' + vote.position + '"' + '.';
	return topText
}

const getMemeBottomString = (vote) => {
  // deal with Speaker vote
  if (vote.question == "Election of the Speaker") {
    var result = vote.result
    var voteDate = vote.date;
    var bottomText = `Result: ${result} elected Speaker of the House on ${voteDate}.`

    return bottomText;
  }

  var title = vote.bill.title
  
  if (!title) {
    title = String(title);
    title = title.replace(/null\b/g, '');
    var bottomText = title + '. The bill ' + vote.result + ' on ' + vote.date + '.';  
    return bottomText
  }

  // super long title
  if (title.length > 300) {
    var abbrevTitle = trimString(title, 250)
    var bottomText = abbrevTitle + '. The bill ' + vote.result + ' on ' + vote.date + '.'; 
    return bottomText
  }

  var bottomText = title + '. The bill ' + vote.result + ' on ' + vote.date + '.'; 
	return bottomText
}
