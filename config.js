
// replace this file with data in https://paper.dropbox.com/doc/Congress-Commentator-Config--ATwHo6jeqCx0nBut_EiLAZ7eAg-xYEzMfpbVCa7PU3lziVFq

if (process.env.configPath) {
  module.exports = require(process.env.configPath);
  return;
}

// test account: https://twitter.com/RepRWilliamsBot
module.exports = {
  congressPerson: {
    name: '', // Roger Williams 
    party: '', // R
    jurisdiction: '', // Weatherford
    handle: '', // @RepRWilliams
  },
  twitterKeys: {
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: '',
  },
  // find member id here: 'http://bioguide.congress.gov/biosearch/biosearch.asp'
  propublicaKeys: {
    memberId: '' ,
    datastore: '',
  },
  // campaign finance keys
  propublicaFEC: {
    fec_key: '',
    url: '',
    fec_id: '', // https://www.fec.gov/data/browse-data/?tab=candidates
  },
  mongo: {
    connectionString: '',
    options: {}
  },
  // scraping keys
  fec: {
    url: '',
    api_key: '',
    committee_id: ''
  },
  bitly: {
    api_key: '',
    client_id: '',
    client_secret: '',
    access_token: ''
  },
  imgur: {
    client_id: '',
    client_secret: '',
    user: '',
    pw: ''
  } 
};