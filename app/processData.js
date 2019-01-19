const fs = require('fs');
const path = require('path');
const async = require('async')
const imgur = require('imgur');
const memeLib = require('nodejs-meme-generator');

const propublicaService = require('../services/propublica');
const imgurService = require('../services/imgurSvc')

const Vote = require('../models/vote');

const config = require('../config');

module.exports = processData = (cb) => {
  async.series([
    // Create the meme
    (sCb)=> { 
    // find a vote that doesn't have an image URL yet
    Vote.findOne({
      imgurUrl: null, 
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

      imgurService.createMeme(topText, bottomText, (err, link) => {
        //do something
        if (err) {
          console.log(err)
          return err
        }

        return cb(null, link)
      })

    });
  },
    // (sCb)=> {
    //   are there other things we need to do in processData?
    // }
  ], cb);
}

const getMemeTopString = (vote) => {
  // hack-y way to deal with null values here
  var title = vote.bill.title
  if (title == null) {
    title = String(title);
    title = title.replace(/null\b/g, '');
    var topText = vote.bill.number + ': ' + title + ' \n' + config.congressPerson.name + ' (' + config.congressPerson.party + '-' + config.congressPerson.jurisdiction + ') voted ' + '"' + vote.position + '"' + '.'
    return topText
  }
	var topText = vote.bill.number + ': "' + title + '"" \n' + config.congressPerson.name + ' (' + config.congressPerson.party + '-' + config.congressPerson.jurisdiction + ') voted ' + '"' + vote.position + '"' + '.'
	return topText
}

const getMemeBottomString = (vote) => {
	var bottomText = vote.question + ', ' + vote.total.no + ' member(s) voted "No", ' + vote.total.yes + ' member(s) voted "Yes", ' + `${vote.total.not_voting + vote.total.present}` + ' member(s) voted "Not voting" or "present". The bill ' + vote.result + ' on ' + vote.date + '.' 
	return bottomText
}
