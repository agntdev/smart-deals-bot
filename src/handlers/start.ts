import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { mainMenuKeyboard, registerMainMenuItem } from "../toolkit/index.js";

registerMainMenuItem({ label: "🔥 Today's Deals", data: "category:today", order: 10 });
registerMainMenuItem({ label: "📱 Electronics", data: "category:electronics", order: 20 });
registerMainMenuItem({ label: "👗 Fashion", data: "category:fashion", order: 30 });
registerMainMenuItem({ label: "💻 Gadgets", data: "category:gadgets", order: 40 });
registerMainMenuItem({ label: "🎁 Coupons", data: "category:coupons", order: 50 });
registerMainMenuItem({ label: "⭐ Best Sellers", data: "category:best_sellers", order: 60 });

const composer = new Composer<Ctx>();

const WELCOME = "👋 Welcome! Tap a button below to get started.";

composer.command("start", async (ctx) => {
  ctx.session.step = "idle";
  await ctx.reply(WELCOME, { reply_markup: mainMenuKeyboard() });
});

composer.callbackQuery("menu:main", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "idle";
  await ctx.editMessageText(WELCOME, { reply_markup: mainMenuKeyboard() });
});

export default composer;
