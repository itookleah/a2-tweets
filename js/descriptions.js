var written_array = new Array();

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	} 

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			written_array.push(tweet_array[i]);
		}
	}

}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', function (event) {
		var ch = document.getElementById('textFilter').value.toLowerCase();
		var count = 0;
		document.getElementById('tweetTable').innerHTML = '';	
		for (var i = 0; i < written_array.length; i++) {
			if (written_array[i].text.toLowerCase().includes(ch)) {
				document.getElementById('tweetTable').innerHTML += written_array[i].getHTMLTableRow(i + 1);
				count++;
			}
		}
		document.getElementById('searchCount').innerText = count;
		document.getElementById('searchText').innerHTML = ch;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});