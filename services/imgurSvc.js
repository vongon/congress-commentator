const fs = require('fs');
const path = require('path');
const async = require('async');
const imgur = require('imgur');

const memeLib = require('nodejs-meme-generator');

const config = require('../config');


imgur.setClientId(config.imgur.client_id);
imgur.getClientId();
imgur.setCredentials(config.imgur.user, config.imgur.pw, config.imgur.client_id);

exports.uploadFile = (path, cb) => {
// Upload a single image
  imgur.uploadFile(path)
    .then((json) => {
      console.log('Imgur link: ', json.data.link);
      return cb(null, json.data.link);
    })
    .catch((err) => {
      console.error(err.message);
      return cb(err)
    });
}

exports.uploadBase64 = (imgurData, cb) => {
  imgur.uploadBase64(imgurData.base64String, imgurData.album, imgurData.title, imgurData.description)
    .then((json) => {
      console.log('Meme uploaded to imgur!', json.data.link);
      return cb(null, json.data.link);     
      })
    .catch((err) => {
      console.error(err.message);
      return cb(err)
    }); 
}

// currently don't need this method
exports.upDateMetaData = (id, title, description, cb) => {
  imgur.update({
    id: id,
    title: title,
    description: description
  }, (err,response) => {
    if (err) {
      return cb(err)
    }
    console.log('Response.data: ', response.data); // returns true

    return cb(null, response.data)
  });
}
