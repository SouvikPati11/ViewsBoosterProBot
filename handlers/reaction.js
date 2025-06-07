const db = require('../firebase');
const axios = require('axios');

module.exports = (bot) => {
  // Step 1: Ask for post link
  bot.hears('👍 Reaction', async (ctx) => {
    ctx.session = ctx.session || {};
    ctx.session.awaiting = 'reaction_link';
    await ctx.reply('📥 Please send the Telegram post link for reactions:');
  });

  // Step 2: Handle Telegram link input
  bot.on('text', async (ctx) => {
    ctx.session = ctx.session || {};

    const userId = ctx.from.id.toString();

    // Check if awaiting reaction link
    if (ctx.session.awaiting === 'reaction_link') {
      const link = ctx.message.text;

      if (!link.includes('t.me/')) {
        return ctx.reply('❌ Invalid Telegram post link. Please send a valid one.');
      }

      ctx.session.postLink = link;
      ctx.session.awaiting = 'reaction_amount';

      return ctx.reply('📊 How many reactions do you want? (Minimum: 50)\nEach reaction costs 20 points.');
    }

    // Step 3: Handle reaction count
    if (ctx.session.awaiting === 'reaction_amount') {
      const amount = parseInt(ctx.message.text);

      if (isNaN(amount) || amount < 50) {
        return ctx.reply('❌ Invalid amount. Minimum order is 50 reactions.');
      }

      const totalCost = amount * 20;

      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const user = userDoc.data();
      const userPoints = user?.points || 0;

      if (userPoints < totalCost) {
        return ctx.reply(`❌ You don't have enough points.\n💰 Your points: ${userPoints}\nRequired: ${totalCost} points`);
      }

      // Step 4: Deduct points and call n1panel API
      await userRef.update({ points: userPoints - totalCost });

      // Call n1panel API (Replace with actual API key & service ID)
      try {
        const orderRes = await axios.post('https://n1panel.com/api/v2', {
          key: 'YOUR_API_KEY',
          action: 'add',
          service: 'SERVICE_ID_FOR_REACTIONS',
          link: ctx.session.postLink,
          quantity: amount
        });

        const orderId = orderRes.data.order;
        ctx.reply(`✅ Reaction order placed!\n🆔 Order ID: ${orderId}\n🔗 Link: ${ctx.session.postLink}\n📦 Amount: ${amount} reactions`);

      } catch (err) {
        await userRef.update({ points: userPoints }); // Refund on error
        ctx.reply('❌ Failed to place reaction order. Please try again later.');
      }

      // Reset session
      ctx.session.awaiting = null;
      ctx.session.postLink = null;
    }
  });
};
