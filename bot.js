const Discord = require('discord.js');
const client = new Discord.Client();
require('custom-env').env()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

console.log(process.env.BOT_KEY)
client.on('message', msg => {
  	
  	// Only read messages not created by a bot
  	if(!msg.author.bot){
  		//console.log(msg.content);
  	}
    //msg.reply('Pong!');
    
  
});

client.login(process.env.BOT_KEY);