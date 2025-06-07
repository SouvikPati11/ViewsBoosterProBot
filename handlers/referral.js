const db = require('../firebase');

module.exports = (bot) => {
  // Handle referral on /start with referral ID
  bot.command('start', async (ctx) => {
    const userId = ctx.from.id.toString();
    const args = ctx.message.text.split(' ');

    const referredBy = args[1]; // Optional referral ID

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        points: 0,
        referrals: 0,
        joined: false,
        referredBy: referredBy || null,
      });

      if (referredBy) {
        const refUserRef = db.collection('users').doc(referredBy);
        const refDoc = await refUserRef.get();

        if (refDoc.exists) {
          const refData = refDoc.data();
          const newPoints = (refData.points || 0) + 1000;
          const newReferrals = (refData.referrals || 0) + 1;

          await refUserRef.update({
            points: newPoints,
            referrals: newReferrals,
          });
        }
      }
    }

    // Prompt to join channel
    await ctx.reply(`Welcome ${ctx.from.first_name}! 👋\nPlease join our channel @SocialBoosterSMH`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Join Channel', url: 'https://t.me/SocialBoosterSMH' }],
          [{ text: '✅ Joined', callback_data: 'joined' }],
        ],
      },
    });
  });

  // Show user's referral link
  bot.hears('👥 Referral', async (ctx) => {
    const userId = ctx.from.id.toString();
    const link = `https://t.me/${ctx.botInfo.username}?start=${userId}`;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const user = userDoc.data();

    await ctx.reply(
      `🔗 Your referral link:\n${link}\n\n👥 Total referrals: ${user?.referrals || 0}\n🎁 You earn 1000 points per referral!`
    );
  });
};
