const fs = require('fs');
const path = require('path');
const async = require('async')
const imgur = require('imgur');
const memeLib = require('nodejs-meme-generator');

const propublicaService = require('../services/propublica');
const memeService = require('../services/meme')
const Vote = require('../models/vote');
const config = require('../config');
const handleNullValues = require('../util/helpers').handleNullValues;


// module.exports = processData = (cb) => {
//   async.series([
//     // Create the meme
//     (sCb)=> { 
//     // find a vote that doesn't have an image URL yet
//     Vote.findOne({
//       'imgurUrl.string': null, 
//       'data.member_id': config.propublicaKeys.memberId
//     }).sort({createdAt: 1}).exec((err, vote) => {
//       if (err) {
//         return cb(err);
//       }
//       if (!vote) {
//         console.log('No votes to add image to');
//         return cb()
//       }
//       const topText = getMemeTopString(vote.data);
//       const bottomText = getMemeBottomString(vote.data);

//       console.log('Adding message to meme:', topText, bottomText);

//       memeService.createMeme(topText, bottomText, (err, link) => {
//         //do something
//         if (err) {
//           return cb(err)
//         }
//         return cb(null, link)
//       })
//     });
//   }
//   ], cb);
// }

module.exports = processData = (cb) => {
  async.series([ 
   
   (sCb) => {
    /*add to db*/
    Vote.find({
      'imgurUrl': null
     }).exec((err, votes) => {
      if(err) return cb(err)
      async.eachSeries(votes, (vote, voteCb) => {
        addMemeUrl(vote, voteCb);
      }, cb);
    });
   }

  ], cb)
}

const addMemeUrl = (vote, cb) => {
      const topText = getMemeTopString(vote.data);
      const bottomText = getMemeBottomString(vote.data);

      console.log(`Adding text to meme: `, topText, bottomText);

      memeService.createMeme(topText, bottomText, (err, link) => {
        //do something
        if (err) {
          return cb(err)
        }
        // insert link
        console.log(`Inserting imgurUrl to db for ${config.congressPerson.name}'s vote on ${vote.data.bill.number}`)
        
        Vote.update({'imgurUrl': null, 'vote.vote_uri': vote.vote_uri}, { $set: { 'imgurUrl': link} }, (err, result) => {
          if (err) {
            return cb(err)
          }
          console.log('Vote.update result', result)
        })
        return cb(null, link)
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
