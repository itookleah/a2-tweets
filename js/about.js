function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	//Dates
	var earliestDate = tweet_array[0];
	var latestDate = tweet_array[0];
	for(var i = 0; i < tweet_array.length - 1; i++) {
		//Check for earliest date
		if (new Date(tweet_array[i].time) < new Date(earliestDate.time)) {
			earliestDate = tweet_array[i];
		}
		//Check for latest date
		if (new Date(tweet_array[i].time) > new Date(latestDate.time)) {
			latestDate = tweet_array[i];
		}
	}
	//Display dates
	document.getElementById('firstDate').innerText = earliestDate.time.toLocaleDateString();
	document.getElementById('lastDate').innerText = latestDate.time.toLocaleDateString();

	//Count events
	var compEvents = 0;
	var liveEvent = 0;
	var numAchieved = 0;
	var miscCount = 0;
	for(var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source === "completed_event") {
			compEvents += 1;
		} else if (tweet_array[i].source === "live_event") {
			liveEvent += 1;
		} else if (tweet_array[i].source === "achievement") {
			numAchieved += 1;
		} else if (tweet_array[i].source === "miscellaneous") {
			miscCount += 1;
		}
	}

	//Display counts
	var elems = document.querySelectorAll('.completedEvents');
	for (var i = 0; i < elems.length; i++) {
		elems[i].innerText = compEvents;
	}
	document.querySelector('.liveEvents').innerText = liveEvent;
	document.querySelector('.achievements').innerText = numAchieved;
	document.querySelector('.miscellaneous').innerText = miscCount;

	//Calculate and display pcts
	document.querySelector('.completedEventsPct').innerText = math.format((compEvents/tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + "%";
	document.querySelector('.liveEventsPct').innerText = math.format((liveEvent/tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + "%";
	document.querySelector('.achievementsPct').innerText = math.format((numAchieved/tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + "%";
	document.querySelector('.miscellaneousPct').innerText = math.format((miscCount/tweet_array.length) * 100, {notation: 'fixed', precision: 2}) + "%";

	//User written texts
	var userCount = 0;
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written === true) {
			userCount += 1;
		}
	}
	document.querySelector('.written').innerText = userCount;
	document.querySelector('.writtenPct').innerText = math.format((userCount/compEvents) * 100, {notation: 'fixed', precision: 2}) + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
