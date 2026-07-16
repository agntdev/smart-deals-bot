import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, paginate } from "../toolkit/index.js";
import type { Product } from "../data.js";

const composer = new Composer<Ctx>();

function emptyProducts(): Product[] { return []; }

composer.command("search", async (ctx) => {
  ctx.session.step = "search_query";
  await ctx.reply("🔍 What are you looking for? Type a product name or keyword.", {
    reply_markup: { force_reply: true, input_field_placeholder: "Search products…" },
  });
});

composer.on("message:text", async (ctx, next) => {
  if (ctx.session.step !== "search_query") {
    return next();
  }
  const query = ctx.message.text.trim().toLowerCase();
  ctx.session.step = "idle";
  if (!query) {
    await ctx.reply("Please type something to search for.", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  const products = emptyProducts().filter(
    (p) =>
      p.active &&
      (p.title.toLowerCase().includes(query) ||
        p.short_description.toLowerCase().includes(query)),
  );
  if (products.length === 0) {
    await ctx.reply(`No products found for "${query}". Try a different keyword.`, {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  const page = 0;
  const { pageItems, controls } = paginate(products, { page, perPage: 5, callbackPrefix: "search:pg" });
  const lines = pageItems.map((p, i) => `${i + 1}. ${p.title} — $${p.discount_price}`);
  const keyboard = inlineKeyboard([
    ...pageItems.map((p) => [inlineButton(`${p.title}`, `product:${p.id}`)]),
    ...controls.inline_keyboard,
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ]);
  await ctx.reply(`🔍 ${products.length} result(s) for "${query}"\n\n${lines.join("\n")}`, {
    reply_markup: keyboard,
  });
});

export default composer;
