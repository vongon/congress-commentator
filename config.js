// replace this file with data in https://paper.dropbox.com/doc/Congress-Commentator-Config--ATwHo6jeqCx0nBut_EiLAZ7eAg-xYEzMfpbVCa7PU3lziVFq

if (process.env.configPath) {
  module.exports = require(process.env.configPath);
  return;
}

// test account: https://twitter.com/RepRWilliamsBot
module.exports = {
  congressPerson: {
    name: 'Roger Williams', // Roger Williams 
    party: 'R', // R
    jurisdiction: 'Weatherford', // Weatherford
    handle: '@RepRWilliams', // @RepRWilliams
  },
  twitterKeys: {
    consumer_key: 'XaKssTKUmRhzY4GKrAPXhaKMb',
    consumer_secret: '6Phzlft0RLj8bBPQVHPAhdoFreYLMsnqKYBDqKBUVJwuZOcVaz',
    access_token_key: '1060289117588721664-W72n8XeZb4gIxKJaUIBV7zvBDK9Oxa',
    access_token_secret: 'Dwo6cx4G67pB5le3QSC8bKNwQEl5R9i2D3rZPkyI3uE6Y',
  },
  // find member id here: 'http://bioguide.congress.gov/biosearch/biosearch.asp'
  propublicaKeys: {
    memberId: 'W000816' ,
    datastore: 'QgyeTT1TeoMwbseifIddCAlPxsKNicKBF7ThRnKF',
  },
  // campaign finance keys
  propublicaFEC: {
    fec_key: 'GHAWg0Jgv5lshFbnm2J3ZXY3nYal7yVN2MW5iCaf',
    url: 'https://api.propublica.org/campaign-finance/v1/2018/candidates/H2TX33040.json',
    fec_id: 'H2TX33040', // https://www.fec.gov/data/browse-data/?tab=candidates, // https://www.fec.gov/data/browse-data/?tab=candidates
  },
  mongo: {
    connectionString: 'mongodb://rw-votes-admin:Onmanysides1234@ds131687.mlab.com:31687/rw-votes-tweets',
    options: {useNewUrlParser: true}
  }
};
