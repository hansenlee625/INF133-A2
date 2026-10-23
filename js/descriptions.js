let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	for(let i = 0; i < runkeeper_tweets.length; i++){
		const rawTweet = runkeeper_tweets[i];
		const tweet = new Tweet(rawTweet.text, rawTweet.created_at);
		if(tweet.written){writtenTweets.push(tweet);}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	searchBox = document.getElementById('textFilter');
	searchCount = document.getElementById('searchCount');
	searchText = document.getElementById('searchText');
	tweetTable = document.getElementById('tweetTable');

	searchBox.addEventListener('input', function (){
		query = searchBox.value;
		searchText.innerText = query;
		if(query === ''){
			searchCount.innerText = '0';
			tweetTable.innerHTML = '';
			return;
		}

		let count = 0;
		let rows = '';
		for(let i = 0; i < writtenTweets.length; i++){
			tweet = writtenTweets[i];
			if(tweet.source === "completed_event" && tweet.cleanedTweetText.toLowerCase().includes(query.toLowerCase())){
				count++;
				rows += tweet.getHTMLTableRow(count);
			}
		}

		searchCount.innerText = count.toString();
		tweetTable.innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});