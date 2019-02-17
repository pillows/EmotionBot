const Discord = require('discord.js');
const client = new Discord.Client();
require('custom-env').env()

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var user_msgs = {}
var TIME_INTERVAL = 5000

var toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: process.env.IAM_KEY,
  url: process.env.TONE_URL,
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {
    CheckNewMessage(msg)

  	// Only read messages not created by a bot
  	// and by a certain length
  	if(!msg.author.bot && msg.content.length > 10){
  		//console.log(msg.content);

  		// msg.content = the raw message sent by the user
  		var toneParams = {
		  tone_input: { 'text': msg.content },
		  content_type: 'application/json'
		};
  		toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
			if (error) {
			    console.log(error);
			} 
			else { 
				
			    //console.log(JSON.stringify(toneAnalysis, null, 2));
			    /* 
			    Sample of output:
			    {
				  "document_tone": {
				    "tones": [
				      {
				        "score": 0.591225,
				        "tone_id": "anger",
				        "tone_name": "Anger"
				      },
				      {
				        "score": 0.560098,
				        "tone_id": "analytical",
				        "tone_name": "Analytical"
				      },
				      {
				        "score": 0.645985,
				        "tone_id": "confident",
				        "tone_name": "Confident"
				      }
				    ]
				  }
				}
			  }
			  */
			}
		});
  	}
});

function CheckNewMessage(msg){
    //if "new message"
    if(CheckNewUser(msg) || !CheckWithinTimeBlock(msg) ){
        user_msgs[msg.author] = {
            timestamp: msg.createdTimestamp,
            message: msg.content
        }

        //after TIME_INTERVAL seconds, send api call 
        setTimeout(function(){
            //send api call
            console.log(user_msgs[msg.author].message);
        }, TIME_INTERVAL)
    }else{
        user_msgs[msg.author].message += " " + msg.content
    }  
}

//true if message sent within TIME_INTERVAL seconds
function CheckWithinTimeBlock(msg){
    let user = user_msgs[msg.author]
    return Math.abs(msg.createdTimestamp - user.timestamp) < TIME_INTERVAL
}

function CheckNewUser(msg){
    return user_msgs[msg.author] === undefined
}


client.login(process.env.BOT_KEY);