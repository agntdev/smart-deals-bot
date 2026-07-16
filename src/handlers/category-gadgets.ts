import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, paginate } from "../toolkit/index.js";
import type { Product } from "../data.js";

const composer = new Composer<Ctx>();

function emptyProducts(): Product[] { return []; }

composer.callbackQuery("category:gadgets", async (ctx) => {
  await ctx.answerCallbackQuery();
  const products = emptyProducts().filter((p) => p.active && p.category === "gadgets");
  if (products.length === 0) {
    await ctx.editMessageText("💻 No gadget deals right now — check back soon!", {
      reply_markup: inlineKeyboard([[inlineButton("⬅️ Back to menu", "menu:main")]]),
    });
    return;
  }
  const page = 0;
  const { pageItems, controls } = paginate(products, { page, perPage: 5, callbackPrefix: "cat:gadgets" });
  const lines = pageItems.map((p, i) => `${i + 1}. ${p.title} — $${p.discount_price} (was $${p.original_price})`);
  const keyboard = inlineKeyboard([
    ...pageItems.map((p) => [inlineButton(`${p.title}`, `product:${p.id}`)]),
    ...controls.inline_keyboard,
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ]);
  await ctx.editMessageText(`💻 Gadgets (${products.length})\n\n${lines.join("\n")}`, { reply_markup: keyboard });
});

composer.callbackQuery(/^cat:gadgets:(prev|next):(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const page = parseInt(ctx.match[2], 10);
  const products = emptyProducts().filter((p) => p.active && p.category === "gadgets");
  const { pageItems, controls } = paginate(products, { page, perPage: 5, callbackPrefix: "cat:gadgets" });
  const lines = pageItems.map((p, i) => `${i + 1}. ${p.title} — $${p.discount_price} (was $${p.original_price})`);
  const keyboard = inlineKeyboard([
    ...pageItems.map((p) => [inlineButton(`${p.title}`, `product:${p.id}`)]),
    ...controls.inline_keyboard,
    [inlineButton("⬅️ Back to menu", "menu:main")],
  ]);
  await ctx.editMessageText(`💻 Gadgets (${products.length})\n\n${lines.join("\n")}`, { reply_markup: keyboard });
});

export default composer;
