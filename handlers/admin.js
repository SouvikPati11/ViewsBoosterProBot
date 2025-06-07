const db = require('../firebase');
const { adminId } = require('../config');

module.exports = (bot) => {
  // Add Points
  bot.command('addpoints', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;

    const args = ctx.message.text.split(' ');
    const userId = args[1];
    const amount = parseInt(args[2]);

    if (!userId || isNaN(amount)) {
      return ctx.reply('Usage: /addpoints <user_id> <amount>');
    }

    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) return ctx.reply('❌ User not found.');

    const prev = doc.data().points || 0;
    await userRef.update({ points: prev + amount });
    ctx.reply(`✅ Added ${amount} points to user ${userId}`);
  });

  // Remove Points
  bot.command('removepoints', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;

    const args = ctx.message.text.split(' ');
    const userId = args[1];
    const amount = parseInt(args[2]);

    if (!userId || isNaN(amount)) {
      return ctx.reply('Usage: /removepoints <user_id> <amount>');
    }

    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();

    if (!doc.exists) return ctx.reply('❌ User not found.');

    const prev = doc.data().points || 0;
    await userRef.update({ points: Math.max(prev - amount, 0) });
    ctx.reply(`✅ Removed ${amount} points from user ${userId}`);
  });

  // User Info
  bot.command('userinfo', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;

    const args = ctx.message.text.split(' ');
    const userId = args[1];
    if (!userId) return ctx.reply('Usage: /userinfo <user_id>');

    const userRef = db.collection('users').doc(userId);
    const doc = await userRef.get();
    if (!doc.exists) return ctx.reply('❌ User not found.');

    const data = doc.data();
    ctx.replyWithMarkdown(`
📄 *User Info*

🆔 ID: \`${userId}\`
💰 Points: *${data.points || 0}*
👥 Referrals: *${data.referrals || 0}*
👁 Views Ordered: *${data.pointsSpentView || 0}*
👍 Reactions Ordered: *${Math.floor((data.pointsSpentReaction || 0) / 20)}*
    `);
  });

  // Broadcast Message
  bot.command('broadcast', async (ctx) => {
    if (ctx.from.id.toString() !== adminId) return;

    const message = ctx.message.text.split(' ').slice(1).join(' ');
    if (!message) return ctx.reply('Usage: /broadcast <message>');

    const users = await db.collection('users').get();
    let sent = 0;
    for (const doc of users.docs) {
      const userId = doc.id;
      try {
        await bot.telegram.sendMessage(userId, message);
        sent++;
      } catch (e) {
        console.log(`Failed to send to ${userId}`);
      }
    }

    ctx.reply(`📢 Broadcast sent to ${sent} users.`);
  });
};
