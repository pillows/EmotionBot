const Discord = require('discord.js');
const client = new Discord.Client();
require('custom-env').env()

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: process.env.IAM_KEY,
  url: process.env.TONE_URL,
})


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('message', msg => {

  	//console.log(msg)
  	// Only read messages not created by a bot
  	// and by a certain length
    let message = "This message contains ";
  	if(!msg.author.bot && msg.content.length > 10){
  		//console.log(msg.content);

  		// msg.content = the raw message sent by the user
  		var toneParams = {
		  tone_input: { 'text': msg.content },
		  content_type: 'application/json'
		};

        let tone_checks = ['anger', 'fear', 'sadness'];
  		toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
			if (error) {
			    console.log(error);
			}
			else {
				// Types of emotions we are looking for:
				// Anger, Fear, and Sadness


                let tones = toneAnalysis.document_tone.tones;
                console.log(tones);
                // "i" will represent each tone
                for(let i of tones){
                    console.log(i.tone_id);
                    //if(tone_checks.includes(i.tone_id)){
                        message += i.tone_id + "(" + i.score + ") ";
                    //}
                }


                client.users.get("78334415322746880").send(message);

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
    //msg.reply('Pong!');


});

client.login(process.env.BOT_KEY);
