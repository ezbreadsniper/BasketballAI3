import { 
  users, type User, type InsertUser,
  playerProfiles, type PlayerProfile, type InsertPlayerProfile,
  trainingPlans, type TrainingPlan, type InsertTrainingPlan,
  trainingResources, type TrainingResource,
  activityLogs, type ActivityLog, type InsertActivityLog,
  teams, type Team, type InsertTeam
} from "@shared/schema";

// CRUD operations interface
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Player profile operations
  getPlayerProfile(userId: number): Promise<PlayerProfile | undefined>;
  createPlayerProfile(profile: InsertPlayerProfile): Promise<PlayerProfile>;
  updatePlayerProfile(id: number, profile: Partial<PlayerProfile>): Promise<PlayerProfile | undefined>;
  
  // Training plan operations
  getTrainingPlans(userId: number): Promise<TrainingPlan[]>;
  getTrainingPlan(id: number): Promise<TrainingPlan | undefined>;
  createTrainingPlan(plan: InsertTrainingPlan): Promise<TrainingPlan>;
  
  // Training resource operations
  getTrainingResources(limit?: number): Promise<TrainingResource[]>;
  getTrainingResource(id: number): Promise<TrainingResource | undefined>;
  
  // Activity logging
  logActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getRecentActivities(userId: number, limit?: number): Promise<ActivityLog[]>;
  
  // Team operations
  getTeam(id: number): Promise<Team | undefined>;
  getTeamByCoach(coachId: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  getTeamPlayers(teamId: number): Promise<User[]>;
  
  // Coach operations
  getPlayersByCoach(coachId: number): Promise<User[]>;
  
  // Dashboard data operations
  getPlayerDevelopmentSummary(userId: number): Promise<any>;
  getPlayerProfileOverview(userId: number): Promise<any>;
  getTrainingRecommendations(userId: number): Promise<any[]>;
  
  // Authentication
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private playerProfiles: Map<number, PlayerProfile>;
  private trainingPlans: Map<number, TrainingPlan>;
  private trainingResources: Map<number, TrainingResource>;
  private activityLogs: Map<number, ActivityLog>;
  private teams: Map<number, Team>;
  public sessionStore: session.Store;
  
  currentId: {
    users: number;
    playerProfiles: number;
    trainingPlans: number;
    trainingResources: number;
    activityLogs: number;
    teams: number;
  };

  constructor() {
    this.users = new Map();
    this.playerProfiles = new Map();
    this.trainingPlans = new Map();
    this.trainingResources = new Map();
    this.activityLogs = new Map();
    this.teams = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every day
    });
    
    this.currentId = {
      users: 1,
      playerProfiles: 1,
      trainingPlans: 1,
      trainingResources: 1,
      activityLogs: 1,
      teams: 1
    };
    
    // Initialize with mock data
    this.initializeMockData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { 
      ...insertUser, 
      id, 
      // Ensure all fields are initialized with proper values
      profileImage: insertUser.profileImage || null,
      fullName: insertUser.fullName || null,
      position: insertUser.position || null,
      team: insertUser.team || null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Player profile operations
  async getPlayerProfile(userId: number): Promise<PlayerProfile | undefined> {
    return Array.from(this.playerProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }
  
  async createPlayerProfile(profile: InsertPlayerProfile): Promise<PlayerProfile> {
    const id = this.currentId.playerProfiles++;
    const now = new Date();
    const playerProfile: PlayerProfile = { 
      ...profile, 
      id, 
      createdAt: now, 
      updatedAt: now, 
      // Ensure all fields are initialized with proper values
      height: profile.height || null,
      weight: profile.weight || null,
      age: profile.age || null,
      teamId: profile.teamId || null
    };
    this.playerProfiles.set(id, playerProfile);
    return playerProfile;
  }
  
  async updatePlayerProfile(id: number, updates: Partial<PlayerProfile>): Promise<PlayerProfile | undefined> {
    const profile = this.playerProfiles.get(id);
    if (!profile) return undefined;
    
    const updatedProfile = { 
      ...profile, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.playerProfiles.set(id, updatedProfile);
    return updatedProfile;
  }
  
  // Training plan operations
  async getTrainingPlans(userId: number): Promise<TrainingPlan[]> {
    return Array.from(this.trainingPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }
  
  async getTrainingPlan(id: number): Promise<TrainingPlan | undefined> {
    return this.trainingPlans.get(id);
  }
  
  async createTrainingPlan(plan: InsertTrainingPlan): Promise<TrainingPlan> {
    const id = this.currentId.trainingPlans++;
    const now = new Date();
    const trainingPlan: TrainingPlan = { 
      ...plan, 
      id, 
      createdAt: now 
    };
    this.trainingPlans.set(id, trainingPlan);
    return trainingPlan;
  }
  
  // Training resource operations
  async getTrainingResources(limit?: number): Promise<TrainingResource[]> {
    const resources = Array.from(this.trainingResources.values());
    return limit ? resources.slice(0, limit) : resources;
  }
  
  async getTrainingResource(id: number): Promise<TrainingResource | undefined> {
    return this.trainingResources.get(id);
  }
  
  // Activity logging
  async logActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentId.activityLogs++;
    const now = new Date();
    const activityLog: ActivityLog = { 
      ...activity, 
      id,
      // Ensure all fields are initialized with proper values
      description: activity.description || null,
      duration: activity.duration || null,
      points: activity.points || null,
      result: activity.result || {},
      timestamp: activity.timestamp || now
    };
    this.activityLogs.set(id, activityLog);
    return activityLog;
  }
  
  async getRecentActivities(userId: number, limit: number = 10): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  // Team operations
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async getTeamByCoach(coachId: number): Promise<Team | undefined> {
    return Array.from(this.teams.values()).find(
      team => team.coachId === coachId
    );
  }
  
  async getTeamPlayers(teamId: number): Promise<User[]> {
    const team = await this.getTeam(teamId);
    if (!team) return [];
    
    // Get all players with profiles that have this teamId
    const playerProfiles = Array.from(this.playerProfiles.values())
      .filter(profile => profile.teamId === teamId);
    
    // Get the corresponding users
    const playerUsers = playerProfiles.map(profile => 
      this.users.get(profile.userId)
    ).filter(Boolean) as User[];
    
    return playerUsers;
  }
  
  async getPlayersByCoach(coachId: number): Promise<User[]> {
    const team = await this.getTeamByCoach(coachId);
    if (!team) return [];
    
    return this.getTeamPlayers(team.id);
  }
  
  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.currentId.teams++;
    const now = new Date();
    const newTeam: Team = { 
      ...team, 
      id, 
      createdAt: now,
      // Ensure all fields are initialized with proper values
      description: team.description || null,
      formation: team.formation || {}
    };
    this.teams.set(id, newTeam);
    return newTeam;
  }
  
  // Dashboard data operations
  async getPlayerDevelopmentSummary(userId: number): Promise<any> {
    // In a real application, this would calculate metrics from various data points
    // For now, return mock data
    return [
      {
        label: "Overall Progress",
        value: "78%",
        change: "+3% this month",
        percentage: 78,
        icon: "arrowUp",
        color: "bg-primary"
      },
      {
        label: "Shooting Accuracy",
        value: "64%",
        change: "+5% this month",
        percentage: 64,
        icon: "arrowUp",
        color: "bg-secondary"
      },
      {
        label: "Vertical Jump",
        value: '28"',
        change: '+2" this month',
        percentage: 70,
        icon: "arrowUp",
        color: "bg-accent"
      }
    ];
  }
  
  async getPlayerProfileOverview(userId: number): Promise<any> {
    // In a real application, this would aggregate data from the player profile
    // For now, return mock data
    return {
      physicalMetrics: [
        { name: "Speed", value: 7.8, maxValue: 10 },
        { name: "Strength", value: 6.5, maxValue: 10 },
        { name: "Vertical", value: 7.0, maxValue: 10 },
        { name: "Agility", value: 8.2, maxValue: 10 },
        { name: "Endurance", value: 7.4, maxValue: 10 }
      ],
      basketballIQMetrics: [
        { name: "Court Vision", value: 8.0, maxValue: 10 },
        { name: "Decision Making", value: 7.2, maxValue: 10 },
        { name: "Defensive Reading", value: 6.8, maxValue: 10 },
        { name: "Tactical Awareness", value: 7.6, maxValue: 10 },
        { name: "Game Management", value: 7.5, maxValue: 10 }
      ],
      radarData: {
        playerSkills: [64, 75, 68, 71, 75, 78],
        positionAverage: [70, 65, 60, 65, 70, 75]
      }
    };
  }
  
  async getTrainingRecommendations(userId: number): Promise<any[]> {
    // In a real application, this would generate AI recommendations based on player profile
    // For now, return mock data
    return [
      {
        id: 1,
        title: "Focus on Shooting Mechanics",
        description: "Your shooting form shows inconsistency in release point. Focus on form shooting drills this week.",
        duration: "40 minutes daily",
        priority: "High",
        category: "shooting",
        icon: "clock"
      },
      {
        id: 2,
        title: "Ball Handling Improvement",
        description: "Your right-hand dominant dribbling pattern is predictable. Focus on weak-hand drills.",
        duration: "25 minutes daily",
        priority: "Medium",
        category: "dribbling",
        icon: "code"
      },
      {
        id: 3,
        title: "Vertical Jump Training",
        description: "Your explosive power metrics are improving. Continue plyometric training with progressive overload.",
        duration: "30 minutes, 3x weekly",
        priority: "Medium",
        category: "athletic",
        icon: "award"
      }
    ];
  }
  
  // Helper method to initialize mock data
  private initializeMockData() {
    // Add a mock user
    const mockUser: User = {
      id: this.currentId.users++,
      username: "marcusjohnson",
      password: "password123", // In a real app, this would be hashed
      name: "Marcus Johnson",
      email: "marcus@example.com",
      role: "player",
      profileImage: null,
      fullName: "Marcus Johnson",
      position: "SG",
      team: "Eastside Eagles"
    };
    this.users.set(mockUser.id, mockUser);
    
    // Add mock player profile
    const mockPlayerProfile: PlayerProfile = {
      id: this.currentId.playerProfiles++,
      userId: mockUser.id,
      position: "point-guard",
      height: 185,
      weight: 75,
      age: 16,
      teamId: 1,
      attributes: {
        shooting: 64,
        ballHandling: 68,
        passing: 75,
        defense: 71,
        basketballIQ: 75,
        athleticism: 78,
        speed: 78,
        strength: 65,
        vertical: 70,
        agility: 82,
        endurance: 74,
        courtVision: 80,
        decisionMaking: 72,
        defensiveReading: 68,
        tacticalAwareness: 76,
        gameManagement: 75
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.playerProfiles.set(mockPlayerProfile.id, mockPlayerProfile);
    
    // Add mock training resources
    const mockTrainingResources: TrainingResource[] = [
      {
        id: this.currentId.trainingResources++,
        title: "Free Throw Form Breakdown",
        description: "Pro coach analysis of proper free throw mechanics and consistent shooting form.",
        category: "Shooting",
        duration: 8,
        videoUrl: "https://example.com/videos/free-throw-breakdown",
        thumbnailUrl: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        createdAt: new Date()
      },
      {
        id: this.currentId.trainingResources++,
        title: "Advanced Dribbling Series",
        description: "Five-part training series focused on weak hand development and combo moves.",
        category: "Ball Handling",
        duration: 25,
        videoUrl: "https://example.com/videos/advanced-dribbling",
        thumbnailUrl: "https://images.unsplash.com/photo-1475403614135-5f1aa0eb5015?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        createdAt: new Date()
      },
      {
        id: this.currentId.trainingResources++,
        title: "Vertical Jump Training",
        description: "Progressive plyometric program to increase explosive power and vertical leap.",
        category: "Athletic Training",
        duration: 18,
        videoUrl: "https://example.com/videos/vertical-jump",
        thumbnailUrl: "https://images.unsplash.com/photo-1502014822147-1aedfb0676e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        createdAt: new Date()
      }
    ];
    
    mockTrainingResources.forEach(resource => {
      this.trainingResources.set(resource.id, resource);
    });
    
    // Add mock activity logs
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const mockActivityLogs: ActivityLog[] = [
      {
        id: this.currentId.activityLogs++,
        userId: mockUser.id,
        type: "training",
        title: "Shooting Form Workout",
        description: "Completed shooting form workout",
        duration: 45,
        points: 15,
        result: { accuracy: "78%" },
        timestamp: now
      },
      {
        id: this.currentId.activityLogs++,
        userId: mockUser.id,
        type: "video",
        title: "Free Throw Form Breakdown",
        description: "Watched video tutorial",
        duration: 8,
        points: 5,
        result: { completed: true },
        timestamp: yesterday
      },
      {
        id: this.currentId.activityLogs++,
        userId: mockUser.id,
        type: "assessment",
        title: "Vertical Jump Assessment",
        description: "Recorded new assessment",
        duration: 0,
        points: 0,
        result: { measurement: "28 inches" },
        timestamp: twoDaysAgo
      }
    ];
    
    mockActivityLogs.forEach(activity => {
      this.activityLogs.set(activity.id, activity);
    });
  }
}

export const storage = new MemStorage();
