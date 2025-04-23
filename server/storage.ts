import { 
  users, type User, type InsertUser,
  platforms, type Platform, type InsertPlatform,
  categories, type Category, type InsertCategory,
  profiles, type Profile, type InsertProfile,
  watchlist, type Watchlist, type InsertWatchlist,
  messages, type Message, type InsertMessage 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db } from "./db";
import { pool } from "./db";
import { eq, and, desc, inArray, or } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Platform operations
  getPlatformByName(name: string): Promise<Platform | undefined>;
  getAllPlatforms(): Promise<Platform[]>;
  createPlatform(platform: InsertPlatform): Promise<Platform>;
  
  // Category operations
  getCategoryByName(name: string): Promise<Category | undefined>;
  getAllCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Profile operations
  getProfileById(id: number): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;
  getFeaturedProfiles(): Promise<Profile[]>;
  getProfilesByPlatform(platformId: number): Promise<Profile[]>;
  getProfilesByCategory(categoryId: number): Promise<Profile[]>;
  getUserProfiles(userId: number): Promise<Profile[]>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  
  // Watchlist operations
  getUserWatchlist(userId: number): Promise<Profile[]>;
  getWatchlistItem(userId: number, profileId: number): Promise<Watchlist | undefined>;
  addToWatchlist(watchlistItem: InsertWatchlist): Promise<Watchlist>;
  removeFromWatchlist(userId: number, profileId: number): Promise<void>;
  
  // Message operations
  getUserMessages(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Session store
  sessionStore: any; // Use any type for session store to avoid complex type issues
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Platform operations
  async getPlatformByName(name: string): Promise<Platform | undefined> {
    const [platform] = await db.select().from(platforms).where(eq(platforms.name, name));
    return platform;
  }

  async getAllPlatforms(): Promise<Platform[]> {
    return await db.select().from(platforms);
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const [platform] = await db.insert(platforms).values(insertPlatform).returning();
    return platform;
  }

  // Category operations
  async getCategoryByName(name: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.name, name));
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Profile operations
  async getProfileById(id: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getAllProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles);
  }

  async getFeaturedProfiles(): Promise<Profile[]> {
    return await db.select().from(profiles).where(eq(profiles.isFeatured, true));
  }

  async getProfilesByPlatform(platformId: number): Promise<Profile[]> {
    return await db.select().from(profiles).where(eq(profiles.platformId, platformId));
  }

  async getProfilesByCategory(categoryId: number): Promise<Profile[]> {
    return await db.select().from(profiles).where(eq(profiles.categoryId, categoryId));
  }

  async getUserProfiles(userId: number): Promise<Profile[]> {
    return await db.select().from(profiles).where(eq(profiles.userId, userId));
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const [profile] = await db.insert(profiles).values(insertProfile).returning();
    return profile;
  }

  // Watchlist operations
  async getUserWatchlist(userId: number): Promise<Profile[]> {
    // First get all watchlist items for the user
    const watchlistItems = await db.select().from(watchlist).where(eq(watchlist.userId, userId));
    
    // Then fetch all the profiles from the watchlist
    if (watchlistItems.length === 0) return [];
    
    const profileIds = watchlistItems.map(item => item.profileId);
    const watchlistProfiles = await db.select()
      .from(profiles)
      .where(inArray(profiles.id, profileIds));
      
    return watchlistProfiles;
  }

  async getWatchlistItem(userId: number, profileId: number): Promise<Watchlist | undefined> {
    const [item] = await db.select()
      .from(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.profileId, profileId)
      ));
    
    return item;
  }

  async addToWatchlist(insertWatchlist: InsertWatchlist): Promise<Watchlist> {
    const [item] = await db.insert(watchlist)
      .values(insertWatchlist)
      .returning();
    
    return item;
  }

  async removeFromWatchlist(userId: number, profileId: number): Promise<void> {
    await db.delete(watchlist)
      .where(and(
        eq(watchlist.userId, userId),
        eq(watchlist.profileId, profileId)
      ));
  }

  // Message operations
  async getUserMessages(userId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(
        or(
          eq(messages.fromUserId, userId),
          eq(messages.toUserId, userId)
        )
      )
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages)
      .values(insertMessage)
      .returning();
    
    return message;
  }
}

// Use DatabaseStorage
export const storage = new DatabaseStorage();
