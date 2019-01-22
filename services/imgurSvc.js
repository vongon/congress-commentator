const fs = require('fs');
const path = require('path');
const async = require('async');
const imgur = require('imgur');
var imgurAPI = require('imgur-node-api');
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
    .then((json) => {
      console.log('Imgur link: ', json.data.link);
      return cb(null, json.data.link);
    })
    .catch((err) => {
      console.error(err.message);
      return cb(err)
    });
}

exports.uploadBase64 = (data, cb) => {
  imgur.uploadBase64(data)
    .then((json) => {
      console.log('Meme uploaded to imgur!', json.data.link);
      return cb(null, json.data.link);     
      })
    .catch((err) => {
      console.error(err.message);
      return cb(err)
    }); 
}

exports.upDateMetaData = (id, title, description, cb) => {
  imgurAPI.update({
    id: id,
    title: title,
    description: description
  }, (err,res) => {
    if (err) {
      return cb(err)
    }
  console.log('Metadata updated!', res.data);

  return cb(res.data)
  });
}

