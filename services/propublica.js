const config = require('../config');

const Congress = require( 'propublica-congress-node' );

const client = new Congress( config.propublicaKeys.datastore );

const request = require('request-promise');

exports.getCampaignFinanceData = getCampaignFinanceData = () => {

	request({
	  "method":"GET", 
	  "uri": config.propublicaFEC.url,
	  "json": true,
	  "headers": {
	    'X-API-Key': config.propublicaFEC.fec_key
	  }
	}).then(function(response) {
	
      contributions = response.results[0]
      
      console.log('Propublica FEC contribution data:', contributions)
      return contributions 
  })

}
