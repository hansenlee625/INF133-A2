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
			  activity: tweet.activityType,
			  distance: tweet.distance,
			  time: tweet.time
			});
		}
	}

	activity_vis_spec ={
	    $schema: "https://vega.github.io/schema/vega-lite/v5.json",
	    description: "A graph of the number of Tweets containing each type of activity.",
	    data:{values: activity_data},
	    mark: "bar",
	    encoding:{
			x:{
				field: "activity",
				type: "nominal",
				sort: "-y",
				title: "Activity Types"
			},
			y:{
				aggregate: "count",
				type: "quantitative",
				title: "Number of Tweets"
			}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec);

	//Update # types of activities and 3 most logged activities
	document.getElementById('numberActivities').innerText = 16;
	document.getElementById('firstMost').innerText = "run";
	document.getElementById('secondMost').innerText = "walk";
	document.getElementById('thirdMost').innerText = "bike";

	//Most logged activities list
	const top_activities = ["run", "walk", "bike"];

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	const distance_data = []; 
	for(let i = 0; i < activity_data.length; i++){
		const activity = activity_data[i];
		for(let j = 0; j < top_activities.length; j++){
			if(activity.activity === top_activities[j] && activity.distance > 0){
				distance_data.push(activity);
				break;
			}
		}
	}

	//Plot of distances by day of week for 3 most tweeted activities
	distance_vis_spec ={
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		description: "Individual distances for the three most tweeted activities.",
		width: 250,
		data:{values: distance_data},
		mark: "circle",
		encoding:{
			x:{
				field: "time",
				type: "ordinal",
				timeUnit: "day",
				axis:{
					format: "%a",
					labelOverlap: false,
				}
			},
			y:{
				field: "distance",
				type: "quantitative",
				title: "Distance (mile)"
			},
			color:{
				field: "activity",
				type: "nominal",
				title: "Activity Type"
			}
		}
	};

	//Plot of MEAN distances by day of week for 3 most tweeted activities
	distance_vis_aggregated_spec = {
		$schema: "https://vega.github.io/schema/vega-lite/v5.json",
		description: "Mean distances for the three most tweeted activities.",
		width: 250,
		data:{values: distance_data},
		mark: "circle",
		encoding:{
			x:{
				field: "time",
				type: "ordinal",
				timeUnit: "day",
				axis:{
					format: "%a",
					labelOverlap: false,
				}
			},
			y:{
				field: "distance",
				type: "quantitative",
				aggregate: "mean",
				title: "Mean of Distances (mile)"
			},
			color:{
				field: "activity",
				type: "nominal",
				title: "Activity Type"
			}
		}
	};

	//Embed the graphs
	vegaEmbed('#distanceVis', distance_vis_spec);
	vegaEmbed('#distanceVisAggregated',distance_vis_aggregated_spec);

	document.getElementById('distanceVisAggregated').style.display = "none";
	let showingMeans = false;
	
	//Graph switch button
	document.getElementById('aggregate').addEventListener('click', function(){
		showingMeans = !showingMeans;
		if(showingMeans){
			document.getElementById('distanceVis').style.display = "none";
			document.getElementById('distanceVisAggregated').style.display = "block";
			document.getElementById('aggregate').innerText = "Show all activities";
		}
		else{
			document.getElementById('distanceVis').style.display = "block";
			document.getElementById('distanceVisAggregated').style.display = "none";
			document.getElementById('aggregate').innerText = "Show means";
		}
	});

	//Update activity HTML
	document.getElementById('longestActivityType').innerText = 'bike';
	document.getElementById('shortestActivityType').innerText = 'walk';
	document.getElementById('weekdayOrWeekendLonger').innerText = 'weekend';
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});