import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Plus,
  Activity,
  Clock,
  Calendar,
  Users,
  Dumbbell,
  BrainCircuit,
  Shield,
  Target,
  Award,
  TrendingUp,
  Download,
  BarChart,
  Share2,
  Rocket
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

import {
  PLAYER_ATTRIBUTES,
  AttributeKey,
  AttributeScore,
  Position,
  PlayerAttributes,
  getAttributeScoreClass,
  getSkillLevelFromScore,
  calculateOverallRating,
  convertRatingToStars,
  generateTrainingRecommendations,
  TrainingRecommendation
} from "../lib/attributeSystem";

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
  nextAssessment: "April 15, 2025",
  developmentPhase: "Advanced Development",
  coach: "Coach Williams",
};

// Utility functions for the component
const getCategoryAttributes = (category: string, attributes: PlayerAttributes) => {
  return Object.entries(PLAYER_ATTRIBUTES)
    .filter(([_, info]) => info.category === category)
    .map(([key]) => ({
      key,
      name: PLAYER_ATTRIBUTES[key as AttributeKey].name,
      score: attributes[key] || { value: 0, potential: 0 }
    }));
};

const renderStarRating = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  for (let i = 0; i < fullStars; i++) {
    stars.push(<Award key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
  }
  
  if (hasHalfStar) {
    stars.push(<Award key="half" className="h-4 w-4 text-yellow-400" />);
  }
  
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Award key={`empty-${i}`} className="h-4 w-4 text-neutral-600" />);
  }
  
  return <div className="flex">{stars}</div>;
};

export default function PlayerAssessment() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("all-time");
  
  // Calculate overall rating
  const overallRating = calculateOverallRating(mockPlayerData.attributes, mockPlayerData.position);
  const starRating = convertRatingToStars(overallRating);
  
  // Generate training recommendations
  const trainingRecommendations = generateTrainingRecommendations(
    mockPlayerData.attributes,
    mockPlayerData.position
  );
  
  // Get attributes by category
  const physicalAttributes = getCategoryAttributes("physical", mockPlayerData.attributes);
  const technicalAttributes = getCategoryAttributes("technical", mockPlayerData.attributes);
  const defensiveAttributes = getCategoryAttributes("defensive", mockPlayerData.attributes);
  const mentalAttributes = getCategoryAttributes("mental", mockPlayerData.attributes);
  
  return (
    <div className="py-4 px-3 sm:px-4 lg:px-6 bg-neutral-900 text-neutral-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="text-sm text-neutral-400">April 9, 2025</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100">Player Assessment</h1>
        </div>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger className="w-[180px] h-9 bg-neutral-800 border-neutral-700 text-neutral-200">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-800 border-neutral-700">
              <SelectItem value="recent">Last 3 months</SelectItem>
              <SelectItem value="6-months">Last 6 months</SelectItem>
              <SelectItem value="1-year">Last year</SelectItem>
              <SelectItem value="all-time">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9 bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column - Player profile */}
        <div className="lg:col-span-1">
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg flex items-center justify-between">
                <span>Player Profile</span>
                <div className="flex space-x-1">
                  {renderStarRating(starRating)}
                </div>
              </CardTitle>
              <CardDescription className="text-neutral-400">
                Overall rating: {overallRating}/100
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  {mockPlayerData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-4">
                  <h3 className="text-white font-semibold">{mockPlayerData.name}</h3>
                  <div className="flex items-center text-sm">
                    <span className="text-primary inline-block px-2 py-0.5 rounded bg-primary bg-opacity-20 text-xs">
                      {mockPlayerData.position}
                    </span>
                    <span className="mx-2 text-neutral-500">|</span>
                    <span className="text-neutral-400">{mockPlayerData.team}</span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">{mockPlayerData.level}</div>
                </div>
              </div>
              
              <Separator className="my-4 bg-neutral-700" />
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div className="text-neutral-400">Age</div>
                <div className="text-right text-white">{mockPlayerData.age}</div>
                
                <div className="text-neutral-400">Height</div>
                <div className="text-right text-white">{mockPlayerData.height}</div>
                
                <div className="text-neutral-400">Weight</div>
                <div className="text-right text-white">{mockPlayerData.weight}</div>
                
                <div className="text-neutral-400">Coach</div>
                <div className="text-right text-white">{mockPlayerData.coach}</div>
              </div>
              
              <Separator className="my-4 bg-neutral-700" />
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-neutral-400">Last Assessment</span>
                    <span className="text-xs text-neutral-300">{mockPlayerData.lastAssessment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-neutral-400">Next Assessment</span>
                    <span className="text-xs text-green-500">{mockPlayerData.nextAssessment}</span>
                  </div>
                </div>
                
                <Separator className="my-4 bg-neutral-700" />
                
                <div>
                  <h4 className="text-sm font-medium text-white mb-1.5">Development Phase</h4>
                  <div className="text-xs bg-neutral-700 rounded-md p-2 text-center">
                    <span className="text-primary">{mockPlayerData.developmentPhase}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white mb-1.5">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-9 bg-neutral-750 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      New Assessment
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 bg-neutral-750 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                      <Share2 className="h-3.5 w-3.5 mr-1.5" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Center and right columns - Attribute assessment */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-neutral-800 border-b border-neutral-700 p-0 h-auto mb-4 w-full">
              <TabsTrigger 
                value="overview" 
                className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="physical" 
                className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
              >
                Physical
              </TabsTrigger>
              <TabsTrigger 
                value="technical" 
                className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
              >
                Technical
              </TabsTrigger>
              <TabsTrigger 
                value="defensive" 
                className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
              >
                Defensive
              </TabsTrigger>
              <TabsTrigger 
                value="mental" 
                className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
              >
                Mental
              </TabsTrigger>
              <TabsTrigger 
                value="development" 
                className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
              >
                Development
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg">Attribute Summary</CardTitle>
                  <CardDescription className="text-neutral-400">
                    Top attributes based on position
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-1.5 text-primary" />
                          Technical Rating
                        </h3>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-white mr-2">
                            {Math.round(technicalAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / technicalAttributes.length)}
                          </div>
                          <Progress 
                            value={(technicalAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / technicalAttributes.length) * 5} 
                            max={100} 
                            className="h-2 flex-1 bg-neutral-700"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                          <Shield className="h-4 w-4 mr-1.5 text-blue-500" />
                          Defensive Rating
                        </h3>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-white mr-2">
                            {Math.round(defensiveAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / defensiveAttributes.length)}
                          </div>
                          <Progress 
                            value={(defensiveAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / defensiveAttributes.length) * 5} 
                            max={100}
                            className="h-2 flex-1 bg-neutral-700"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                          <Dumbbell className="h-4 w-4 mr-1.5 text-amber-500" />
                          Physical Rating
                        </h3>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-white mr-2">
                            {Math.round(physicalAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / physicalAttributes.length)}
                          </div>
                          <Progress 
                            value={(physicalAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / physicalAttributes.length) * 5} 
                            max={100}
                            className="h-2 flex-1 bg-neutral-700"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-neutral-300 mb-2 flex items-center">
                          <BrainCircuit className="h-4 w-4 mr-1.5 text-purple-500" />
                          Mental Rating
                        </h3>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold text-white mr-2">
                            {Math.round(mentalAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / mentalAttributes.length)}
                          </div>
                          <Progress 
                            value={(mentalAttributes.reduce((sum, attr) => sum + attr.score.value, 0) / mentalAttributes.length) * 5} 
                            max={100}
                            className="h-2 flex-1 bg-neutral-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-neutral-700" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">Top Attributes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(mockPlayerData.attributes)
                        .sort((a, b) => b[1].value - a[1].value)
                        .slice(0, 6)
                        .map(([key, score]) => (
                          <div key={key} className="bg-neutral-750 rounded p-2.5 border border-neutral-700">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-medium text-neutral-300">
                                {PLAYER_ATTRIBUTES[key as AttributeKey]?.name || key}
                              </span>
                              <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(score.value)}`}>
                                {score.value}
                              </span>
                            </div>
                            <div className="w-full bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-primary h-full transition-all duration-300 ease-in-out"
                                style={{ width: `${(score.value / 20) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  <Separator className="my-4 bg-neutral-700" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">Improvement Priorities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {trainingRecommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="bg-neutral-750 rounded p-2.5 border border-neutral-700">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-2">
                              <Rocket className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-xs font-medium text-white leading-tight">{rec.title}</h4>
                              <p className="text-[10px] text-neutral-500">{rec.priority} Priority</p>
                            </div>
                          </div>
                          <p className="text-[11px] text-neutral-400 h-8 overflow-hidden">
                            {rec.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Physical Tab */}
            <TabsContent value="physical" className="space-y-4">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Dumbbell className="h-5 w-5 mr-2 text-amber-500" />
                    Physical Attributes
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    Assessment of athleticism and physical capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {physicalAttributes.map(attribute => (
                      <div key={attribute.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-neutral-300">{attribute.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ChevronRight className="h-4 w-4 text-neutral-500 ml-1 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Current: {attribute.score.value}/20</p>
                                  <p className="text-xs">Potential: {attribute.score.potential}/20</p>
                                  <p className="text-xs font-medium mt-1">{getSkillLevelFromScore(attribute.score.value)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(attribute.score.value)}`}>
                            {attribute.score.value}
                          </span>
                        </div>
                        
                        <div className="relative w-full">
                          {/* Current score bar */}
                          <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-amber-500 h-full transition-all duration-300 ease-in-out"
                              style={{ width: `${(attribute.score.value / 20) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Potential indicator */}
                          <div 
                            className="absolute h-3 w-0.5 bg-green-400 top-50 -mt-0.5"
                            style={{ 
                              left: `${(attribute.score.potential / 20) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-neutral-700" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">Comparison to Position Average</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Top Physical Strengths</h4>
                        <div className="space-y-2">
                          {physicalAttributes
                            .sort((a, b) => b.score.value - a.score.value)
                            .slice(0, 3)
                            .map(attr => (
                              <div key={attr.key} className="flex justify-between items-center">
                                <span className="text-xs text-neutral-400">{attr.name}</span>
                                <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(attr.score.value)}`}>
                                  {attr.score.value}
                                </span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Physical Development Areas</h4>
                        <div className="space-y-2">
                          {physicalAttributes
                            .sort((a, b) => a.score.value - b.score.value)
                            .slice(0, 3)
                            .map(attr => (
                              <div key={attr.key} className="flex justify-between items-center">
                                <span className="text-xs text-neutral-400">{attr.name}</span>
                                <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(attr.score.value)}`}>
                                  {attr.score.value}
                                </span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Technical Tab */}
            <TabsContent value="technical" className="space-y-4">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Technical Skills
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    Assessment of basketball-specific skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {technicalAttributes.map(attribute => (
                      <div key={attribute.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-neutral-300">{attribute.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ChevronRight className="h-4 w-4 text-neutral-500 ml-1 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Current: {attribute.score.value}/20</p>
                                  <p className="text-xs">Potential: {attribute.score.potential}/20</p>
                                  <p className="text-xs font-medium mt-1">{getSkillLevelFromScore(attribute.score.value)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(attribute.score.value)}`}>
                            {attribute.score.value}
                          </span>
                        </div>
                        
                        <div className="relative w-full">
                          {/* Current score bar */}
                          <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-primary h-full transition-all duration-300 ease-in-out"
                              style={{ width: `${(attribute.score.value / 20) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Potential indicator */}
                          <div 
                            className="absolute h-3 w-0.5 bg-green-400 top-50 -mt-0.5"
                            style={{ 
                              left: `${(attribute.score.potential / 20) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-neutral-700" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">Technical Skill Breakdown</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Top Technical Strengths</h4>
                        <div className="space-y-2">
                          {technicalAttributes
                            .sort((a, b) => b.score.value - a.score.value)
                            .slice(0, 3)
                            .map(attr => (
                              <div key={attr.key} className="flex justify-between items-center">
                                <span className="text-xs text-neutral-400">{attr.name}</span>
                                <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(attr.score.value)}`}>
                                  {attr.score.value}
                                </span>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Shooting Breakdown</h4>
                        <div className="space-y-2">
                          {/* Example of more detailed breakdown for shooting */}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Form</span>
                            <span className="text-xs font-medium text-neutral-200">Good</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Catch & Shoot %</span>
                            <span className="text-xs font-medium text-neutral-200">46%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Off Dribble %</span>
                            <span className="text-xs font-medium text-neutral-200">38%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">3PT %</span>
                            <span className="text-xs font-medium text-neutral-200">35%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Defensive Tab */}
            <TabsContent value="defensive" className="space-y-4">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                    Defensive Attributes
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    Assessment of defensive capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {defensiveAttributes.map(attribute => (
                      <div key={attribute.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-neutral-300">{attribute.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ChevronRight className="h-4 w-4 text-neutral-500 ml-1 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Current: {attribute.score.value}/20</p>
                                  <p className="text-xs">Potential: {attribute.score.potential}/20</p>
                                  <p className="text-xs font-medium mt-1">{getSkillLevelFromScore(attribute.score.value)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(attribute.score.value)}`}>
                            {attribute.score.value}
                          </span>
                        </div>
                        
                        <div className="relative w-full">
                          {/* Current score bar */}
                          <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-500 h-full transition-all duration-300 ease-in-out"
                              style={{ width: `${(attribute.score.value / 20) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Potential indicator */}
                          <div 
                            className="absolute h-3 w-0.5 bg-green-400 top-50 -mt-0.5"
                            style={{ 
                              left: `${(attribute.score.potential / 20) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-neutral-700" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">Defensive Metrics</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700 flex flex-col items-center">
                        <div className="text-xs text-neutral-400 mb-1">Deflections</div>
                        <div className="text-lg font-bold text-white">3.2</div>
                        <div className="text-[10px] text-green-500">+0.5 last 3 months</div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700 flex flex-col items-center">
                        <div className="text-xs text-neutral-400 mb-1">Steals</div>
                        <div className="text-lg font-bold text-white">1.8</div>
                        <div className="text-[10px] text-green-500">+0.3 last 3 months</div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700 flex flex-col items-center">
                        <div className="text-xs text-neutral-400 mb-1">Blocks</div>
                        <div className="text-lg font-bold text-white">0.7</div>
                        <div className="text-[10px] text-neutral-500">No change</div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700 flex flex-col items-center">
                        <div className="text-xs text-neutral-400 mb-1">Def. Rebounds</div>
                        <div className="text-lg font-bold text-white">5.3</div>
                        <div className="text-[10px] text-green-500">+1.1 last 3 months</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Mental Tab */}
            <TabsContent value="mental" className="space-y-4">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center">
                    <BrainCircuit className="h-5 w-5 mr-2 text-purple-500" />
                    Mental/Cognitive Attributes
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    Assessment of basketball IQ and mental aspects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {mentalAttributes.map(attribute => (
                      <div key={attribute.key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-neutral-300">{attribute.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ChevronRight className="h-4 w-4 text-neutral-500 ml-1 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Current: {attribute.score.value}/20</p>
                                  <p className="text-xs">Potential: {attribute.score.potential}/20</p>
                                  <p className="text-xs font-medium mt-1">{getSkillLevelFromScore(attribute.score.value)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className={`text-xs font-medium rounded-sm px-1.5 py-0.5 ${getAttributeScoreClass(attribute.score.value)}`}>
                            {attribute.score.value}
                          </span>
                        </div>
                        
                        <div className="relative w-full">
                          {/* Current score bar */}
                          <div className="w-full bg-neutral-700 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-purple-500 h-full transition-all duration-300 ease-in-out"
                              style={{ width: `${(attribute.score.value / 20) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Potential indicator */}
                          <div 
                            className="absolute h-3 w-0.5 bg-green-400 top-50 -mt-0.5"
                            style={{ 
                              left: `${(attribute.score.potential / 20) * 100}%`,
                              transform: 'translateX(-50%)'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-neutral-700" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">Game Situations</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Decision Making Examples</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Pass/Shoot Decisions</span>
                            <span className="text-xs font-medium text-neutral-200">Good</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Play Recognition</span>
                            <span className="text-xs font-medium text-neutral-200">Advanced</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Time/Score Awareness</span>
                            <span className="text-xs font-medium text-neutral-200">Good</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Composure Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Free Throw % (Clutch)</span>
                            <span className="text-xs font-medium text-neutral-200">76%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Turnover Rate (Pressure)</span>
                            <span className="text-xs font-medium text-neutral-200">12%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-neutral-400">Emotional Control</span>
                            <span className="text-xs font-medium text-neutral-200">Excellent</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Development Tab */}
            <TabsContent value="development" className="space-y-4">
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-lg flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Development Plan
                  </CardTitle>
                  <CardDescription className="text-neutral-400">
                    AI-generated training recommendations based on assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trainingRecommendations.map((rec, index) => (
                      <div key={index} className="bg-neutral-750 rounded p-3 border border-neutral-700 hover:border-neutral-600 transition-colors">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3 mt-0.5">
                            <Rocket className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="text-sm font-medium text-white">{rec.title}</h4>
                              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-700 text-neutral-300">
                                {rec.priority}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 mb-2">{rec.description}</p>
                            
                            <div className="flex items-center text-xs text-neutral-500">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>{rec.duration}</span>
                              <span className="mx-2">•</span>
                              <span>{rec.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Separator className="my-6 bg-neutral-700" />
                  
                  <div>
                    <h3 className="text-sm font-medium text-neutral-300 mb-3">Development Timeline</h3>
                    
                    <div className="space-y-4">
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Short-term Goals (1-3 months)</h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <div className="w-4 h-4 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-neutral-300">Improve shooting consistency</div>
                              <div className="text-[10px] text-neutral-500">Focus on form and repetition</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-4 h-4 rounded-full bg-green-500 bg-opacity-20 flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-neutral-300">Enhance defensive positioning</div>
                              <div className="text-[10px] text-neutral-500">Improve footwork and anticipation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Mid-term Goals (3-6 months)</h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <div className="w-4 h-4 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-neutral-300">Develop off-ball movement</div>
                              <div className="text-[10px] text-neutral-500">Master cutting and screening techniques</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-4 h-4 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-neutral-300">Increase strength and conditioning</div>
                              <div className="text-[10px] text-neutral-500">Target 10% improvement in core and lower body</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-neutral-750 rounded p-3 border border-neutral-700">
                        <h4 className="text-xs font-medium text-white mb-2">Long-term Goals (6-12 months)</h4>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <div className="w-4 h-4 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-neutral-300">Achieve advanced basketball IQ</div>
                              <div className="text-[10px] text-neutral-500">Become proficient in complex offensive sets</div>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="w-4 h-4 rounded-full bg-purple-500 bg-opacity-20 flex items-center justify-center mt-0.5 mr-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-neutral-300">Develop leadership capabilities</div>
                              <div className="text-[10px] text-neutral-500">Take on vocal leadership role within team</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}