
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

// trim tweet Question & Description 
const trimString = (string, maxLength) => {
  var trimmedString = string.substr(0, maxLength);
  // lastWord regex match will return null if we don't remove punctuation first
  trimmedString = trimmedString.replace(/\b[-.,()&$#!\[\]{}"']+\B|\B[-.,()&$#!\[\]{}"']+\b/g, "");
  // now re-trim if we are in the middle of a word
  trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
 	// remove awkward words at ends of phrases
  var lastWord = trimmedString.match(/\w+$/)[0];
  var lastIndex = trimmedString.lastIndexOf(" ");

		if (lastWord == 'of' ||
		    lastWord == 'the' ||
		    lastWord == 'and' ||
		    lastWord == 'for' ||
		    lastWord == 'with' ||
		    lastWord == 'to' ||
		    lastWord == 'to' ||
		    lastWord == 'ending') {
		    trimmedString = trimmedString.substring(0, lastIndex);
		}
  return trimmedString + `...`; 
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
