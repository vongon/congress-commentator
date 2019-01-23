const fs = require('fs');
const path = require('path');
const async = require('async');
const imgur = require('imgur');
var request = require('request');

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
  imgur.update({
    id: id,
    title: title,
    description: description
  }, (err,response) => {
    if (err) {
      return cb(err)
    }
    console.log('Metadata updated!', response.data); // undefined

  return cb(response.data)
  });

}

// update metadata

 imgur.update = function(_params, _cb) {
    if(config.imgur.client_id && _params.id && (_params.title || _params.description)) {
      var options = {
        url: 'https://api.imgur.com/3/image/' + _params.id,
        headers: {
          'Authorization': 'Client-ID ' + config.imgur.client_id
        },
        form: {
          title: _params.title ? _params.title : null,
          description: _params.description ? _params.description : null
        }
      };
      request.post(options, function (err, req, body) {
        if(err) {
          return _cb(err);
        }
        _cb(null, body);
      });
    }
  }






