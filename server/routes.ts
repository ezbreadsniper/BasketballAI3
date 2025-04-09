import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertPlayerProfileSchema, insertTrainingPlanSchema, insertActivityLogSchema, User } from "@shared/schema";
import { ZodError } from "zod";
import { setupAuth } from "./auth";

// Type augmentation for Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Define an authenticated request type for type safety
interface AuthenticatedRequest extends Request {
  user: User; // user is guaranteed to exist in authenticated requests
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);
  
  // Error handling middleware
  const handleZodError = (err: ZodError) => {
    const errors = err.errors.map(e => `${e.path}: ${e.message}`).join(', ');
    return {
      message: `Validation error: ${errors}`
    };
  };
  
  // Authentication check middleware
  const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user) {
      return next();
    }
    res.status(401).json({ message: "Not authenticated" });
  };
  
  // Role check middleware
  const ensureRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (req.isAuthenticated() && req.user && req.user.role === role) {
        return next();
      }
      res.status(403).json({ message: "Access denied" });
    };
  };

  // User routes
  app.get('/api/user/current', ensureAuthenticated, async (req: Request, res) => {
    try {
      // We've already checked req.user exists in ensureAuthenticated
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const { password, ...userWithoutPassword } = req.user;
      return res.json(userWithoutPassword);
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
  app.get('/api/player/development-summary', ensureAuthenticated, async (req, res) => {
    try {
      const metrics = await storage.getPlayerDevelopmentSummary(req.user!.id);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch development summary" });
    }
  });

  app.get('/api/player/profile-overview', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const overview = await storage.getPlayerProfileOverview(userId);
      res.json(overview);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile overview" });
    }
  });

  app.get('/api/player/recent-activities', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const activities = await storage.getRecentActivities(userId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activities" });
    }
  });

  // Training-related routes
  app.get('/api/training/recommendations', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const recommendations = await storage.getTrainingRecommendations(userId);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training recommendations" });
    }
  });

  app.get('/api/training/resources', ensureAuthenticated, async (req, res) => {
    try {
      const resources = await storage.getTrainingResources(3); // Get top 3 resources
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training resources" });
    }
  });

  app.get('/api/training/resources/all', ensureAuthenticated, async (req, res) => {
    try {
      const resources = await storage.getTrainingResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all training resources" });
    }
  });

  app.get('/api/training/plans', ensureAuthenticated, async (req, res) => {
    try {
      // Use the authenticated user's ID if no specific user ID is provided
      const userId = parseInt(req.query.userId as string) || req.user!.id;
      const plans = await storage.getTrainingPlans(userId);
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch training plans" });
    }
  });

  app.post('/api/training/plans', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const planData = insertTrainingPlanSchema.parse({
        ...req.body,
        userId // Ensure the plan is associated with the authenticated user
      });
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
  app.post('/api/activity', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const activityData = insertActivityLogSchema.parse({
        ...req.body,
        userId // Ensure the activity is associated with the authenticated user
      });
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
