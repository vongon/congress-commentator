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

module.exports = processData = (cb) => {
  async.series([ 
   
   (sCb) => {
    /*add imgurUrl to db*/
    Vote.find({
      'imgurUrl': null
     }).exec((err, votes) => {
      if(err) {
        return cb(err)
      }
      if (votes.length == 0) {
        console.log('No votes need an imgurUrl at this time.')
        return cb()
      }
      async.eachSeries(votes, (vote, voteCb) => {
        // addMemeUrl(vote, voteCb);
        addMemeUrl(vote, (err) => {
          if (err) return voteCb(err);
          updateMemeMetaData(vote, voteCb);
        });
      });
    }, sCb);
   },
   (sCb) => {
    /*add metaData*/
    Vote.find({
      'imgurTitle': null, 
      'imgurUrl': {$ne: null}
     }).sort({createdAt: 1}).exec((err, votes) => {
      if(err) {
        return cb(err)
      }
      if (votes.length == 0) {
        console.log('No votes need metadata updated at this time.')
        return cb()
      }
      async.eachSeries(votes, (vote, voteCb) => {
        updateMemeMetaData(vote, voteCb);
      });
    }, sCb);
   }

  ], cb)
}

const updateMemeMetaData = (vote, cb) => {
  var link = vote.imgurUrl

  var temp = JSON.stringify(link).replace(/\.[^/.]+$/, "")
  var imgurId = temp.replace(/"https:\/\/i.imgur.com\\/g, "");
  
  var title = `${config.congressPerson.name}'s vote on ${vote.data.bill.number}`
  var description = getMemeTopString(vote.data)
          
  imgurService.upDateMetaData(imgurId, title, description, (err, result) => {
    if (err) {
      return cb(err)
    }
    console.log(`Updating metadata for ${imgurId}`)
        
    Vote.updateOne({_id: vote._id}, { $set: { 'imgurTitle': title} }, (err, result) => {
      if (err) {
        return cb(err)
      }

    })
    return cb(result)
    });
}


const addMemeUrl = (vote, cb) => {
  const topText = getMemeTopString(vote.data);
  const bottomText = getMemeBottomString(vote.data);

  memeService.createMeme(topText, bottomText, (err, link) => {
    if (err) {
      return cb(err)
    }
    console.log(`Inserting imgurUrl to db for ${config.congressPerson.name}'s vote on ${vote.data.bill.number}`)
        
    Vote.updateOne({_id: vote._id}, { $set: { 'imgurUrl': link} }, (err, result) => {
      if (err) {
        return cb(err)
      }
      return cb(null, link)
    })
  })
}
        
// db.votes.update({'data.vote_uri': 'https://api.propublica.org/congress/v1/116/house/sessions/1/votes/43.json', 'data.member_id': 'M001157'}, { $set: { 'imgurUrl': 'https://imgur.com/MlW1F2f'} })
// db.votes.find({'data.vote_uri': 'https://api.propublica.org/congress/v1/116/house/sessions/1/votes/43.json', 'data.member_id': 'M001157'}).pretty()

const getMemeTopString = (vote) => {
  // hack-y way to deal with null values
  var title = vote.bill.title
  if (title == null) {
    title = String(title);
    title = title.replace(/null\b/g, '');
    var topText = vote.bill.number + ': ' + title + ' \n' + config.congressPerson.name + ' (' + config.congressPerson.party + '-' + config.congressPerson.jurisdiction + ') voted ' + '"' + vote.position + '"' + '.'
    return topText
  }
	var topText = vote.bill.number + ': "' + title + '" \n' + config.congressPerson.name + ' (' + config.congressPerson.party + '-' + config.congressPerson.jurisdiction + ') voted ' + '"' + vote.position + '"' + '.'
	return topText
}

const getMemeBottomString = (vote) => {
	var bottomText = vote.question + ', ' + vote.total.no + ' member(s) voted "No", ' + vote.total.yes + ' member(s) voted "Yes", ' + `${vote.total.not_voting + vote.total.present}` + ' member(s) voted "Not voting" or "present". The bill ' + vote.result + ' on ' + vote.date + '.' 
	return bottomText
}
