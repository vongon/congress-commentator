
// tweeting PAC contributions every 2 hours in tweetPacs
const okayToTweet = (contribution) => {
  if (!contribution.tweetedAt) {
    return true;
  }
  const tweetedAt = new moment(contribution.tweetedAt);
  const cutoff = new moment().subtract(2, 'h');
    if (tweetedAt.isBefore(cutoff)) {
      return true;
    }
  return false;
};

// trim tweet Question & Description without cutting off mid-word
const trimString = (string, maxLength) => {
  var trimmedString = string.substr(0, maxLength);
  //re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
  var lastWord = trimmedString.match(/\w+$/)[0];
  var lastIndex = trimmedString.lastIndexOf(" ");
  // can this be refactored with a dictionary of these words?
  if (lastWord == "of" || lastWord == "the" || lastWord == "and" || 
  	  lastWord == "ending" || lastWord == "or" || lastWord == "for" || 
  	  lastWord == "with") { 
    trimmedString = trimmedString.substring(0, lastIndex);
  }
  return trimmedString;
}

// handle null values for string methods
const handleNullValues = (obj) => {
  Object.keys(obj).forEach(function(key) {
    if(obj[key] === null) {
      obj[key] = '-';
    }
  })
  return obj;
};

// to avoid 186 errors, abbreviate
const handleDonorName = (str) => {
  var mapObj = {
   'Political Action Committee':"PAC",
   'pac':"PAC",
   'Pac':"PAC",
   'political action committee':"PAC",
   'Association':"Assn.",
   'Companies':"Co's."
  };

  var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
  str = str.replace(re, function(matched){
    return mapObj[matched];
  });
  return str
};

// properCase helper -- FEC data is all caps
const toProperCase = (string) => {
	return string.replace(/\w\S*/g, (txt) => { 
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

module.exports = {
    okayToTweet: okayToTweet,
    handleNullValues: handleNullValues,
    handleDonorName: handleDonorName,
    toProperCase: toProperCase,
    trimString: trimString
};

