# Smart Deals Bot — Bot specification

**Archetype:** commerce

**Voice:** friendly and helpful — write every user-facing message, button label, error, and empty state in this voice.

A Telegram commerce bot that curates and delivers affiliate deals, lets the owner manage products and schedule posts, and tracks click/commission performance. Focuses on mobile-friendly deal discovery, price alerts, and automated posting.

> This is the complete contract for the bot. Implement EVERY entry point, flow, feature, integration, and edge case below. The completeness review checks the bot against this document after each build pass.

## Primary audience

- Bargain hunters
- Online shoppers
- Telegram users
- Single owner/operator

## Success criteria

- Users can discover and save deals through categories and search
- Owner can manage products, schedule posts, and track performance
- Automated hourly posts and price-drop alerts function reliably

## Entry points

Every feature must be reachable from the bot's command/button surface (button-first; only /start and /help are slash commands).

- **/start** (command, actor: user, command: /start) — Open the main menu with featured deals and categories
- **🔥 Today's Deals** (button, actor: user, callback: category:today) — Show featured deals of the day
- **📱 Electronics** (button, actor: user, callback: category:electronics) — Browse electronics deals
- **裾 Fashion** (button, actor: user, callback: category:fashion) — Browse fashion deals
- **💻 Gadgets** (button, actor: user, callback: category:gadgets) — Browse gadget deals
- **🎁 Coupons** (button, actor: user, callback: category:coupons) — Browse coupon deals
- **⭐ Best Sellers** (button, actor: user, callback: category:best_sellers) — Browse best-selling deals
- **/search** (command, actor: user, command: /search) — Search for products by title or description
- **/favorites** (command, actor: user, command: /favorites) — View saved favorite deals
- **Notify Price Drop** (button, actor: user, callback: subscribe:price_drop) — Subscribe to price drop notifications for a product
- **/admin** (command, actor: owner, command: /admin) — Open admin panel for owner to manage products and settings

## Flows

### Product browsing
_Trigger:_ category:today

1. Show paginated list of products in Today's Deals
2. Display product details when selected
3. Option to save to favorites or set price alert

_Data touched:_ Product, Category, User

### Product search
_Trigger:_ /search

1. Prompt user for search query
2. Display matching products
3. Allow pagination through results

_Data touched:_ Product, User

### Price drop subscription
_Trigger:_ subscribe:price_drop

1. Confirm subscription to price drop alerts
2. Store subscription in database
3. Notify user when price drops

_Data touched:_ User, Product

### Admin product management
_Trigger:_ /admin

1. Verify owner identity
2. Show admin menu with product management options
3. Add/edit/delete products
4. Schedule posts
5. View analytics

_Data touched:_ Product, Category, ScheduledPost, ClickEvent

### Auto-posting
_Trigger:_ hourly_schedule

1. Check for eligible active deals
2. Select up to 3 deals to post
3. Publish to public channel
4. Mark as posted

_Data touched:_ Product, ScheduledPost, Broadcast

### Daily top deals
_Trigger:_ daily_schedule

1. Aggregate top-clicked or highest-discount deals
2. Compose broadcast message
3. Send to all users or selected segments

_Data touched:_ Product, ClickEvent, Broadcast

## Data entities

Durable data (must survive a restart) uses the toolkit's persistent store, never in-memory maps.

- **Product** _(retention: persistent)_ — Affiliate product with pricing, description, and affiliate links
  - fields: id, title, image, original_price, discount_price, discount_percentage, short_description, category, affiliate_link, networks, created_at, expires_at, active, price_history
- **Category** _(retention: persistent)_ — Deal category with emoji and ordering
  - fields: id, name, emoji, ordering
- **User** _(retention: persistent)_ — Telegram user with preferences and subscriptions
  - fields: telegram_id, username, language, favorites, subscriptions, last_seen
- **ClickEvent** _(retention: persistent)_ — Record of a product click through the bot
  - fields: id, product_id, user_id, timestamp, source
- **ScheduledPost** _(retention: persistent)_ — Scheduled deal posting
  - fields: id, product_id, post_time, posted
- **Broadcast** _(retention: persistent)_ — Broadcast message to users
  - fields: id, content, created_at, sent_count
- **CommissionRecord** _(retention: persistent)_ — Owner-entered commission tracking (optional)
  - fields: product_id, clicks, attributed_sales, estimated_commission

## Integrations

- **Telegram** (required) — Bot API messaging and user interface
- **Affiliate links** (required) — Redirect users to affiliate networks
Call external APIs against their real contract (correct endpoints, ids, params); credentials from env. Do not fake responses.

## Owner controls

- Add/edit/delete products
- Schedule posts
- Configure auto-post settings
- Send broadcasts
- View analytics
- Manage categories
- Update price history
- Input commission data

## Notifications

- Price drop alerts to users
- Daily top deals broadcast
- Auto-post notifications
- Admin alerts for scheduled failures
- Click statistics summary
- Commission dashboard updates

## Permissions & privacy

- Only owner can access admin functions
- User data is stored securely
- Click tracking is optional and anonymized
- Price alerts are opt-in

## Edge cases

- Expired products in favorites
- Price drops below zero
- Scheduled posts during maintenance
- Duplicate product entries
- Invalid affiliate links
- Users unsubscribing from alerts

## Required tests

- End-to-end product browsing flow
- Admin product management workflow
- Auto-posting at scheduled times
- Price alert notifications
- Click tracking and analytics
- Broadcast message delivery
- User favorites management

## Assumptions

- Owner account is a single Telegram user ID
- Auto-posts go to a public channel by default
- Click tracking uses bot redirects
- Price changes are manually updated by owner
- Database is relational (PostgreSQL or SQLite)
