import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
  watchlist: many(watchlist),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Platforms table (Instagram, Twitter, etc.)
export const platforms = pgTable("platforms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  iconClass: text("icon_class").notNull(),
  iconColor: text("icon_color").notNull(),
});

export const platformsRelations = relations(platforms, ({ many }) => ({
  profiles: many(profiles),
}));

export const insertPlatformSchema = createInsertSchema(platforms).pick({
  name: true,
  iconClass: true,
  iconColor: true,
});

// Categories table (Fashion, Tech, Food, etc.)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  profiles: many(profiles),
}));

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
});

// Profiles table
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  followers: integer("followers").notNull(),
  engagement: doublePrecision("engagement").notNull(), // percentage
  price: integer("price").notNull(), // in USD cents
  coverImageUrl: text("cover_image_url"),
  age: text("age").notNull(), // e.g., "2 years"
  weeklyPosts: text("weekly_posts").notNull(), // e.g., "5-7"
  isFeatured: boolean("is_featured").default(false).notNull(),
  isHot: boolean("is_hot").default(false).notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  platformId: integer("platform_id").notNull().references(() => platforms.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  platform: one(platforms, {
    fields: [profiles.platformId],
    references: [platforms.id],
  }),
  category: one(categories, {
    fields: [profiles.categoryId],
    references: [categories.id],
  }),
  watchlist: many(watchlist),
  messages: many(messages),
}));

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

// Watchlist table (saved profiles for later)
export const watchlist = pgTable("watchlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  profileId: integer("profile_id").notNull().references(() => profiles.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    userProfileIdx: uniqueIndex("user_profile_idx").on(table.userId, table.profileId),
  };
});

export const watchlistRelations = relations(watchlist, ({ one }) => ({
  user: one(users, {
    fields: [watchlist.userId],
    references: [users.id],
  }),
  profile: one(profiles, {
    fields: [watchlist.profileId],
    references: [profiles.id],
  }),
}));

export const insertWatchlistSchema = createInsertSchema(watchlist).omit({
  id: true,
  createdAt: true,
});

// Messages table (for contact seller functionality)
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  content: text("content").notNull(),
  fromUserId: integer("from_user_id").notNull().references(() => users.id),
  toUserId: integer("to_user_id").notNull().references(() => users.id),
  profileId: integer("profile_id").notNull().references(() => profiles.id),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.fromUserId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.toUserId],
    references: [users.id],
    relationName: "receiver",
  }),
  profile: one(profiles, {
    fields: [messages.profileId],
    references: [profiles.id],
  }),
}));

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPlatform = z.infer<typeof insertPlatformSchema>;
export type Platform = typeof platforms.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlist.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
