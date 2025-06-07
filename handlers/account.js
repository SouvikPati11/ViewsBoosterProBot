const db = require('../firebase');

module.exports = (bot) => {
  bot.hears('👤 Account', async (ctx) => {
    const userId = ctx.from.id.toString();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        points: 0,
        referrals: 0,
        joined: false,
      });
    }

    const user = userDoc.data();

    await ctx.reply(
      `👤 *Your Account Info*\n\n🆔 User ID: \`${userId}\`\n💰 Points: *${user.points || 0}*\n👥 Referrals: *${user.referrals || 0}*`,
      {
        parse_mode: 'Markdown',
      }
    );
  });
};
