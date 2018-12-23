var config = require('../config');
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: config.twitterKeys.consumer_key,
  consumer_secret: config.twitterKeys.consumer_secret,
  access_token_key: config.twitterKeys.access_token_key,
  access_token_secret: config.twitterKeys.access_token_secret
});

exports.tweet = (message, cb) => {
  client.post('statuses/update', {status: message}, cb);
}
