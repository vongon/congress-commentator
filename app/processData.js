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


module.exports = processData = (cb) => {
  async.series([ 
   
   (sCb) => {
    // add imgur url to db
    Vote.find({
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

  var link = vote.imgur.url
  var temp = JSON.stringify(link).replace(/\.[^/.]+$/, "")
  var imgurId = temp.replace(/^"https?:\/\/i.imgur.com\//,'')
  var title = `${vote.data.question} for ${vote.data.bill.number}: ${config.congressPerson.name} voted "${vote.data.position}".`
  var description = getMemeTopString(vote.data)

  memeService.createMeme(topText, bottomText, title, description, (err, link) => {
    if (err) {
      return cb(err)
    }
    console.log(`Inserting imgur url to db for ${config.congressPerson.name}'s vote on ${vote.data.bill.number}`)
        
    Vote.updateOne({_id: vote._id}, { $set: { 'imgur.url': link, 'imgur.title': title, 'imgur.description': description} }, (err, result) => {
      if (err) {
        return cb(err)
      }
      return cb(null, link)
    })
  })
}

const getMemeTopString = (vote) => {
  // hack-y way to deal with null values
  var title = vote.bill.title

  var abbrevTitle = trimString(title, 300)

  if (title == null) {
    title = String(title);
    title = title.replace(/null\b/g, '');
    var topText = vote.bill.number + ': ' + title + ' \n' + config.congressPerson.name + ' (' + config.congressPerson.party + '-' + config.congressPerson.jurisdiction + ') voted ' + '"' + vote.position + '"' + '.'
    return topText
  }
	var topText = vote.bill.number + ': "' + abbrevTitle + '" \n' + config.congressPerson.name + ' (' + config.congressPerson.party + '-' + config.congressPerson.jurisdiction + ') voted ' + '"' + vote.position + '"' + '.'
	return topText
}

const getMemeBottomString = (vote) => {
	var bottomText = vote.question + ', ' + vote.total.no + ' member(s) voted "No", ' + vote.total.yes + ' member(s) voted "Yes", ' + `${vote.total.not_voting + vote.total.present}` + ' member(s) voted "Not voting" or "present". The bill ' + vote.result + ' on ' + vote.date + '.' 
	return bottomText
}
