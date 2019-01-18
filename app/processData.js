const fs = require('fs');
const path = require('path');
const async = require('async')
const imgur = require('imgur');
const memeLib = require('nodejs-meme-generator');

const propublicaService = require('../services/propublica');
const imgurService = require('../services/imgurSvc')

const Vote = require('../models/vote');

const config = require('../config');

const handleNullValues = require('../util/helpers').handleNullValues;

module.exports = processData = (cb) => {
  
  async.series([
    (sCb)=> { 
    // find a vote that doesn't have an image yet
    Vote.findOne({
      imgUrl: null, 
      'data.member_id': config.propublicaKeys.memberId
    }).sort({createdAt: 1}).exec((err, vote) => {
      if (err) {
        return cb(err);
      }
      if (!vote) {
        console.log('No votes to add image to');
        return cb()
      }
      const topText = getMemeTopString(vote.data);
      const bottomText = getMemeBottomString(vote.data);

      console.log('Adding message to meme:', topText, bottomText);

      // Create the meme
      imgurService.createMeme(topText, bottomText, cb) 
    });
  },
    // (sCb)=> {
    // }
  ], cb);
}

const getMemeTopString = (vote) => {
  // hack-y way to deal with null values
  var title = vote.bill.title
  if (title == null) {
    title = String(title);
    title = title.replace(/null\b/g, '');
  }

	const topText = vote.bill.number + ': "' + title + '" \n' + config.congressPerson.name + ' (' + config.congressPerson.party + '-' + config.congressPerson.jurisdiction + ') voted ' + '"' + vote.position + '"' + '.'
	return topText
}
const getMemeBottomString = (vote) => {
	const bottomText = vote.question + ', ' + vote.total.no + ' member(s) voted "No", ' + vote.total.yes + ' member(s) voted "Yes", ' + `${vote.total.not_voting + vote.total.present}` + ' member(s) voted "Not voting" or "present". The bill ' + vote.result + ' on ' + vote.date + '.' 
	return bottomText
}
