// ----- Date Display Helpers ----- //
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


// ----- Tweet Counter Helpers ----- //
function countTweetTypes(tweets){
	const counts = {
		liveEvents: 0,
		achievements: 0,
		completedEvents: 0, userText: 0,
		miscellaneous: 0,
	};

	for(let i = 0; i < tweets.length; i++) {
		const tweet = tweets[i];
		if(tweet.source === 'live_event'){counts.liveEvents++;}
		else if(tweet.source === 'achievement'){counts.achievements++;} 
		else if(tweet.source === 'completed_event'){
			counts.completedEvents++;
			if(tweet.written){userText++;}
		}
		else{counts.miscellaneous++;}
	}

	return counts;
}

function updateCategoryCounts(counts, totalTweets){
	setClassText('liveEvents', counts.liveEvents);
	setClassText('liveEventsPct', getPercentage(counts.liveEvents, totalTweets));

	setClassText('achievements', counts.achievements);
	setClassText('achievementsPct', getPercentage(counts.achievements, totalTweets));

	setClassText('completedEvents', counts.completedEvents);
	setClassText('completedEventsPct', getPercentage(counts.completedEvents, totalTweets));
	setClassText('written', counts.userText);
	setClassText('writtenPct', getPercentage(counts.userText, totalTweets));

	setClassText('miscellaneous', counts.miscellaneous);
	setClassText('miscellaneousPct', getPercentage(counts.miscellaneous, totalTweets));
}

function getPercentage(count, total){
	if(total === 0){ return '0.00%';}
	return ((count / total) * 100).toFixed(2) + '%';
}


// ----- Class text setter helper ----- //
function setClassText(className, value){
	document.querySelectorAll('.' + className).forEach((e) => {e.innerText = value;});
}


// ----- parseTweets function ----- //
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

	const counts = countTweetTypes(tweet_array);
	updateCategoryCounts(counts, tweet_array.length);
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});