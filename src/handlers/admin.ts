import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard } from "../toolkit/index.js";

const OWNER_ID = parseInt(process.env.OWNER_ID ?? "0", 10);

const composer = new Composer<Ctx>();

composer.command("admin", async (ctx) => {
  if (!ctx.from || (OWNER_ID !== 0 && ctx.from.id !== OWNER_ID)) {
    await ctx.reply("⛔ Sorry, only the bot owner can access the admin panel.");
    return;
  }
  ctx.session.owner_id = ctx.from.id;
  await ctx.reply("🛠 Admin Panel\n\nWhat would you like to manage?", {
    reply_markup: inlineKeyboard([
      [inlineButton("➕ Add product", "admin:add")],
      [inlineButton("📋 View products", "admin:list")],
      [inlineButton("📊 Analytics", "admin:analytics")],
      [inlineButton("📣 Send broadcast", "admin:broadcast")],
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

composer.callbackQuery("admin:add", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (OWNER_ID !== 0 && ctx.from.id !== OWNER_ID) {
    await ctx.reply("⛔ Only the bot owner can do this.");
    return;
  }
  ctx.session.step = "admin_add_title";
  ctx.session.admin_product = {};
  await ctx.reply("➕ Let's add a new product.\n\nWhat's the product title?", {
    reply_markup: { force_reply: true, input_field_placeholder: "Product title…" },
  });
});

composer.callbackQuery("admin:list", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (OWNER_ID !== 0 && ctx.from.id !== OWNER_ID) {
    await ctx.reply("⛔ Only the bot owner can do this.");
    return;
  }
  const count = 0;
  if (count === 0) {
    await ctx.editMessageText("📋 No products yet.\n\nTap ➕ Add product to create one.", {
      reply_markup: inlineKeyboard([
        [inlineButton("➕ Add product", "admin:add")],
        [inlineButton("⬅️ Back", "admin:menu")],
      ]),
    });
    return;
  }
  await ctx.editMessageText(`📋 ${count} product(s) in the store.`, {
    reply_markup: inlineKeyboard([
      [inlineButton("⬅️ Back", "admin:menu")],
    ]),
  });
});

composer.callbackQuery("admin:analytics", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (OWNER_ID !== 0 && ctx.from.id !== OWNER_ID) {
    await ctx.reply("⛔ Only the bot owner can do this.");
    return;
  }
  await ctx.editMessageText("📊 Analytics\n\nNo click data yet. Analytics will appear once users start browsing deals.", {
    reply_markup: inlineKeyboard([
      [inlineButton("⬅️ Back", "admin:menu")],
    ]),
  });
});

composer.callbackQuery("admin:broadcast", async (ctx) => {
  await ctx.answerCallbackQuery();
  if (OWNER_ID !== 0 && ctx.from.id !== OWNER_ID) {
    await ctx.reply("⛔ Only the bot owner can do this.");
    return;
  }
  await ctx.editMessageText(
    "📣 Send a broadcast message to all users.\n\nType your broadcast message below.",
    {
      reply_markup: inlineKeyboard([
        [inlineButton("⬅️ Back", "admin:menu")],
      ]),
    },
  );
});

composer.callbackQuery("admin:menu", async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText("🛠 Admin Panel\n\nWhat would you like to manage?", {
    reply_markup: inlineKeyboard([
      [inlineButton("➕ Add product", "admin:add")],
      [inlineButton("📋 View products", "admin:list")],
      [inlineButton("📊 Analytics", "admin:analytics")],
      [inlineButton("📣 Send broadcast", "admin:broadcast")],
      [inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
