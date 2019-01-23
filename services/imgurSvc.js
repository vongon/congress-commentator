const fs = require('fs');
const path = require('path');
const async = require('async');
const imgur = require('imgur');
var request = require('request');
var request = request.defaults({
  json: true
});


const memeLib = require('nodejs-meme-generator');

const config = require('../config');

// Set imgur client id
imgur.setClientId(config.imgur.client_id);
// Get imgur client id
imgur.getClientId();
// Set credentials
imgur.setCredentials(config.imgur.user, config.imgur.pw, config.imgur.client_id);

https://api.imgur.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=REQUESTED_RESPONSE_TYPE&state=APPLICATION_STATE

// update metadata
 imgur.update = (_params, _cb) => {
    if(config.imgur.client_id && _params.id && (_params.title || _params.description)) {
      var options = {
        url: 'https://api.imgur.com/3/image/' + _params.id,
        headers: {
          // 'Authorization': 'Client-ID ' + config.imgur.client_id
          'Authorization': 'Bearer ' + config.imgur.access_token
        },
        form: {
          title: _params.title ? _params.title : null,
          description: _params.description ? _params.description : null
        }
      };
      request.post(options, (err, req, body) => {
        if(err) {
          return _cb(err);
        }
        _cb(null, body);
      });
    }
  }

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
    console.log('Response.data: ', response.data); // true(?)

    return cb(null, response.data)
  });
}

// imgur access tokens are good for a month, so this needs to be implemented
exports.generateImgurAccessToken = (clientId, cb) => {
  const options = {
    method: 'GET',
    url: 'https://api.imgur.com/oauth2/authorize?client_id=' + config.imgur.client_id + '&response_type=access_token',

  }
  request(options, (err, response, body) => {
    if (err) {
      return cb(err);
    }
  console.log('Redirect URL :', response) 

  return cb(null, body);

  });
}



