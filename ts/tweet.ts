class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const lowerText = this.text.toLowerCase();

        //Identify live event
        if(
            lowerText.includes("watch") ||
            lowerText.includes("right now")
        )
        {return "live_event";}
        
        //Identify achievement
        if(
            lowerText.includes("personal record") ||
            lowerText.includes("new record") ||
            lowerText.includes("achieved")
        )
        {return "achievement";}

        //Identify completed event
        if(
            lowerText.includes("just completed") ||
            lowerText.includes("just posted")
        )
        {return "completed_event";}

        //Misc events
        return "miscellaneous";
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.writtenText.length > 0;
    }

    //Tweet text cleaner helper
    private get cleanedTweetText(): string{
        return this.text
          .replace(/#RunKeeper\b/gi, "") //Strip hashtag
          .replace(/https:\/\/\S+/gi, "") //Remove links
          .replace(/\s+/g, " ") //Replace extra spaces within text with single space
          .trim();
    }

    get writtenText():string {
        let text = this.cleanedTweetText;
        //Remove RunKeeper default text
        text = text.replace(/Just completed a .*? with (?:@?RunKeeper)\.?\s*Check it out!?/gi,"");
        text = text.replace(/I just completed a .*? with (?:@?RunKeeper)\.?\s*Check it out!?/gi, "");

        //Remove puctuation and adjust remaining extra white spaces
        return text
          .replace(/^[\s\-–—:|.,!?]+|[\s\-–—:|.,!?]+$/g, "")
          .replace(/\s+/g, " ")
          .trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}