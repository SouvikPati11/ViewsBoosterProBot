const { Markup } = require('telegraf');

module.exports = (bot) => {
  bot.start(async (ctx) => {
    const userId = ctx.from.id.toString();

    // Add user to Firebase if not exists
    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) {
      await userRef.set({ points: 0, referrals: 0, joined: false });
    }

    await ctx.reply(`Welcome ${ctx.from.first_name}! 👋\nPlease join our channel @SocialBoosterSMH`, Markup.inlineKeyboard([
      Markup.button.url('Join Channel', 'https://t.me/SocialBoosterSMH'),
      Markup.button.callback('✅ Joined', 'joined')
    ]));
  });

  bot.action('joined', async (ctx) => {
    const userId = ctx.from.id.toString();
    await db.collection('users').doc(userId).update({ joined: true });

    await ctx.reply('🎉 Main Menu', Markup.keyboard([
      ['👁 View', '👍 Reaction'],
      ['👥 Referral', '👤 Account'],
      ['💳 Pricing', '📜 Help'],
      ['🎉 Bonus', '🌐 Statistics']
    ]).resize());
  });
};
