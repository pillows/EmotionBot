const Discord = require('discord.js');
const client = new Discord.Client();
require('custom-env').env()

var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var TIME_INTERVAL = 5000 //how long to consider concat messsages together
var SERVER_NAME = "HackNYU Test" //change for server name
var MOD_ROLE = "mod" //adjust for what the name of your role for who to alert is

var user_msgs = {}
var mods = []

var toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
  iam_apikey: process.env.IAM_KEY,
  url: process.env.TONE_URL,
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    let guild = client.guilds.find(guild => guild.name === SERVER_NAME)
    let mod_id = guild.roles.find(role => role.name == MOD_ROLE).id

    //get mod ids to send messages to
    guild.members.forEach((member) => {
        if(member._roles.includes(mod_id)){
            mods.push(member.user.id)
        }
    })
});


client.on('message', msg => {
    if(!msg.author.bot){
        CheckNewMessage(msg)
    }
});

function CheckNewMessage(msg){
    //if "new message"
    if(CheckNewUser(msg)){
        user_msgs[msg.author] = {
            message: msg.content,
            timeout: ""
        }
    }else{
        //concatinate messages together if message sent within 5 seconds of each other
        clearTimeout(user_msgs[msg.author].timeout)
        user_msgs[msg.author].message += " " + msg.content
    }

    user_msgs[msg.author].timeout = setTimeout(function(){
        CheckMessageEmotion(msg, toneAnalyzer)
    }, TIME_INTERVAL)
}

function CheckNewUser(msg){
    return user_msgs[msg.author] === undefined
}

function CheckMessageEmotion(msg, toneAnalyzer){
    let message = "This message contains ";

    if(!msg.author.bot){
        console.log("msg:", user_msgs[msg.author].message)

        // msg.content = the raw message sent by the user
        var toneParams = {
            tone_input: { 'text': user_msgs[msg.author].message },
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
                      message += i.tone_id + "(" + i.score + ") \n";
                  }
              }

              //check if should alert mods
              if(message != "This message contains "){
                let author = msg.author.username
                let triggerMessage = user_msgs[msg.author].message
                //send message to all mods
                for(let i of mods){
                    client.users.get(i).send(author + " has written a message that triggered an alarm: " + "```"+triggerMessage+"```\n" + "Summary: " +message );
                }
              }
              
              //reset message once api call has been made (so as to not concat older messages)
              user_msgs[msg.author].message = ""

              /*
              Sample of api output:
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
            */
          }
      });
    }
}

client.login(process.env.BOT_KEY);
