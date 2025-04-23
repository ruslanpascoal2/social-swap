import { db } from "./db";
import { 
  users, platforms, categories, profiles,
  type InsertUser, type InsertPlatform, type InsertCategory, type InsertProfile
} from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedDatabase() {
  console.log("Seeding database...");
  
  // Check if we already have profiles
  const existingProfiles = await db.select().from(profiles);
  if (existingProfiles.length > 0) {
    console.log("Database already has profiles, skipping seed.");
    return;
  }
  
  // Check if we already have users to use
  const existingUsers = await db.select().from(users);
  let demoUserResult: typeof users.$inferSelect | undefined;
  let creatorUserResult: typeof users.$inferSelect | undefined;

  // Create or reuse seed users
  if (existingUsers.length > 0) {
    // Reuse existing users
    demoUserResult = existingUsers.find(u => u.username === "demo")!;
    creatorUserResult = existingUsers.find(u => u.username === "creator")!;
    
    if (!demoUserResult || !creatorUserResult) {
      console.log("Could not find required seed users, cannot create profiles");
      return;
    }
    
    console.log("Using existing users:", demoUserResult.id, creatorUserResult.id);
  } else {
    // Create new seed users
    const demoUser: InsertUser = {
      username: "demo",
      password: await hashPassword("password"),
      email: "demo@example.com",
      fullName: "Demo User"
    };

    const creatorUser: InsertUser = {
      username: "creator",
      password: await hashPassword("password"),
      email: "creator@example.com",
      fullName: "Content Creator"
    };

    [demoUserResult, creatorUserResult] = await db.insert(users)
      .values([demoUser, creatorUser])
      .returning();

    console.log("Created seed users:", demoUserResult.id, creatorUserResult.id);
  }

  // Get platform IDs from the database
  // The platforms are already added by the initializeData function
  const existingPlatforms = await db.select().from(platforms);
  console.log("Found existing platforms:", existingPlatforms.map(p => p.name).join(", "));
  
  // Instagram and YouTube platforms
  const instagramPlatform = existingPlatforms.find(p => p.name === "Instagram");
  const youtubePlatform = existingPlatforms.find(p => p.name === "YouTube");

  if (!instagramPlatform || !youtubePlatform) {
    console.log("Required platforms not found, cannot create profiles");
    return;
  }

  // Map category names to match those in initializeData
  const categoryMapping = {
    "Fashion": "Fashion & Beauty",
    "Tech": "Technology", 
    "Food": "Food"
  };
  
  const categoryEntities = [];

  for (const [categoryKey, categoryName] of Object.entries(categoryMapping)) {
    // Check if category exists
    const [existingCategory] = await db.select()
      .from(categories)
      .where(eq(categories.name, categoryName));
    
    if (existingCategory) {
      console.log(`Found category: ${existingCategory.name}`);
      categoryEntities.push(existingCategory);
    } else {
      console.log(`Category not found: ${categoryName}`);
      return; // Exit if categories aren't found
    }
  }

  console.log("Using categories:", categoryEntities.map(c => c.name).join(", "));

  // Create profiles
  const profilesData: InsertProfile[] = [
    {
      title: "Fashion Influencer Account",
      description: "Established fashion profile with active and engaged followers.",
      followers: 25000,
      engagement: 3.8,
      price: 2500_00, // $2,500
      age: "3 years",
      weeklyPosts: "4-6",
      userId: creatorUserResult.id,
      platformId: instagramPlatform.id,
      categoryId: categoryEntities[0].id, // Fashion
      isFeatured: true,
      isHot: true,
      coverImageUrl: null
    },
    {
      title: "Tech Review Channel",
      description: "Tech channel with product reviews and tech news.",
      followers: 50000,
      engagement: 4.2,
      price: 5000_00, // $5,000
      age: "2 years",
      weeklyPosts: "2-3",
      userId: creatorUserResult.id,
      platformId: youtubePlatform.id,
      categoryId: categoryEntities[1].id, // Tech
      isFeatured: true,
      isHot: false,
      coverImageUrl: null
    },
    {
      title: "Food Blogger Profile",
      description: "Food and recipe page with high-quality content.",
      followers: 15000,
      engagement: 5.1,
      price: 1800_00, // $1,800
      age: "1.5 years",
      weeklyPosts: "5-7",
      userId: creatorUserResult.id,
      platformId: instagramPlatform.id,
      categoryId: categoryEntities[2].id, // Food
      isFeatured: false,
      isHot: true,
      coverImageUrl: null
    }
  ];

  const profileResults = await db.insert(profiles)
    .values(profilesData)
    .returning();

  console.log("Created profiles:", profileResults.map(p => p.title).join(", "));
  
  console.log("Database seeded successfully!");
}