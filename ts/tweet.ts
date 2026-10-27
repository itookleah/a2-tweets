class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous
        if (this.text.toLowerCase().startsWith("achieved")) {
            return "achievement";
        } else if (this.text.toLowerCase().startsWith("watch my")) {
            return "live_event";
        } else if (this.text.toLowerCase().includes("posted") || this.text.toLowerCase().includes("completed")){
            return "completed_event";
        } else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.text.includes("-")) {
            return true;
        }
        return false;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        var pieces = this.text.split(" ");
        var userText = "";
        for (var i = 0; i < pieces.length - 1; i++) {
            if (pieces[i] === '-') {
                userText = userText + pieces[i];
                for (let j = 0; j < pieces.length; j++)  {
                    if (pieces[i].startsWith('https')) {
                        return userText;
                    }
                }
            }
        }
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        if (this.text.includes("run")) {
            return "run";
        } else if (this.text.includes("bike")) {
            return "bike";
        } else if (this.text.includes("walk")) {
            return "walk";
        } else if (this.text.includes("workout")) {
            return "workout";
        } else if (this.text.includes("ski")) {
            return "ski";
        } else if (this.text.includes("row")) {
            return "row";
        } else if (this.text.includes("yoga")) {
            return "yoga";
        } else if (this.text.includes("swim")) {
            return "swim";
        } else {
            return "unknown";  
        }
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        var beginning = this.text.indexOf("a ") + 2;
        var mi = this.text.indexOf("mi");
        var km = this.text.indexOf("km");
        var dist = 0;
        if (this.text.includes("mi")) {
            dist = parseFloat(this.text.substring(beginning, mi));
            return dist;
        } else if (this.text.includes("km")) {
            dist = parseFloat(this.text.substring(beginning, km));
            dist = dist/1.609;
            return dist;
        }
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        var written_text = this.text; 

        return "<tr>" + "<td>" + rowNumber + "</td>" + "<td>" + this.activityType + "</td>" + "<td>" + written_text + "</td>" + "</tr>";
    }
}