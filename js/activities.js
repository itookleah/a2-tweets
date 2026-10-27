function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//Check how many activites in the dataset 
	var compActivityArr = new Array();
	for (var i = 0; i < tweet_array.length; i++) {
		compActivityArr.push(tweet_array[i].activityType);
	}
	var unqActivities = new Set(compActivityArr);
	var numActivities = unqActivities.size;
	//Display activities in dataset
	document.getElementById('numberActivities').innerText = numActivities;
	//Get num activies per category
	var numOfActivityPer = new Map();
	for (const x of unqActivities) {
		var count = 0;
		for (var j = 0; j < tweet_array.length; j++){
			if (x === tweet_array[j].activityType) {
				count++;
			}
		}
		numOfActivityPer.set(x, count);
	}

	var activityCountArr = new Array();
	for (const x of numOfActivityPer.values()) {
		activityCountArr.push(x);
	}
	activityCountArr.sort(function(a, b){return b - a});
	var highest = activityCountArr[0];
	var middle = activityCountArr[1];
	var lowest = activityCountArr[2];
	var highestActivity = "";
	var middleActivity = "";
	var lowestActivity = "";
	numOfActivityPer.forEach (function(value, key) {
		if (value === highest) {
			highestActivity = key;
		} else if (value === middle) {
			middleActivity = key;
		} else if (value === lowest) {
			lowestActivity = key;
		}
	})
	document.getElementById('firstMost').innerText = highestActivity;
	document.getElementById('secondMost').innerText = middleActivity;
	document.getElementById('thirdMost').innerText = lowestActivity;

	//Display distances
	var firstDist = 0;
	var middleDist = 0;
	var shortestDist = 0;
	var largest = "";
	var smallest = "";
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType === highestActivity) {
			firstDist += tweet_array[i].distance;
		} else if (tweet_array[i].activityType === middleActivity) {
			middleDist += tweet_array[i].distance;
		} else if (tweet_array[i].activityType === lowestActivity) {
			shortestDist += tweet_array[i].distance;
		} 
	}

	if (firstDist >= middleDist && firstDist >= shortestDist) {
		largest = highestActivity;
	} else if (middleDist >= firstDist && middleDist >= shortestDist) {
		largest = middleActivity;
	} else {
		largest = lowestActivity;
	}

	if (firstDist <= middleDist && firstDist <= shortestDist) {
    	smallest = highestActivity;
	} else if (middleDist <= firstDist && middleDist <= shortestDist) {
		smallest = middleActivity;
	} else {
		smallest = lowestActivity;
	}

	document.getElementById("longestActivityType").innerHTML = largest;
	document.getElementById("shortestActivityType").innerHTML = smallest;

	//Weekend vs weekday distance
	var weekdayDist = 0;
	var weekendDist = 0;
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType === largest) {
			if (tweet_array[i].time.getDay() === 0 || tweet_array[i].time.getDay() === 6) {
				weekendDist += tweet_array[i].distance;
			} else {
				weekdayDist += tweet_array[i].distance;
			}
		}
	}

	if (weekdayDist > weekendDist) {
		document.getElementById("weekdayOrWeekendLonger").innerHTML = "the weekdays";
	} else {
		document.getElementById("weekdayOrWeekendLonger").innerHTML = "the weekends";
	}

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	var activity_types = new Array();
	for (var i = 0; i < tweet_array.length; i++) {
		activity_types.push({activityType: tweet_array[i].activityType});
	}

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_types

	  },
	  //TODO: Add mark and encoding
	  "mark": "point", 
	  "encoding": {
		"x": {"field": "activityType", "type": "nominal" },
		"y": {"aggregate": "count", "type": "quantitative" }
	  }

	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});