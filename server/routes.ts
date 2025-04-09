import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertPlayerProfileSchema, insertTrainingPlanSchema, insertActivityLogSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Error handling middleware
  const handleZodError = (err: ZodError) => {
    const errors = err.errors.map(e => `${e.path}: ${e.message}`).join(', ');
    return {
      message: `Validation error: ${errors}`
    };
  };

  // User routes
  app.get('/api/user/current', async (req, res) => {
    try {
      // For development purposes - return a mock user
      const mockUser = {
        id: 1,
        username: "marcusjohnson",
        name: "Marcus Johnson",
        email: "marcus@example.com",
        role: "player",
        profileImage: null
      };
      res.json(mockUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch current user" });
    }
  });

  app.post('/api/user', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(handleZodError(error));
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  // Player profile routes
  app.get('/api/player/profile', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const profile = await storage.getPlayerProfile(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch player profile" });
    }
  });

  app.post('/api/player/profile', async (req, res) => {
    try {
      const profileData = insertPlayerProfileSchema.parse(req.body);
      const profile = await storage.createPlayerProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(handleZodError(error));
      } else {
        res.status(500).json({ message: "Failed to create player profile" });
      }
    }
  });

  // Player development data endpoints
  app.get('/api/player/development-summary', async (req, res) => {
    try {
      const metrics = await storage.getPlayerDevelopmentSummary(1); // Hardcoded user ID for development
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch development summary" });
    }
  });

  app.get('/api/player/profile-overview', async (req, res) => {
    try {
      const overview = await storage.getPlayerProfileOverview(1); // Hardcoded user ID for development
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile overview" });
    }
  });

  app.get('/api/player/recent-activities', async (req, res) => {
    try {
      const activities = await storage.getRecentActivities(1); // Hardcoded user ID for development
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activities" });
    }
  });

  // Training-related routes
  app.get('/api/training/recommendations', async (req, res) => {
    try {
      const recommendations = await storage.getTrainingRecommendations(1); // Hardcoded user ID for development
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training recommendations" });
    }
  });

  app.get('/api/training/resources', async (req, res) => {
    try {
      const resources = await storage.getTrainingResources(3); // Get top 3 resources
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training resources" });
    }
  });

  app.get('/api/training/resources/all', async (req, res) => {
    try {
      const resources = await storage.getTrainingResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all training resources" });
    }
  });

  app.get('/api/training/plans', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string) || 1;
      const plans = await storage.getTrainingPlans(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training plans" });
    }
  });

  app.post('/api/training/plans', async (req, res) => {
    try {
      const planData = insertTrainingPlanSchema.parse(req.body);
      const plan = await storage.createTrainingPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(handleZodError(error));
      } else {
        res.status(500).json({ message: "Failed to create training plan" });
      }
    }
  });

  // Activity logging
  app.post('/api/activity', async (req, res) => {
    try {
      const activityData = insertActivityLogSchema.parse(req.body);
      const activity = await storage.logActivity(activityData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json(handleZodError(error));
      } else {
        res.status(500).json({ message: "Failed to log activity" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
