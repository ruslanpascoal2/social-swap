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

const MemoryStore = createMemoryStore(session);

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
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  // Maps to store data
  private usersMap: Map<number, User>;
  private platformsMap: Map<number, Platform>;
  private categoriesMap: Map<number, Category>;
  private profilesMap: Map<number, Profile>;
  private watchlistMap: Map<number, Watchlist>;
  private messagesMap: Map<number, Message>;
  
  // Auto-increment IDs
  private userNextId: number;
  private platformNextId: number;
  private categoryNextId: number;
  private profileNextId: number;
  private watchlistNextId: number;
  private messageNextId: number;
  
  // Session store
  sessionStore: session.SessionStore;

  constructor() {
    this.usersMap = new Map();
    this.platformsMap = new Map();
    this.categoriesMap = new Map();
    this.profilesMap = new Map();
    this.watchlistMap = new Map();
    this.messagesMap = new Map();
    
    this.userNextId = 1;
    this.platformNextId = 1;
    this.categoryNextId = 1;
    this.profileNextId = 1;
    this.watchlistNextId = 1;
    this.messageNextId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userNextId++;
    const createdAt = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt,
      avatarUrl: null 
    };
    
    this.usersMap.set(id, user);
    return user;
  }

  // Platform operations
  async getPlatformByName(name: string): Promise<Platform | undefined> {
    return Array.from(this.platformsMap.values()).find(
      (platform) => platform.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getAllPlatforms(): Promise<Platform[]> {
    return Array.from(this.platformsMap.values());
  }

  async createPlatform(insertPlatform: InsertPlatform): Promise<Platform> {
    const id = this.platformNextId++;
    const platform: Platform = { ...insertPlatform, id };
    
    this.platformsMap.set(id, platform);
    return platform;
  }

  // Category operations
  async getCategoryByName(name: string): Promise<Category | undefined> {
    return Array.from(this.categoriesMap.values()).find(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesMap.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryNextId++;
    const category: Category = { ...insertCategory, id };
    
    this.categoriesMap.set(id, category);
    return category;
  }

  // Profile operations
  async getProfileById(id: number): Promise<Profile | undefined> {
    return this.profilesMap.get(id);
  }

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profilesMap.values());
  }

  async getFeaturedProfiles(): Promise<Profile[]> {
    return Array.from(this.profilesMap.values()).filter(
      (profile) => profile.isFeatured
    );
  }

  async getProfilesByPlatform(platformId: number): Promise<Profile[]> {
    return Array.from(this.profilesMap.values()).filter(
      (profile) => profile.platformId === platformId
    );
  }

  async getProfilesByCategory(categoryId: number): Promise<Profile[]> {
    return Array.from(this.profilesMap.values()).filter(
      (profile) => profile.categoryId === categoryId
    );
  }

  async getUserProfiles(userId: number): Promise<Profile[]> {
    return Array.from(this.profilesMap.values()).filter(
      (profile) => profile.userId === userId
    );
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = this.profileNextId++;
    const createdAt = new Date();
    const profile: Profile = { 
      ...insertProfile, 
      id, 
      createdAt 
    };
    
    this.profilesMap.set(id, profile);
    return profile;
  }

  // Watchlist operations
  async getUserWatchlist(userId: number): Promise<Profile[]> {
    const watchlistItems = Array.from(this.watchlistMap.values()).filter(
      (item) => item.userId === userId
    );
    
    const profileIds = watchlistItems.map(item => item.profileId);
    return Array.from(this.profilesMap.values()).filter(
      (profile) => profileIds.includes(profile.id)
    );
  }

  async getWatchlistItem(userId: number, profileId: number): Promise<Watchlist | undefined> {
    return Array.from(this.watchlistMap.values()).find(
      (item) => item.userId === userId && item.profileId === profileId
    );
  }

  async addToWatchlist(insertWatchlist: InsertWatchlist): Promise<Watchlist> {
    const id = this.watchlistNextId++;
    const createdAt = new Date();
    const watchlistItem: Watchlist = { 
      ...insertWatchlist, 
      id, 
      createdAt 
    };
    
    this.watchlistMap.set(id, watchlistItem);
    return watchlistItem;
  }

  async removeFromWatchlist(userId: number, profileId: number): Promise<void> {
    const watchlistItem = await this.getWatchlistItem(userId, profileId);
    if (watchlistItem) {
      this.watchlistMap.delete(watchlistItem.id);
    }
  }

  // Message operations
  async getUserMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messagesMap.values()).filter(
      (message) => message.toUserId === userId || message.fromUserId === userId
    );
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageNextId++;
    const createdAt = new Date();
    const message: Message = { 
      ...insertMessage, 
      id, 
      read: false, 
      createdAt 
    };
    
    this.messagesMap.set(id, message);
    return message;
  }
}

export const storage = new MemStorage();
