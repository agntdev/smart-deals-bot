export interface Product {
  id: string;
  title: string;
  image: string;
  original_price: number;
  discount_price: number;
  discount_percentage: number;
  short_description: string;
  category: string;
  affiliate_link: string;
  networks: string[];
  created_at: string;
  expires_at: string;
  active: boolean;
  price_history: number[];
}

export interface User {
  telegram_id: number;
  username: string;
  language: string;
  favorites: string[];
  subscriptions: string[];
  last_seen: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  ordering: number;
}

export interface ClickEvent {
  id: string;
  product_id: string;
  user_id: number;
  timestamp: string;
  source: string;
}

export interface ScheduledPost {
  id: string;
  product_id: string;
  post_time: string;
  posted: boolean;
}

export interface Broadcast {
  id: string;
  content: string;
  created_at: string;
  sent_count: number;
}

export interface CommissionRecord {
  product_id: string;
  clicks: number;
  attributed_sales: number;
  estimated_commission: number;
}
