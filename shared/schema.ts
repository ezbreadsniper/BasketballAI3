import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role", { enum: ["player", "coach", "trainer", "parent", "admin"] }).notNull(),
  profileImage: text("profile_image"),
  fullName: text("full_name"),
  position: text("position"),
  team: text("team"),
});

export const insertUserSchema = createInsertSchema(users, {
  role: z.enum(["player", "coach", "trainer", "parent", "admin"]),
  email: z.string().email().optional(),
}).omit({
  id: true,
});

// Player Profile model
export const playerProfiles = pgTable("player_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  position: text("position").notNull(),
  height: integer("height"), // In centimeters
  weight: integer("weight"), // In kilograms
  age: integer("age"),
  teamId: integer("team_id"),
  attributes: jsonb("attributes").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPlayerProfileSchema = createInsertSchema(playerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Training Plan model
export const trainingPlans = pgTable("training_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  category: text("category").notNull(),
  duration: integer("duration").notNull(), // Minutes
  priority: text("priority", { enum: ["Low", "Medium", "High"] }).notNull(),
  exercises: jsonb("exercises").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrainingPlanSchema = createInsertSchema(trainingPlans).omit({
  id: true,
  createdAt: true,
});

// Training Resources model
export const trainingResources = pgTable("training_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  duration: integer("duration").notNull(), // Minutes
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTrainingResourceSchema = createInsertSchema(trainingResources).omit({
  id: true,
  createdAt: true,
});

// Activity Log model
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type", { enum: ["training", "assessment", "video", "other"] }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // Minutes
  points: integer("points"),
  result: jsonb("result"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
});

// Team model
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  coachId: integer("coach_id").notNull().references(() => users.id),
  description: text("description"),
  formation: jsonb("formation"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type PlayerProfile = typeof playerProfiles.$inferSelect;
export type InsertPlayerProfile = z.infer<typeof insertPlayerProfileSchema>;

export type TrainingPlan = typeof trainingPlans.$inferSelect;
export type InsertTrainingPlan = z.infer<typeof insertTrainingPlanSchema>;

export type TrainingResource = typeof trainingResources.$inferSelect;
export type InsertTrainingResource = z.infer<typeof insertTrainingResourceSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;
