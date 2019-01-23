const fs = require('fs');
const path = require('path');
const async = require('async');
const imgur = require('imgur');
const memeLib = require('nodejs-meme-generator');

const imgurService = require('./imgurSvc');


exports.createMeme = (topText, bottomText, cb) => {
  const memeGenerator = new memeLib({
    canvasOptions: { // optional
      canvasWidth: 506,
      canvasHeight: 253
    },
    fontOptions: { // optional
      fontSize: 44,
      fontFamily: 'Helvetica',
      lineHeight: 2
    }
  });

  memeGenerator.generateMeme({
    topText: topText,
    bottomText: bottomText,
    url: 'https://imgur.com/8PE28SH.png'
    })
    // upload to imgur:
    .then((data) => {
      console.log('Meme created! Buffer data: ', data) 
      // make an empty array, push binary into array
      var fileContentArray = [];
      fileContentArray.push(data);
      // make a buffer from that with concat 
      var fileContent = new Buffer.concat(fileContentArray);
      // encode
      var imgToUpload = fileContent.toString('base64');
      // upload & generate link
      // imgurService.uploadBase64(imgToUpload, cb);
      imgurService.uploadBase64(imgToUpload, 'test-album', 'test-title', 'test-description')
    })
    .catch((err) => {
      console.log(err)
      return cb(err)
    });
  // return cb
}
