module.exports = (bot) => {
  bot.hears('📜 Help', async (ctx) => {
    const helpMessage = `
📖 *How to Use the Bot*

Welcome to the Social Media Booster Bot! Here's how to use it:

👁 *View Orders*
1. Click on 👁 *View*
2. Send your Telegram post link
3. Enter how many views you want
🔹 1 Point = 1 View
🔹 Minimum Order: 50 Views

👍 *Reaction Orders*
1. Click on 👍 *Reaction*
2. Send your Telegram post link
3. Enter how many reactions you want
🔹 1 Reaction = 20 Points
🔹 Minimum Order: 50 Reactions

💰 *Points System*
- You need points to place orders
- Buy points using 💳 Pricing
- If you don’t have enough points, deposit is required

🎁 *Daily Bonus*
- Click 🎉 Bonus every 24 hours to get +500 free points!

👥 *Referral Program*
- Share your referral link to earn +1000 points for every user who starts the bot

📊 *Track Your Progress*
- Use 👤 Account to check your points, referrals, and user ID
- Use 🌐 Statistics to see global usage

Need help or want to pay? 👉 @SocialMediaHikeOfficial
    `;

    await ctx.reply(helpMessage, { parse_mode: 'Markdown' });
  });
};
