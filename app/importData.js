
const propublicaService = require('../services/propublica');
const Contribution = require('../models/contribution')
    
// get FEC data

module.exports = importData = (cb) => {
  propublicaService.getCampaignFinanceData((err, data) => {
	  if (err) {
	    return cb(err);
	  }

    console.log('Importing data! Total from PACs this cycle to date: ', data.results[0].total_from_pacs)
    return cb(null, data.results[0])
  });
}

