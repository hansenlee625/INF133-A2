function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	const activity_data = [];
	
	for(let i = 0; i < tweet_array.length; i++){
		const tweet = tweet_array[i];
		if(tweet.source === 'completed_event' && tweet.activityType !== 'unknown'){
			activity_data.push({
			  activity: tweet.activityType
			});
		}
	}

	activity_vis_spec ={
	    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	    "description": "A graph of the number of Tweets containing each type of activity.",
	    "data": {"values": activity_data},
	    "mark": "bar",
	    "encoding":{
			"x":{
			"field": "activity",
	        "type": "nominal",
	        "sort": "-y",
	        "title": "Activity Type"
	    },
	    "y":{
	        "aggregate": "count",
	        "type": "quantitative",
	        "title": "Number of Tweets"
	    }
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	document.getElementById('numberActivities').innerText = 16;
	document.getElementById('firstMost').innerText = "run";
	document.getElementById('secondMost').innerText = "walk";
	document.getElementById('thirdMost').innerText = "bike";

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});