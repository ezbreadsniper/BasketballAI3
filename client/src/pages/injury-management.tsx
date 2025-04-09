import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Activity, 
  Heart, 
  ArrowUpRight, 
  ArrowUp, 
  ArrowDown, 
  BarChart4, 
  CalendarCheck, 
  Dumbbell, 
  FilePlus2, 
  FileCheck2, 
  RotateCcw
} from "lucide-react";

// Injury prevention protocols 
const PREVENTION_PROTOCOLS = [
  {
    id: 1,
    name: "ACL Injury Prevention",
    description: "Comprehensive protocol focused on proper landing mechanics, hamstring/quadriceps balance, and knee stability.",
    category: "Lower Body",
    duration: "15-20 minutes",
    frequency: "3x weekly",
    riskFactor: "High",
    exercises: [
      { name: "Nordic Hamstring Curls", sets: 3, reps: "8-10", notes: "Focus on eccentric control" },
      { name: "Single-Leg RDLs", sets: 3, reps: "10-12 each side", notes: "Maintain neutral spine" },
      { name: "Lateral Band Walks", sets: 3, reps: "15 steps each direction", notes: "Keep tension throughout" },
      { name: "Drop Jumps with Proper Landing", sets: 3, reps: "6-8", notes: "Soft landing, knees tracking over toes" },
      { name: "Single-Leg Balance with Perturbation", sets: 2, reps: "30 seconds each side", notes: "Progress by closing eyes" }
    ]
  },
  {
    id: 2,
    name: "Ankle Sprain Prevention",
    description: "Balance and proprioception training to reduce ankle instability and strengthen supporting musculature.",
    category: "Lower Body",
    duration: "10-15 minutes",
    frequency: "4x weekly",
    riskFactor: "Medium",
    exercises: [
      { name: "Single-Leg Balance", sets: 3, reps: "30 seconds each side", notes: "Progress to unstable surface" },
      { name: "Ankle Alphabet", sets: 2, reps: "1-2 complete alphabets", notes: "Controlled movement" },
      { name: "Banded Ankle Eversion", sets: 3, reps: "12-15 each side", notes: "Moderate resistance" },
      { name: "Box Jumps with Controlled Landing", sets: 3, reps: "8-10", notes: "Focus on soft landing" },
      { name: "Multi-Directional Hops", sets: 2, reps: "8 each direction", notes: "Land and stabilize fully between hops" }
    ]
  },
  {
    id: 3,
    name: "Upper Back & Shoulder Stability",
    description: "Rotator cuff strength and scapular stability to prevent shoulder injuries common in shooting mechanics.",
    category: "Upper Body",
    duration: "12-15 minutes",
    frequency: "3x weekly",
    riskFactor: "Medium",
    exercises: [
      { name: "Band External Rotation", sets: 3, reps: "12-15 each side", notes: "Elbow at 90 degrees" },
      { name: "Scapular Retractions", sets: 3, reps: "12-15", notes: "Squeeze shoulder blades together" },
      { name: "Wall Slides", sets: 3, reps: "10-12", notes: "Maintain contact with wall" },
      { name: "Face Pulls", sets: 3, reps: "12-15", notes: "Focus on external rotation at finish" },
      { name: "Y-T-W-L Sequence", sets: 2, reps: "8 of each position", notes: "Light weight, focus on form" }
    ]
  },
  {
    id: 4,
    name: "Core & Hip Stability",
    description: "Targets the core and hip stabilizers to improve balance, reduce back pain, and enhance movement efficiency.",
    category: "Core",
    duration: "15-20 minutes",
    frequency: "4x weekly",
    riskFactor: "Medium",
    exercises: [
      { name: "Dead Bug", sets: 3, reps: "10-12 each side", notes: "Maintain neutral spine" },
      { name: "Glute Bridges", sets: 3, reps: "12-15", notes: "Focus on posterior pelvic tilt" },
      { name: "Side Plank with Hip Abduction", sets: 2, reps: "8-10 each side", notes: "Keep body in straight line" },
      { name: "Bird Dog", sets: 3, reps: "10-12 each side", notes: "Maintain stable core throughout" },
      { name: "Pallof Press", sets: 3, reps: "12 each side", notes: "Resist rotation" }
    ]
  },
  {
    id: 5,
    name: "In-Season Load Management",
    description: "Strategic approach to managing practice intensity, game minutes, and recovery to prevent overuse injuries.",
    category: "Recovery",
    duration: "Ongoing",
    frequency: "Daily monitoring",
    riskFactor: "High",
    exercises: [
      { name: "Rate of Perceived Exertion (RPE) Tracking", sets: 1, reps: "Daily", notes: "Track after each session" },
      { name: "Sleep Quality Assessment", sets: 1, reps: "Daily", notes: "Log hours and quality (1-10)" },
      { name: "Active Recovery Sessions", sets: 1, reps: "2-3x weekly", notes: "Light movement, mobility" },
      { name: "Contrast Therapy", sets: 1, reps: "As needed", notes: "Alternate hot and cold" },
      { name: "Game-Day Recovery Protocol", sets: 1, reps: "Post-game", notes: "Nutrition, hydration, soft tissue work" }
    ]
  }
];

// Active injury management protocols
const REHAB_PROTOCOLS = [
  {
    id: 1,
    name: "Ankle Sprain Rehabilitation",
    description: "Progressive protocol for ankle sprain recovery from acute phase to return-to-play.",
    phase: "Phase 1: Acute (0-7 days)",
    nextPhase: "Phase 2: Sub-acute (7-21 days)",
    timeToNextPhase: 5,
    severity: "Grade 2 Sprain",
    recoveryPercentage: 20,
    exercises: [
      { name: "RICE Protocol", frequency: "First 48-72 hours", description: "Rest, ice (20 min, 5x daily), compression, elevation" },
      { name: "Ankle Alphabet", frequency: "2x daily", description: "Pain-free range of motion" },
      { name: "Towel Scrunches", frequency: "2x daily, 2 sets of 15", description: "Activate foot intrinsics" },
      { name: "Gentle Ankle Pumps", frequency: "Hourly, 10-15 reps", description: "Pain-free dorsiflexion/plantarflexion" }
    ],
    precautions: "Avoid weight-bearing that causes pain, don't stretch into painful ranges, discontinue if sharp pain increases"
  },
  {
    id: 2,
    name: "Patellar Tendinopathy Management",
    description: "Evidence-based approach to managing jumper's knee with emphasis on load management and eccentric strengthening.",
    phase: "Phase 2: Moderate Loading",
    nextPhase: "Phase 3: Sport-Specific Training",
    timeToNextPhase: 14,
    severity: "Moderate",
    recoveryPercentage: 65,
    exercises: [
      { name: "Isometric Wall Sits", frequency: "Daily, 5 sets of 45-second holds", description: "Pain level below 3/10 during exercise" },
      { name: "Spanish Squat with Band", frequency: "Every other day, 4 sets of 8", description: "Slow 4-second eccentric phase" },
      { name: "Single-Leg Decline Squats", frequency: "3x weekly, 3 sets of 10", description: "Bodyweight only, progress to weighted" },
      { name: "Leg Extensions (Limited ROM)", frequency: "2x weekly, 3 sets of 12", description: "Light weight, pain-free range only" }
    ],
    precautions: "Avoid jumping activities, limit squatting depth to pain-free range, monitor pain during and 24 hours after exercise"
  },
  {
    id: 3,
    name: "Low Back Pain Management",
    description: "Conservative management of mechanical low back pain focusing on core stability and movement pattern correction.",
    phase: "Phase 3: Functional Restoration",
    nextPhase: "Return to Full Activity",
    timeToNextPhase: 7,
    severity: "Mild to Moderate",
    recoveryPercentage: 85,
    exercises: [
      { name: "McGill Big 3 (Side Bridge, Bird Dog, Curl-up)", frequency: "Daily, 3 sets each", description: "Focus on endurance, not max effort" },
      { name: "Hip Hinge Pattern Training", frequency: "Daily, 3 sets of 10", description: "Emphasize proper movement patterns" },
      { name: "Glute Activation Series", frequency: "Daily, 2 sets each exercise", description: "Bridges, clams, hip thrusts" },
      { name: "Cat-Cow with Breathing", frequency: "2x daily, 10 repetitions", description: "Coordinate movement with breath" }
    ],
    precautions: "Avoid loaded spinal flexion, monitor for pain that radiates to extremities, discontinue if symptom location changes"
  }
];

// User's injury history
const INJURY_HISTORY = [
  {
    id: 1,
    type: "Ankle Sprain",
    date: "2024-12-10",
    severity: "Grade 2",
    details: "Inversion sprain during game, lateral ankle complex",
    treatment: "RICE, immobilization, progressive rehabilitation",
    recovery: "Full clearance after 6 weeks",
    recurrence: false
  },
  {
    id: 2,
    type: "Patellar Tendinopathy",
    date: "2024-08-05",
    severity: "Moderate",
    details: "Gradual onset during summer league, exacerbated by increased training volume",
    treatment: "Load management, eccentric strengthening protocol, PRP injection",
    recovery: "Return to modified training after 4 weeks, full clearance at 12 weeks",
    recurrence: true,
    recurrenceDetails: "Minor flare-up January 2025, resolved with 2-week modified training"
  }
];

export default function InjuryManagement() {
  const { user } = useAuth();
  const [activeProtocol, setActiveProtocol] = useState<any>(null);

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Injury Management</h1>
        <p className="text-muted-foreground text-lg">
          Comprehensive prevention and management protocols for optimal player health
        </p>
      </div>

      <Tabs defaultValue="prevention" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="prevention">Prevention</TabsTrigger>
          <TabsTrigger value="management">Active Management</TabsTrigger>
          <TabsTrigger value="history">Injury History</TabsTrigger>
        </TabsList>

        <TabsContent value="prevention">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 lg:col-span-3">
              <Card className="bg-black/5 dark:bg-white/5 border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Current injury risk factors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall Risk</span>
                        <span className="text-sm font-medium text-amber-500">Moderate</span>
                      </div>
                      <Progress value={58} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Workload Spikes</span>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          Medium
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Recovery Status</span>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Good
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart4 className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Previous Injuries</span>
                        </div>
                        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                          High
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarCheck className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Season Phase</span>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                          Mid-Season
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Recommended Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                        Ankle Stability
                      </Badge>
                      <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                        Knee Mechanics
                      </Badge>
                      <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                        Recovery Protocols
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-8 lg:col-span-9">
              <h2 className="text-xl font-semibold mb-4">Prevention Protocols</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PREVENTION_PROTOCOLS.map((protocol) => (
                  <Card key={protocol.id} className="bg-card border-none shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{protocol.name}</CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${protocol.riskFactor === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                              protocol.riskFactor === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                              'bg-green-500/10 text-green-500 border-green-500/20'}
                          `}
                        >
                          {protocol.riskFactor} Risk
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2 text-sm">
                        {protocol.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <span className="text-muted-foreground block">Duration</span>
                          <span className="font-medium">{protocol.duration}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block">Frequency</span>
                          <span className="font-medium">{protocol.frequency}</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        size="sm"
                        onClick={() => setActiveProtocol(protocol)}
                      >
                        View Protocol
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {activeProtocol && (
                <Card className="mt-6 border-none shadow-lg">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>{activeProtocol.name}</CardTitle>
                      <CardDescription>{activeProtocol.description}</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setActiveProtocol(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      <span className="sr-only">Close</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Category</span>
                        <span className="font-medium">{activeProtocol.category}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Duration</span>
                        <span className="font-medium">{activeProtocol.duration}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Frequency</span>
                        <span className="font-medium">{activeProtocol.frequency}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-3">Exercises</h3>
                    <div className="space-y-3">
                      {activeProtocol.exercises.map((exercise: { name: string; sets: number; reps: string; notes: string }, index: number) => (
                        <div key={index} className="bg-black/5 dark:bg-white/5 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-sm">{exercise.sets} sets × {exercise.reps}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{exercise.notes}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex flex-col md:flex-row gap-3">
                      <Button className="flex-1">
                        <FileCheck2 className="mr-2 h-4 w-4" />
                        Log Completion
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        Add to Training Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="management">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              <h2 className="text-xl font-semibold mb-4">Active Recovery Protocols</h2>
              
              {REHAB_PROTOCOLS.map((protocol) => (
                <Card key={protocol.id} className="mb-6 border-none shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <CardTitle>{protocol.name}</CardTitle>
                      <Badge 
                        variant={protocol.severity === "Moderate" || protocol.severity === "Grade 2 Sprain" ? "outline" : "default"}
                        className={`
                          ${protocol.severity.includes("Grade 2") || protocol.severity === "Moderate" ? 
                            'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            protocol.severity === "Mild to Moderate" ? 
                            'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                            'bg-red-500/10 text-red-500 border-red-500/20'}
                        `}
                      >
                        {protocol.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <CardDescription>{protocol.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{protocol.phase}</span>
                        <span className="text-sm font-medium">Recovery Progress</span>
                      </div>
                      <Progress value={protocol.recoveryPercentage} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Next: {protocol.nextPhase}</span>
                        <span className="text-xs text-muted-foreground">{protocol.recoveryPercentage}%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      {protocol.exercises.map((exercise: { name: string; frequency: string; description: string }, index: number) => (
                        <div key={index} className="bg-black/5 dark:bg-white/5 p-3 rounded-md">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{exercise.name}</span>
                            <span className="text-sm">{exercise.frequency}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <Alert variant="destructive" className="bg-red-500/10 text-red-500 border-red-500/20">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Precautions</AlertTitle>
                      <AlertDescription className="text-sm mt-1">
                        {protocol.precautions}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1">
                        <FileCheck2 className="mr-2 h-4 w-4" />
                        Log Session
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Request Protocol Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="lg:col-span-4">
              <Card className="bg-black/5 dark:bg-white/5 border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Recovery Metrics</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Workload Ratio</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">1.15</span>
                        <ArrowUp className="ml-1 h-4 w-4 text-red-500" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Pain Level (0-10)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">3.2</span>
                        <ArrowDown className="ml-1 h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Recovery Score</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">73%</span>
                        <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarCheck className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Weekly Change</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">+7%</span>
                        <ArrowUpRight className="ml-1 h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Daily Wellness Check</h4>
                    <Button className="w-full">
                      Complete Today's Check-in
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4 border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Medical Team Notes</CardTitle>
                  <CardDescription>Latest updates</CardDescription>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div>
                    <p className="font-medium">Dr. Williams (Team Physician)</p>
                    <p className="text-muted-foreground">April 6, 2025</p>
                    <p className="mt-1">Athlete cleared for full basketball activities. Monitor workload carefully for next 2 weeks. Follow-up in 3 weeks.</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <p className="font-medium">Sarah Chen (Physical Therapist)</p>
                    <p className="text-muted-foreground">April 3, 2025</p>
                    <p className="mt-1">Completed final knee stability assessment. All functional tests passed. Continue with maintenance exercises 3x weekly.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Injury History</h2>
              
              {INJURY_HISTORY.map((injury) => (
                <Card key={injury.id} className="mb-6 border-none shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle>{injury.type}</CardTitle>
                      <Badge variant="outline">
                        {injury.severity}
                      </Badge>
                    </div>
                    <CardDescription>
                      Occurred: {new Date(injury.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Details</h4>
                        <p className="text-sm">{injury.details}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Treatment</h4>
                        <p className="text-sm">{injury.treatment}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Recovery</h4>
                        <p className="text-sm">{injury.recovery}</p>
                      </div>
                      
                      {injury.recurrence && (
                        <div>
                          <h4 className="text-sm font-medium mb-1 text-amber-500">Recurrence</h4>
                          <p className="text-sm">{injury.recurrenceDetails}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Injury Risk Profile</h2>
              
              <Card className="bg-black/5 dark:bg-white/5 border-none shadow-md mb-4">
                <CardHeader className="pb-3">
                  <CardTitle>Risk Analysis</CardTitle>
                  <CardDescription>Based on history and profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Ankle Injuries</span>
                        <span className="text-sm font-medium text-amber-500">Moderate Risk</span>
                      </div>
                      <Progress value={65} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Knee Injuries</span>
                        <span className="text-sm font-medium text-red-500">High Risk</span>
                      </div>
                      <Progress value={85} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Back Injuries</span>
                        <span className="text-sm font-medium text-green-500">Low Risk</span>
                      </div>
                      <Progress value={25} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Shoulder Injuries</span>
                        <span className="text-sm font-medium text-green-500">Low Risk</span>
                      </div>
                      <Progress value={20} className="h-2 bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Personalized Prevention</CardTitle>
                  <CardDescription>Recommended focus areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-green-500/10 rounded-md border border-green-500/20">
                      <h4 className="text-sm font-semibold text-green-500 mb-1">High Priority</h4>
                      <p className="text-sm">Knee stability program focusing on proper landing mechanics and eccentric strength</p>
                    </div>
                    
                    <div className="p-3 bg-amber-500/10 rounded-md border border-amber-500/20">
                      <h4 className="text-sm font-semibold text-amber-500 mb-1">Medium Priority</h4>
                      <p className="text-sm">Ankle proprioception training to prevent recurring sprains</p>
                    </div>
                    
                    <div className="p-3 bg-blue-500/10 rounded-md border border-blue-500/20">
                      <h4 className="text-sm font-semibold text-blue-500 mb-1">Maintenance</h4>
                      <p className="text-sm">General mobility and core stability work</p>
                    </div>
                    
                    <Button className="w-full mt-3">
                      Generate Complete Prevention Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}