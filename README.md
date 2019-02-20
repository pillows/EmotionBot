# EmotionBot
 Emotion Bot is the attentive companion who is always looking out for others and does its best to track anyone who might not be doing their best.

# Tech
Emotion bot uses the IBM Watson Tone Analysis API for checking messages and the Discord API for the bot functions. The bot uses NodeJS as the backend.

# Installation
```
npm install
```

Also you need to make a .env file with this format. Make sure to fill in the blanks.
```
APP_ENV=staging
BOT_KEY=
IAM_KEY=
TONE_URL=https://gateway.watsonplatform.net/tone-analyzer/api
```

# Usage
```
node bot.js
```

It's recommended to use screen, nodemon, or any other application that allows you to run scripts in the background.

