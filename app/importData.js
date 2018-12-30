const async = require('async')
const propublicaService = require('../services/propublica');
const Contribution = require('../models/contribution')
    
// get FEC data
module.exports = importData = (cb) => {
  propublicaService.getCampaignFinanceData((err, data) => {
	  if (err) {
	    return cb(err);
	  }
	  const contributions = data.results;
	  async.eachSeries(contributions, (data, sCb) => {
	  	Contribution.find({'data.fec_uri': data.fec_uri}).lean(true).exec((err, contributions) => {
	  		if (err) {
	  			return sCb(err);
	  		}
	  		if (contributions.length > 0) {
	  			console.log('Skipping this contribution upload becase we have an existing entry for fec_uri:', data.fec_uri);
	  			return setImmediate(sCb);
	  		}
	  		console.log('Uploading new fec_uri:', data.fec_uri);
	  		const newContribution = new Contribution({data});
	  		newContribution.save(sCb);
	  	})
	  }, cb)
  });
}

