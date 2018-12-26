
const propublicaService = require('../services/propublica');
const Contribution = require('../models/contribution')
    
// get FEC data
propublicaService.getCampaignFinanceData((err, data) => {
  if (err) {
    return cb(err);
  }
    const contributions = data.results[0]
    console.log('Got the campaign finance data in importData.js. Total from PACs this cycle to date: ', contributions.total_from_pacs)
    return contributions;
});