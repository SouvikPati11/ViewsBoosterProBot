const db = require('../firebase');
const axios = require('axios');

module.exports = (bot) => {
  // Step 1: Ask for post link
  bot.hears('👁 View', async (ctx) => {
    ctx.session = ctx.session || {};
    ctx.session.awaiting = 'view_link';
    await ctx.reply('📥 Please send the Telegram post link:');
  });

  // Step 2: Handle Telegram link input
  bot.on('text', async (ctx) => {
    ctx.session = ctx.session || {};

    const userId = ctx.from.id.toString();

    // Check if awaiting link
    if (ctx.session.awaiting === 'view_link') {
      const link = ctx.message.text;

      if (!link.includes('t.me/')) {
        return ctx.reply('❌ Invalid Telegram post link. Please send a valid one.');
      }

      ctx.session.postLink = link;
      ctx.session.awaiting = 'view_amount';

      return ctx.reply('📊 How many views do you want? (Minimum: 50)');
    }

    // Step 3: Handle view count
    if (ctx.session.awaiting === 'view_amount') {
      const amount = parseInt(ctx.message.text);

      if (isNaN(amount) || amount < 50) {
        return ctx.reply('❌ Invalid amount. Minimum order is 50 views.');
      }

      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const user = userDoc.data();
      const userPoints = user?.points || 0;

      if (userPoints < amount) {
        return ctx.reply(`❌ You don't have enough points.\n💰 Your points: ${userPoints}\nPlease deposit to continue.`);
      }

      // Step 4: Deduct points and call n1panel API
      await userRef.update({ points: userPoints - amount });

      // Call n1panel API (Replace API_KEY and SERVICE_ID)
      try {
        const orderRes = await axios.post('https://n1panel.com/api/v2', {
          key: 'YOUR_API_KEY',
          action: 'add',
          service: 'SERVICE_ID_FOR_VIEWS',
          link: ctx.session.postLink,
          quantity: amount
        });

        const orderId = orderRes.data.order;
        ctx.reply(`✅ Order placed!\n🆔 Order ID: ${orderId}\n🔗 Link: ${ctx.session.postLink}\n📦 Amount: ${amount} views`);

      } catch (err) {
        await userRef.update({ points: userPoints }); // Refund points on failure
        ctx.reply('❌ Failed to place order. Please try again later.');
      }

      // Reset session
      ctx.session.awaiting = null;
      ctx.session.postLink = null;
    }
  });
};
