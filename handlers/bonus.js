const db = require('../firebase');

module.exports = (bot) => {
  bot.hears('🎉 Bonus', async (ctx) => {
    const userId = ctx.from.id.toString();
    const now = new Date();
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      await userRef.set({
        points: 0,
        referrals: 0,
        lastBonus: now,
      });
      await ctx.reply('🎉 You received your first 500 bonus points!');
      await userRef.update({ points: 500 });
      return;
    }

    const user = userDoc.data();
    const lastClaim = user.lastBonus ? user.lastBonus.toDate?.() || new Date(user.lastBonus) : null;

    const diff = lastClaim ? now - lastClaim : Infinity;
    const hours24 = 24 * 60 * 60 * 1000;

    if (diff >= hours24) {
      const newPoints = (user.points || 0) + 500;
      await userRef.update({
        points: newPoints,
        lastBonus: now,
      });
      await ctx.reply('🎉 Bonus claimed! You received 500 points.');
    } else {
      const remaining = hours24 - diff;
      const hrs = Math.floor(remaining / (1000 * 60 * 60));
      const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      await ctx.reply(`⏳ You've already claimed your bonus.\nCome back in ${hrs}h ${mins}m to claim again.`);
    }
  });
};
