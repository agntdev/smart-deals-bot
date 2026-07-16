import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, paginate } from "../toolkit/index.js";
import type { Product } from "../data.js";

const composer = new Composer<Ctx>();

function emptyProducts(): Product[] { return []; }

composer.command("favorites", async (ctx) => {
  const favIds: string[] = [];
  if (favIds.length === 0) {
    await ctx.reply("⭐ You haven't saved any favorites yet.\n\nBrowse deals and tap Save to add them here.", {
      reply_markup: inlineKeyboard([[inlineButton("🔥 Browse deals", "category:today")]]),
    });
    return;
  }
  const products = emptyProducts().filter((p) => favIds.includes(p.id));
  if (products.length === 0) {
    await ctx.reply("⭐ Some of your saved deals have expired.\n\nBrowse fresh deals below.", {
      reply_markup: inlineKeyboard([[inlineButton("🔥 Browse deals", "category:today")]]),
    });
    return;
  }
  const page = 0;
  const { pageItems, controls } = paginate(products, { page, perPage: 5, callbackPrefix: "fav:pg" });
  const lines = pageItems.map((p, i) => `${i + 1}. ${p.title} — $${p.discount_price}`);
  const keyboard = inlineKeyboard([
    ...pageItems.map((p) => [inlineButton(`${p.title}`, `product:${p.id}`)]),
    ...controls.inline_keyboard,
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ]);
  await ctx.reply(`⭐ Your Favorites (${products.length})\n\n${lines.join("\n")}`, {
    reply_markup: keyboard,
  });
});

export default composer;
