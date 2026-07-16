import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const composer = new Composer<Ctx>();

composer.callbackQuery("subscribe:price_drop", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    "🔔 Price drop notifications\n\nPick a product first, then tap \"Notify me\" on its page to get alerted when the price drops.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("🔥 Browse deals", "category:today")],
        [inlineButton("⬅️ Back to menu", "menu:main")],
      ]),
    },
  );
});

export default composer;
