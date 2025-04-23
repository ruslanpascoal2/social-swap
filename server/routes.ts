import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { seedDatabase } from "./seed";
import { 
  insertProfileSchema, 
  insertWatchlistSchema, 
  insertMessageSchema,
  Profile,
  Platform,
  Category,
  profiles
} from "@shared/schema";
import { db } from "./db";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Initialize default data and seed the database
  await initializeData();
  await seedDatabase();
  
  // Recreate profiles if needed - update this to true to force regeneration
  const recreateProfiles = true;
  if (recreateProfiles) {
    try {
      // Delete existing profiles
      await db.delete(profiles);
      console.log("Deleted existing profiles for recreation");
      // Recreate profiles
      await seedDatabase();
    } catch (error) {
      console.error("Error recreating profiles:", error);
    }
  }

  // Platform routes
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = await storage.getAllPlatforms();
      res.json(platforms);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve platforms" });
    }
  });
  
  app.get("/api/platforms/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid platform ID" });
      }
      
      const allPlatforms = await storage.getAllPlatforms();
      const platform = allPlatforms.find(p => p.id === id);
      
      if (!platform) {
        return res.status(404).json({ message: "Platform not found" });
      }
      
      res.json(platform);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve platform" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve categories" });
    }
  });
  
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const allCategories = await storage.getAllCategories();
      const category = allCategories.find(c => c.id === id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve category" });
    }
  });

  // Profile routes
  app.get("/api/profiles", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve profiles" });
    }
  });

  app.get("/api/profiles/featured", async (req, res) => {
    try {
      const featuredProfiles = await storage.getFeaturedProfiles();
      res.json(featuredProfiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve featured profiles" });
    }
  });

  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      const profile = await storage.getProfileById(id);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve profile" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const newProfile = await storage.createProfile({
        ...validatedData,
        userId: req.user.id
      });
      res.status(201).json(newProfile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create profile" });
    }
  });

  // Watchlist routes
  app.get("/api/watchlist", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const watchlist = await storage.getUserWatchlist(req.user.id);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const validatedData = insertWatchlistSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const existing = await storage.getWatchlistItem(req.user.id, validatedData.profileId);
      if (existing) {
        return res.status(400).json({ message: "Profile already in watchlist" });
      }

      const newWatchlistItem = await storage.addToWatchlist(validatedData);
      res.status(201).json(newWatchlistItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid watchlist data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:profileId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const profileId = parseInt(req.params.profileId);
      if (isNaN(profileId)) {
        return res.status(400).json({ message: "Invalid profile ID" });
      }

      await storage.removeFromWatchlist(req.user.id, profileId);
      res.status(200).json({ message: "Removed from watchlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  // Message routes
  app.post("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const validatedData = insertMessageSchema.parse({
        ...req.body,
        fromUserId: req.user.id
      });
      
      const newMessage = await storage.createMessage(validatedData);
      res.status(201).json(newMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/messages", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const messages = await storage.getUserMessages(req.user.id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize default data for platforms and categories
async function initializeData() {
  // Create default platforms if they don't exist
  const platforms: { name: string, iconClass: string, iconColor: string }[] = [
    { name: "Instagram", iconClass: "ri-instagram-line", iconColor: "text-pink-500" },
    { name: "Twitter", iconClass: "ri-twitter-x-line", iconColor: "text-blue-400" },
    { name: "TikTok", iconClass: "ri-tiktok-line", iconColor: "text-white" },
    { name: "YouTube", iconClass: "ri-youtube-line", iconColor: "text-red-500" },
    { name: "Facebook", iconClass: "ri-facebook-circle-line", iconColor: "text-blue-500" },
    { name: "LinkedIn", iconClass: "ri-linkedin-box-line", iconColor: "text-blue-600" }
  ];

  for (const platform of platforms) {
    const existingPlatform = await storage.getPlatformByName(platform.name);
    if (!existingPlatform) {
      await storage.createPlatform(platform);
    }
  }

  // Create default categories if they don't exist
  const categories: { name: string }[] = [
    { name: "Fashion & Beauty" },
    { name: "Technology" },
    { name: "Food" },
    { name: "Fitness" },
    { name: "Travel" },
    { name: "Business" },
    { name: "Entertainment" },
    { name: "Gaming" },
    { name: "Photography" },
    { name: "Finance" },
    { name: "Lifestyle" },
    { name: "Recruitment" }
  ];

  for (const category of categories) {
    const existingCategory = await storage.getCategoryByName(category.name);
    if (!existingCategory) {
      await storage.createCategory(category);
    }
  }
}
