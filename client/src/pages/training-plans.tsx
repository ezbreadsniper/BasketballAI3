import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Calendar, 
  Dumbbell, 
  Users, 
  BarChart2, 
  Search, 
  Filter, 
  PlusCircle, 
  CalendarDays,
  Clock,
  Target,
  Trophy,
  BarChart3,
  ArrowUpRight,
  TrendingUp
} from "lucide-react";
import { useState } from "react";

import TrainingPlanGenerator from "@/components/training/TrainingPlanGenerator";
import { PlayerAttributes, Position } from "../lib/attributeSystem";

// Mock player data for demonstration
const mockPlayerData = {
  id: 1,
  name: "Marcus Johnson",
  position: "SG" as Position,
  age: 18,
  height: "6'4\"",
  weight: "195 lbs",
  team: "Eastside Eagles",
  level: "High School Varsity",
  attributes: {
    // Physical Attributes
    height: { value: 14, potential: 14 },
    weight: { value: 13, potential: 14 },
    wingspan: { value: 15, potential: 15 },
    speed: { value: 16, potential: 17 },
    acceleration: { value: 15, potential: 17 },
    agility: { value: 14, potential: 16 },
    verticalJump: { value: 13, potential: 15 },
    strength: { value: 10, potential: 14 },
    
    // Technical Attributes
    shooting: { value: 12, potential: 16 },
    freeThrows: { value: 13, potential: 17 },
    ballHandling: { value: 14, potential: 16 },
    passing: { value: 11, potential: 14 },
    finishing: { value: 13, potential: 15 },
    postMoves: { value: 7, potential: 9 },
    offBallMovement: { value: 12, potential: 15 },
    
    // Defensive Attributes
    perimeterDefense: { value: 13, potential: 15 },
    interiorDefense: { value: 8, potential: 10 },
    helpDefense: { value: 11, potential: 13 },
    rebounding: { value: 10, potential: 12 },
    shotBlocking: { value: 8, potential: 10 },
    stealing: { value: 12, potential: 14 },
    
    // Mental/Cognitive Attributes
    basketballIQ: { value: 13, potential: 16 },
    decisionMaking: { value: 12, potential: 15 },
    leadership: { value: 11, potential: 14 },
    composure: { value: 13, potential: 15 },
    workEthic: { value: 16, potential: 17 },
    coachability: { value: 15, potential: 16 },
  } as PlayerAttributes,
  lastAssessment: "March 15, 2025",
  coach: "Coach Williams",
};

export default function TrainingPlans() {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch actual plans data
  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/training/plans'],
  });
  
  // Status badges styling
  const statusBadgeClasses = {
    'Active': 'bg-green-500 bg-opacity-20 text-green-500',
    'Upcoming': 'bg-blue-500 bg-opacity-20 text-blue-500',
    'Completed': 'bg-neutral-500 bg-opacity-20 text-neutral-400'
  };
  
  if (isLoading) {
    return (
      <div className="py-4 px-3 sm:px-4 lg:px-6 bg-neutral-900 text-neutral-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-neutral-800">
          <div>
            <Skeleton className="h-4 w-32 mb-1 bg-neutral-800" />
            <Skeleton className="h-6 w-48 bg-neutral-800" />
          </div>
          <Skeleton className="h-9 w-40 mt-4 md:mt-0 bg-neutral-800" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full bg-neutral-800 mb-4" />
            <Skeleton className="h-64 w-full bg-neutral-800" />
          </div>
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full bg-neutral-800" />
          </div>
        </div>
      </div>
    );
  }
  
  // Define the type for training plans
  interface TrainingPlan {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    focus: string;
    status: 'Active' | 'Upcoming' | 'Completed';
    progress: number;
    createdAt: string;
  }
  
  // Training plans data - use fetched data if available, otherwise use mock
  const mockTrainingPlans: TrainingPlan[] = [
    { 
      id: 1, 
      title: "Off-Season Skill Development", 
      startDate: "April 10, 2025", 
      endDate: "May 15, 2025",
      focus: "Shooting & Ball Handling",
      status: "Active",
      progress: 25,
      createdAt: "April 5, 2025"
    },
    { 
      id: 2, 
      title: "Pre-Season Conditioning", 
      startDate: "May 20, 2025", 
      endDate: "June 25, 2025",
      focus: "Strength & Conditioning",
      status: "Upcoming",
      progress: 0,
      createdAt: "April 1, 2025"
    },
    { 
      id: 3, 
      title: "Summer League Preparation", 
      startDate: "July 1, 2025", 
      endDate: "July 30, 2025",
      focus: "Game Situations & Team Play",
      status: "Upcoming",
      progress: 0,
      createdAt: "March 25, 2025"
    },
    { 
      id: 4, 
      title: "Shooting Mechanics Rebuild", 
      startDate: "February 15, 2025", 
      endDate: "March 30, 2025",
      focus: "Shooting Form & Free Throws",
      status: "Completed",
      progress: 100,
      createdAt: "February 10, 2025"
    }
  ];
  
  // Use fetched data if available, otherwise use mock data
  const trainingPlans: TrainingPlan[] = (plans as TrainingPlan[]) || mockTrainingPlans;
  
  // Filter plans based on active tab and search query
  const filteredPlans = trainingPlans.filter((plan: TrainingPlan) => {
    // Filter by tab first
    if (activeTab === 'active' && plan.status !== 'Active') return false;
    if (activeTab === 'upcoming' && plan.status !== 'Upcoming') return false;
    if (activeTab === 'completed' && plan.status !== 'Completed') return false;
    
    // Then filter by search query
    if (searchQuery && !plan.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });
  
  return (
    <div className="py-4 px-3 sm:px-4 lg:px-6 bg-neutral-900 text-neutral-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="text-sm text-neutral-400">April 9, 2025</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100">Training Plans</h1>
        </div>
        <div className="flex mt-4 md:mt-0">
          <Button className="slick-btn">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Training plans list */}
        <div className="lg:col-span-1">
          <Card className="bg-neutral-800 border-neutral-700 mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">My Training Plans</CardTitle>
              <CardDescription className="text-neutral-400">
                View and manage your training schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="relative mb-4">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <Input 
                  placeholder="Search plans..." 
                  className="pl-8 bg-neutral-750 border-neutral-700 text-neutral-200 focus-visible:ring-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="bg-neutral-750 p-0.5 h-auto mb-4 grid grid-cols-3 w-full">
                  <TabsTrigger 
                    value="active" 
                    className="text-xs py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Active
                  </TabsTrigger>
                  <TabsTrigger 
                    value="upcoming" 
                    className="text-xs py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed" 
                    className="text-xs py-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    Completed
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="m-0 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan: TrainingPlan) => (
                      <div key={plan.id} className="bg-neutral-750 border border-neutral-700 rounded-md p-3 hover:border-neutral-600 cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-medium text-white">{plan.title}</h3>
                          <div className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadgeClasses[plan.status as keyof typeof statusBadgeClasses]}`}>
                            {plan.status}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-[10px] text-neutral-500 mb-2">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>{plan.startDate} - {plan.endDate}</span>
                        </div>
                        
                        <div className="flex items-center text-[10px] text-neutral-500 mb-3">
                          <Target className="h-3 w-3 mr-1" />
                          <span>Focus: {plan.focus}</span>
                        </div>
                        
                        <div className="w-full bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full transition-all duration-300 ease-in-out"
                            style={{ width: `${plan.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-neutral-500">Progress</span>
                          <span className="text-[10px] font-medium text-neutral-300">{plan.progress}%</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-neutral-750 border border-neutral-700 rounded-md p-4 text-center">
                      <p className="text-sm text-neutral-400">No {activeTab} plans found</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="upcoming" className="m-0 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan: TrainingPlan) => (
                      <div key={plan.id} className="bg-neutral-750 border border-neutral-700 rounded-md p-3 hover:border-neutral-600 cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-medium text-white">{plan.title}</h3>
                          <div className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadgeClasses[plan.status as keyof typeof statusBadgeClasses]}`}>
                            {plan.status}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-[10px] text-neutral-500 mb-2">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>{plan.startDate} - {plan.endDate}</span>
                        </div>
                        
                        <div className="flex items-center text-[10px] text-neutral-500">
                          <Target className="h-3 w-3 mr-1" />
                          <span>Focus: {plan.focus}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-neutral-750 border border-neutral-700 rounded-md p-4 text-center">
                      <p className="text-sm text-neutral-400">No {activeTab} plans found</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="m-0 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {filteredPlans.length > 0 ? (
                    filteredPlans.map((plan: TrainingPlan) => (
                      <div key={plan.id} className="bg-neutral-750 border border-neutral-700 rounded-md p-3 hover:border-neutral-600 cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-sm font-medium text-white">{plan.title}</h3>
                          <div className={`text-[10px] px-2 py-0.5 rounded-full ${statusBadgeClasses[plan.status as keyof typeof statusBadgeClasses]}`}>
                            {plan.status}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-[10px] text-neutral-500 mb-2">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>{plan.startDate} - {plan.endDate}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center text-[10px] text-neutral-500">
                            <Target className="h-3 w-3 mr-1" />
                            <span>Focus: {plan.focus}</span>
                          </div>
                          
                          <div className="flex items-center text-[10px] text-green-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            <span>Completed</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-neutral-750 border border-neutral-700 rounded-md p-4 text-center">
                      <p className="text-sm text-neutral-400">No {activeTab} plans found</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">Progress Insights</CardTitle>
              <CardDescription className="text-neutral-400">
                Training and development analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                  <h3 className="text-xs font-medium text-white mb-2">Weekly Training Stats</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-neutral-800 p-2 rounded text-center">
                      <div className="text-lg font-bold text-white">4.5</div>
                      <div className="text-[10px] text-neutral-500">Hours</div>
                    </div>
                    <div className="bg-neutral-800 p-2 rounded text-center">
                      <div className="text-lg font-bold text-white">6</div>
                      <div className="text-[10px] text-neutral-500">Sessions</div>
                    </div>
                    <div className="bg-neutral-800 p-2 rounded text-center">
                      <div className="text-lg font-bold text-green-500">+12%</div>
                      <div className="text-[10px] text-neutral-500">Improvement</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                  <h3 className="text-xs font-medium text-white mb-2 flex items-center justify-between">
                    <span>Recent Improvements</span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-primary hover:bg-neutral-700">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-2">
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        </div>
                        <span className="text-xs text-neutral-300">Free Throw %</span>
                      </div>
                      <span className="text-xs font-medium text-green-500">+8%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-2">
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        </div>
                        <span className="text-xs text-neutral-300">Shooting Form</span>
                      </div>
                      <span className="text-xs font-medium text-green-500">+6%</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mr-2">
                          <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                        </div>
                        <span className="text-xs text-neutral-300">Ball Handling</span>
                      </div>
                      <span className="text-xs font-medium text-green-500">+5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Plan generator */}
        <div className="lg:col-span-2">
          <TrainingPlanGenerator 
            playerAttributes={mockPlayerData.attributes}
            playerPosition={mockPlayerData.position}
            playerName={mockPlayerData.name}
          />
        </div>
      </div>
    </div>
  );
}
