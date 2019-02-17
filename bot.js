const Discord = require('discord.js');
const client = new Discord.Client();
require('custom-env').env()

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var user_msgs = {}
var TIME_INTERVAL = 5000
var api_call

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
  
});

function CheckNewMessage(msg){
    //if "new message"
    if(CheckNewUser(msg)){
        user_msgs[msg.author] = msg.content
    }else{
        clearTimeout(api_call)
        user_msgs[msg.author] += " " + msg.content
    }  

    api_call = setTimeout(function(){
        SendAPICall(msg, toneAnalyzer)
        user_msgs[msg.author] = ""
        
    }, TIME_INTERVAL)
}

function CheckNewUser(msg){
    return user_msgs[msg.author] === undefined
}

function SendAPICall(msg, toneAnalyzer){
    let message = "This message contains ";

    if(!msg.author.bot/* && msg.content.length > 10*/){
        console.log("msg:", user_msgs[msg.author])
        //console.log(msg.content);

        // msg.content = the raw message sent by the user
        var toneParams = {
            tone_input: { 'text': user_msgs[msg.author] },
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
                  if(tone_checks.includes(i.tone_id)){
                      message += i.tone_id + "(" + i.score + ") ";
                  }
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
              }
            }
            */
          }
      });
    }
}

// client.login(process.env.BOT_KEY);
//     //msg.reply('Pong!');


// });

client.login(process.env.BOT_KEY);
