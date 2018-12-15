var { twitterKeys } = require('../config');

var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

exports.tweet = (message, cb) => {
  client.post('statuses/update', {status: message}, cb);
}
