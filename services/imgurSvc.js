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
      return cb(null, json.data.link);
    })
    .catch(function (err) {
      console.error(err.message);
      return cb(err)
    });
}

exports.uploadBase64 = (data, cb) => {
  imgur.uploadBase64(data)
    .then(function (json) {
      console.log('Meme uploaded to imgur!', json.data.link);
      return cb(null, json.data.link);     
      })
    .catch(function (err) {
      console.error(err.message);
      return cb(err)
    }); 
}