function findDateRange(tweets){
	let earliestTweet = tweets[0];
	let latestTweet = tweets[0];

	for(let i = 1; i < tweets.length; i++){
		if(tweets[i].time < earliestTweet.time){earliestTweet = tweets[i];}
		if(tweets[i].time > latestTweet.time){latestTweet = tweets[i];}
	}

	return{earliest: earliestTweet, latest: latestTweet};
}

function formatDate(date){
	return date.toLocaleDateString('en-US',{
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

function updateDates(earliestTweet, latestTweet){
	document.getElementById('firstDate').innerText = formatDate(earliestTweet.time);
	document.getElementById('lastDate').innerText = formatDate(latestTweet.time);
}

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
	if(tweet_array.length === 0){return;}

	const dateRange = findDateRange(tweet_array);
	updateDates(dateRange.earliest, dateRange.latest);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});