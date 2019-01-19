const fs = require('fs');
const path = require('path');
const async = require('async');
const imgur = require('imgur');
const memeLib = require('nodejs-meme-generator');

const config = require('../config');

// Set imgur client id
imgur.setClientId(config.imgur.client_id);
// Get imgur client id
imgur.getClientId();
// Set credentials
imgur.setCredentials(config.imgur.user, config.imgur.pw, config.imgur.client_id);

exports.uploadFile = (path, cb) => {
// Upload a single image
  imgur.uploadFile(path)
    .then(function (json) {
      console.log('Imgur link: ', json.data.link);
      return json.data.link
    })
    .catch(function (err) {
      console.error(err.message);
    });
}

const uploadBase64 = (data) => {
  imgur.uploadBase64(data)
    .then(function (json) {
      console.log('Meme uploaded to imgur!', json.data.link);
      return json.data.link        
      })
    .catch(function (err) {
      console.error(err.message);
    }); 
}


exports.createMeme = (topText, bottomText, cb) => {
  const memeGenerator = new memeLib({
    canvasOptions: { // optional
      canvasWidth: 1024,
      canvasHeight: 800
    },
    fontOptions: { // optional
      fontSize: 40,
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
      // upload
      uploadBase64(imgToUpload, cb);
    })
    .catch((err) => {
      console.log(err)
    });
}