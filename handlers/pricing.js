module.exports = (bot) => {
  bot.hears('💳 Pricing', async (ctx) => {
    const pricingMessage = `
💎 *Pricing* 💎

👉 Choose one of the views packages and pay using the methods below.

📦 *Packages:*
➊ 250,000 Points — *$5*  
➋ 500,000 Points — *$10*  
➌ 1,000,000 Points — *$20*  
➍ 1,500,000 Points — *$30*  
➎ 2,500,000 Points — *$50*  
➏ 5,000,000 Points — *$100*

💰 *Pay with Crypto (BTC, USDT, TRON, BUSD...):*
👉 @SocialMediaHikeOfficial

💳 *Pay with PayPal, Paytm, Payeer, etc.:*
👉 @SocialMediaHikeOfficial

🎁 *Bonus (Currently):*
Cryptocurrency: 0%  
Payeer & Perfect Money: 0%  
Other Methods: 0%
    `;

    await ctx.reply(pricingMessage, { parse_mode: 'Markdown' });
  });
};
