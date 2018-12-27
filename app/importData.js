
const propublicaService = require('../services/propublica');
const Contribution = require('../models/contribution')
    
// get FEC data

module.exports = importData = (cb) => {
  propublicaService.getCampaignFinanceData((err, data) => {
	  if (err) {
	    return cb(err);
	  }

    console.log('Importing data! Total from PACs this cycle to date: ', contributions.total_from_pacs)
    return data.results[0];
    
  }, cb);
}

