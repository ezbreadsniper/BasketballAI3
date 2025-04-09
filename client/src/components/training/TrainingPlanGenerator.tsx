import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Users,
  Dumbbell,
  BrainCircuit,
  Shield,
  Target,
  Check,
  CalendarDays,
  AlertCircle,
  Rocket,
  BarChart,
  Download,
  Star
} from "lucide-react";

import {
  PlayerAttributes,
  Position,
  AttributeKey,
  PLAYER_ATTRIBUTES,
  getAttributeScoreClass,
  generateTrainingRecommendations,
  TrainingRecommendation
} from "../../lib/attributeSystem";

interface TrainingPlanGeneratorProps {
  playerAttributes: PlayerAttributes;
  playerPosition: Position;
  playerName: string;
}

// Training session structure
interface TrainingSession {
  id: string;
  day: string;
  focus: string;
  duration: string;
  exercises: TrainingExercise[];
  intensity: 'Light' | 'Moderate' | 'High';
}

// Exercise within a training session
interface TrainingExercise {
  id: string;
  name: string;
  duration: string;
  description: string;
  attribute: AttributeKey;
  sets?: string;
  reps?: string;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const intensityClasses = {
  'Light': 'bg-green-500 bg-opacity-20 text-green-500',
  'Moderate': 'bg-amber-500 bg-opacity-20 text-amber-500',
  'High': 'bg-red-500 bg-opacity-20 text-red-500'
};

// Collection of training exercises for different attributes
const trainingExercises: Partial<Record<AttributeKey, TrainingExercise[]>> = {
  shooting: [
    {
      id: 'ex1',
      name: 'Form Shooting Progression',
      duration: '15 min',
      description: 'Close-range shooting focusing on perfect form and follow-through',
      attribute: 'shooting',
    },
    {
      id: 'ex2',
      name: 'Catch and Shoot 5-Spot',
      duration: '20 min',
      description: 'Shooting from 5 spots around the perimeter with game-like footwork',
      attribute: 'shooting',
    },
    {
      id: 'ex3',
      name: 'Pull-Up Jumpers',
      duration: '15 min',
      description: 'One and two dribble pull-up jumpers from different angles',
      attribute: 'shooting',
    }
  ],
  ballHandling: [
    {
      id: 'ex4',
      name: 'Two-Ball Stationary Dribbling',
      duration: '10 min',
      description: 'Various dribbling patterns with two basketballs',
      attribute: 'ballHandling',
    },
    {
      id: 'ex5',
      name: 'Full-Court Control Dribbling',
      duration: '15 min',
      description: 'Dribbling sequences while moving full court with change of pace',
      attribute: 'ballHandling',
    },
    {
      id: 'ex6',
      name: 'Cone Dribbling Circuit',
      duration: '15 min',
      description: 'Dribbling through cones with various moves and counter moves',
      attribute: 'ballHandling',
    }
  ],
  strength: [
    {
      id: 'ex7',
      name: 'Lower Body Strength Circuit',
      duration: '30 min',
      description: 'Squats, lunges, and hip thrusts for lower body power',
      attribute: 'strength',
      sets: '3-4',
      reps: '8-12'
    },
    {
      id: 'ex8',
      name: 'Core Stability Routine',
      duration: '20 min',
      description: 'Planks, rotational movements, and anti-rotation exercises',
      attribute: 'strength',
      sets: '3',
      reps: '45 sec'
    }
  ],
  passing: [
    {
      id: 'ex9',
      name: 'Partner Passing Series',
      duration: '15 min',
      description: 'All pass types with stationary and moving targets',
      attribute: 'passing',
    },
    {
      id: 'ex10',
      name: 'Decision Making Pass Drills',
      duration: '20 min',
      description: '2-on-1 and 3-on-2 situation passing with decision points',
      attribute: 'passing',
    }
  ],
  finishing: [
    {
      id: 'ex11',
      name: 'Layup Package Development',
      duration: '20 min',
      description: 'Various finishing moves around the rim with both hands',
      attribute: 'finishing',
    },
    {
      id: 'ex12',
      name: 'Contact Finishing',
      duration: '15 min',
      description: 'Finishing through contact with pads and defenders',
      attribute: 'finishing',
    }
  ],
  perimeterDefense: [
    {
      id: 'ex13',
      name: 'Defensive Slides Circuit',
      duration: '15 min',
      description: 'Lateral movement, closeouts, and recovery patterns',
      attribute: 'perimeterDefense',
    },
    {
      id: 'ex14',
      name: '1-on-1 Containment Drills',
      duration: '20 min',
      description: 'Live 1-on-1 defense with focus on position and technique',
      attribute: 'perimeterDefense',
    }
  ],
  speed: [
    {
      id: 'ex15',
      name: 'Linear Speed Training',
      duration: '25 min',
      description: 'Sprint mechanics and acceleration development',
      attribute: 'speed',
    },
    {
      id: 'ex16',
      name: 'Multi-directional Speed Development',
      duration: '20 min',
      description: 'Change of direction and reactive movement patterns',
      attribute: 'speed',
    }
  ],
  basketballIQ: [
    {
      id: 'ex17',
      name: 'Film Study Session',
      duration: '30 min',
      description: 'Analysis of game situations and decision points',
      attribute: 'basketballIQ',
    },
    {
      id: 'ex18',
      name: 'Live Situation Drills',
      duration: '25 min',
      description: 'Small-sided games with specific decision constraints',
      attribute: 'basketballIQ',
    }
  ],
};

// Helper function to get icon for attribute
const getAttributeIcon = (attribute: AttributeKey) => {
  const iconMap: Partial<Record<AttributeKey, JSX.Element>> = {
    shooting: <Target className="h-4 w-4" />,
    ballHandling: <Target className="h-4 w-4" />,
    strength: <Dumbbell className="h-4 w-4" />,
    speed: <Rocket className="h-4 w-4" />,
    perimeterDefense: <Shield className="h-4 w-4" />,
    basketballIQ: <BrainCircuit className="h-4 w-4" />,
    passing: <Users className="h-4 w-4" />,
    finishing: <Star className="h-4 w-4" />,
  };
  
  return iconMap[attribute] || <Target className="h-4 w-4" />;
};

// Helper function to get exercise for an attribute
const getExercisesForAttribute = (attribute: AttributeKey): TrainingExercise[] => {
  // Return exercises if they exist
  if (trainingExercises[attribute] && trainingExercises[attribute]!.length > 0) {
    return trainingExercises[attribute]!;
  }
  
  // Otherwise return a generic exercise
  return [{
    id: `ex-${attribute}-1`,
    name: `${PLAYER_ATTRIBUTES[attribute]?.name || attribute} Development`,
    duration: '20 min',
    description: `Targeted training for ${PLAYER_ATTRIBUTES[attribute]?.name.toLowerCase() || attribute} improvement`,
    attribute: attribute,
  }];
};

export default function TrainingPlanGenerator({ 
  playerAttributes, 
  playerPosition,
  playerName
}: TrainingPlanGeneratorProps) {
  const [planDuration, setPlanDuration] = useState('1-week');
  const [planType, setPlanType] = useState('balanced');
  const [generatedPlan, setGeneratedPlan] = useState<TrainingSession[]>([]);
  
  const recommendations = generateTrainingRecommendations(playerAttributes, playerPosition);
  
  // Function to generate a weekly training plan
  const generateTrainingPlan = () => {
    const newPlan: TrainingSession[] = [];
    
    // Get top priority recommendations
    const topRecommendations = recommendations.slice(0, 4);
    
    // Assign different focus areas to different days
    days.forEach((day, index) => {
      // Skip Sunday for rest day
      if (day === 'Sunday') {
        newPlan.push({
          id: `session-${index}`,
          day,
          focus: 'Rest and Recovery',
          duration: 'Rest Day',
          exercises: [],
          intensity: 'Light'
        });
        return;
      }
      
      // Determine focus area based on day and recommendations
      let focusArea: string;
      let focusAttribute: AttributeKey;
      let intensity: 'Light' | 'Moderate' | 'High';
      
      if (day === 'Monday') {
        // Monday - Technical skills focus
        focusArea = 'Technical Development';
        focusAttribute = 'shooting';
        intensity = 'Moderate';
      } else if (day === 'Wednesday') {
        // Wednesday - Strength and conditioning
        focusArea = 'Strength & Conditioning';
        focusAttribute = 'strength';
        intensity = 'High';
      } else if (day === 'Friday') {
        // Friday - Game preparation
        focusArea = 'Game Situations';
        focusAttribute = 'basketballIQ';
        intensity = 'Moderate';
      } else if (day === 'Saturday') {
        // Saturday - Light workout
        focusArea = 'Recovery & Maintenance';
        focusAttribute = ((topRecommendations[0]?.category as AttributeKey) || 'shooting');
        intensity = 'Light';
      } else {
        // Tuesday/Thursday - Varied based on recommendations
        const recIndex = index % topRecommendations.length;
        const recommendation = topRecommendations[recIndex];
        focusArea = recommendation?.title || 'Skill Development';
        focusAttribute = ((recommendation?.category as AttributeKey) || 'ballHandling');
        intensity = 'Moderate';
      }
      
      // Generate exercises for the session
      const sessionExercises: TrainingExercise[] = [];
      
      // Add 1-2 exercises for the main focus area
      const mainExercises = getExercisesForAttribute(focusAttribute);
      if (mainExercises.length > 0) {
        // Add 1-2 exercises from the main focus
        sessionExercises.push(...mainExercises.slice(0, Math.min(2, mainExercises.length)));
      }
      
      // Add 1 complementary exercise
      const complementaryAttribute = getComplementaryAttribute(focusAttribute);
      const complementaryExercises = getExercisesForAttribute(complementaryAttribute);
      if (complementaryExercises.length > 0) {
        sessionExercises.push(complementaryExercises[0]);
      }
      
      // Calculate total duration
      const totalMinutes = sessionExercises.reduce(
        (total, ex) => total + parseInt(ex.duration.replace(' min', '')), 
        0
      );
      
      // Add warm-up and cool-down time
      const sessionDuration = `${totalMinutes + 20} min`;
      
      newPlan.push({
        id: `session-${index}`,
        day,
        focus: focusArea,
        duration: sessionDuration,
        exercises: sessionExercises,
        intensity
      });
    });
    
    setGeneratedPlan(newPlan);
  };
  
  // Helper to get complementary attribute for balanced training
  const getComplementaryAttribute = (mainAttribute: AttributeKey): AttributeKey => {
    const complementaryPairs: Partial<Record<AttributeKey, AttributeKey>> = {
      shooting: 'ballHandling',
      ballHandling: 'passing',
      passing: 'finishing',
      finishing: 'shooting',
      strength: 'speed',
      speed: 'agility',
      agility: 'verticalJump',
      verticalJump: 'strength',
      perimeterDefense: 'rebounding',
      rebounding: 'shotBlocking',
      shotBlocking: 'interiorDefense',
      interiorDefense: 'perimeterDefense',
      basketballIQ: 'decisionMaking',
      decisionMaking: 'composure',
      composure: 'leadership',
      leadership: 'basketballIQ',
    };
    
    return complementaryPairs[mainAttribute] || 'shooting';
  };
  
  return (
    <div className="space-y-4">
      <Card className="bg-neutral-800 border-neutral-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Training Plan Generator</CardTitle>
          <CardDescription className="text-neutral-400">
            Create personalized training plans based on assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Plan Duration</label>
              <Select
                value={planDuration}
                onValueChange={setPlanDuration}
              >
                <SelectTrigger className="w-full bg-neutral-750 border-neutral-700 text-neutral-200">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="1-week">1 Week</SelectItem>
                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                  <SelectItem value="4-weeks">4 Weeks</SelectItem>
                  <SelectItem value="8-weeks">8 Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-neutral-400 mb-1.5 block">Training Focus</label>
              <Select
                value={planType}
                onValueChange={setPlanType}
              >
                <SelectTrigger className="w-full bg-neutral-750 border-neutral-700 text-neutral-200">
                  <SelectValue placeholder="Select focus" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-800 border-neutral-700">
                  <SelectItem value="balanced">Balanced Development</SelectItem>
                  <SelectItem value="technical">Technical Focus</SelectItem>
                  <SelectItem value="physical">Physical Development</SelectItem>
                  <SelectItem value="position">Position-Specific</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="bg-neutral-750 rounded-md border border-neutral-700 p-3 mb-4">
            <h3 className="text-sm font-medium text-white mb-2">Development Priorities</h3>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-2">
                    <Rocket className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-xs text-neutral-300">{rec.title}</span>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            className="w-full"
            onClick={generateTrainingPlan}
          >
            Generate Training Plan
          </Button>
        </CardContent>
      </Card>
      
      {generatedPlan.length > 0 && (
        <Card className="bg-neutral-800 border-neutral-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white text-lg">Weekly Training Plan</CardTitle>
                <CardDescription className="text-neutral-400">
                  Customized for {playerName}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="h-8 bg-neutral-750 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="schedule" className="w-full">
              <TabsList className="bg-neutral-700 p-0.5 h-auto mb-4">
                <TabsTrigger 
                  value="schedule" 
                  className="text-xs py-1.5 px-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-sm"
                >
                  Schedule
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="text-xs py-1.5 px-3 data-[state=active]:bg-primary data-[state=active]:text-white rounded-sm"
                >
                  Detailed Exercises
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedule" className="m-0">
                <div className="space-y-3">
                  {generatedPlan.map(session => (
                    <div 
                      key={session.id}
                      className={`border border-neutral-700 rounded-md overflow-hidden ${
                        session.day === 'Sunday' ? 'bg-neutral-750 opacity-70' : 'bg-neutral-750'
                      }`}
                    >
                      <div className="flex items-center border-b border-neutral-700">
                        <div className="py-2 px-3 w-24 sm:w-32 bg-neutral-700 text-white font-medium text-xs">
                          {session.day}
                        </div>
                        <div className="px-3 py-2 flex-1 text-xs sm:text-sm font-medium text-white">
                          {session.focus}
                        </div>
                        <div className={`px-3 py-2 text-xs font-medium ${
                          intensityClasses[session.intensity]
                        }`}>
                          {session.intensity}
                        </div>
                      </div>
                      
                      <div className="p-3">
                        {session.day === 'Sunday' ? (
                          <div className="flex items-center py-2">
                            <CalendarDays className="h-4 w-4 text-neutral-500 mr-2" />
                            <span className="text-xs text-neutral-400">Rest & Recovery Day</span>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 text-neutral-500 mr-1.5" />
                                <span className="text-xs text-neutral-400">{session.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-neutral-400 mr-1.5">Exercises:</span>
                                <span className="text-xs font-medium text-neutral-300">{session.exercises.length}</span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {session.exercises.map(exercise => (
                                <div key={exercise.id} className="flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center mr-2">
                                    {getAttributeIcon(exercise.attribute)}
                                  </div>
                                  <div className="text-xs text-neutral-300">{exercise.name}</div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="m-0">
                <div className="space-y-4">
                  {generatedPlan.filter(session => session.exercises.length > 0).map(session => (
                    <div key={session.id} className="border border-neutral-700 rounded-md overflow-hidden bg-neutral-750">
                      <div className="bg-neutral-700 py-2 px-3 text-white font-medium text-sm flex justify-between items-center">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5" />
                          {session.day}
                        </div>
                        <div className="text-xs">{session.focus}</div>
                      </div>
                      
                      <div className="p-3 space-y-3">
                        {session.exercises.map((exercise, index) => (
                          <div key={exercise.id} className="border border-neutral-700 rounded p-3 bg-neutral-800">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center mr-3">
                                  {getAttributeIcon(exercise.attribute)}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white">{exercise.name}</h4>
                                  <div className="flex items-center mt-0.5">
                                    <span className="text-[10px] text-neutral-500">
                                      {PLAYER_ATTRIBUTES[exercise.attribute]?.name || exercise.attribute}
                                    </span>
                                    <span className="mx-1.5 text-neutral-600">•</span>
                                    <span className="text-[10px] text-neutral-500">
                                      {exercise.duration}
                                    </span>
                                    {exercise.sets && (
                                      <>
                                        <span className="mx-1.5 text-neutral-600">•</span>
                                        <span className="text-[10px] text-neutral-500">
                                          {exercise.sets} sets × {exercise.reps} reps
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="bg-neutral-700 text-xs text-white rounded-full h-6 w-6 flex items-center justify-center">
                                {index + 1}
                              </div>
                            </div>
                            
                            <div className="text-xs text-neutral-400 mt-2">
                              {exercise.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <Separator className="my-4 bg-neutral-700" />
            
            <div className="bg-neutral-750 border border-neutral-700 rounded-md p-3 flex items-start">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-xs text-neutral-400">
                <p className="font-medium text-white mb-1">Important Notes</p>
                <p className="mb-1">This plan is generated based on your current assessment data and should be reviewed by your coach before implementation.</p>
                <p>Always ensure proper warm-up (10-15 minutes) before each session and cool-down (5-10 minutes) after completion.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}