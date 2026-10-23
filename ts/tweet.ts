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
    get cleanedTweetText(): string{
        return this.text
          .replace(/\s+with @?RunKeeper\.?/gi, "") //Remove @
          .replace(/\s*check it out[.!]*/gi, "") //Remove default check text
          .replace(/\s+/g, " ") //Replace extra spaces within text with single space
          .trim();
    }

    get writtenText():string {
        let text = this.cleanedTweetText
          .replace(/#RunKeeper/gi, "") //Remove default hashtag
          .replace(/https?:\/\/\S+/gi, "") //Remove link
          //Remove the remaining generated RunKeeper activity description
          .replace(/just (?:completed|posted) an? (?:\d+(?:\.\d+)? (?:mi|km) )?[a-z]+(?: workout)?(?: in \d+(?::\d{2}){1,2})?/gi, "");

        //Remove punctuation and adjust remaining extra white spaces
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
        const match = this.text.match(/just (?:completed|posted) an? (?:\d+(?:\.\d+)? (?:mi|km) )?([a-z]+)(?: workout)?(?: in \d+(?::\d{2}){1,2})?/i);
        if(match === null){return "unknown";}
        return match[1].trim().toLowerCase();
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        const match = this.text.match(/completed an?\s+(\d+(?:\.\d+)?)\s+(mi|km)\b/i);
        if(match === null){return 0;}
        const dist = Number(match[1]);
        const unit = match[2].toLowerCase();
        if(unit === "km"){return dist / 1.609;}
        return dist;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        const clickableTweetLink = this.text.replace(
          /(https:\/\/\S+)/gi,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );
        
        return `
            <tr>
              <th scope="row">${rowNumber}</th>
              <td>${this.activityType}</td>
              <td>${clickableTweetLink}</td>
            </tr>
        `;
    }
}