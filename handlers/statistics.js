const db = require('../firebase');

module.exports = (bot) => {
  bot.hears('🌐 Statistics', async (ctx) => {
    try {
      const usersSnapshot = await db.collection('users').get();
      const totalUsers = usersSnapshot.size;

      let totalViewsPoints = 0;
      let totalReactionsPoints = 0;

      usersSnapshot.forEach(doc => {
        const data = doc.data();
        totalViewsPoints += data.pointsSpentView || 0;
        totalReactionsPoints += data.pointsSpentReaction || 0;
      });

      const message = `
🌐 *Bot Statistics*

👥 Total Users: *${totalUsers}*

👁 Total Views Ordered: *${totalViewsPoints}*

👍 Total Reactions Ordered: *${Math.floor(totalReactionsPoints / 20)}*

💬 Keep boosting your posts! 🚀
      `;

      await ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      await ctx.reply('⚠️ Failed to load statistics. Please try again later.');
    }
  });
};
