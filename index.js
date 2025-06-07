require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const db = require('./firebase');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Import handlers
require('./handlers/start')(bot);
require('./handlers/view')(bot);
require('./handlers/reaction')(bot);
require('./handlers/referral')(bot);
require('./handlers/account')(bot);
require('./handlers/pricing')(bot);
require('./handlers/help')(bot);
require('./handlers/bonus')(bot);
require('./handlers/stats')(bot);

// Launch
bot.launch();
console.log('Bot is running...');
