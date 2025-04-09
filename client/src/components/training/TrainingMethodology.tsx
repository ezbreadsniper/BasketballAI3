import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dumbbell, Brain, Clock, ActivitySquare, Heart, FlaskConical, CheckCircle } from 'lucide-react';

// Age groups for basketball training
const AGE_GROUPS = {
  youth: {
    name: "Youth (12-14)",
    description: "Focus on fundamentals, game-based learning, and proper technique",
    recommendations: [
      {
        id: 1,
        title: "Small-Sided Games Training",
        description: "Develop reaction ability through 2v2 games (3 sets of 2×2min45s with 2min recovery)",
        emphasis: "Reaction ability, decision making",
        cautions: "Maintain proper technique, avoid overexertion",
        icon: <ActivitySquare className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Fundamental Movement Skills",
        description: "Develop proper movement patterns with emphasis on technique before intensity",
        emphasis: "Body awareness, coordination, balance",
        cautions: "Avoid heavy weights, prioritize technique",
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Low-Intensity Plyometrics",
        description: "Basic jumping exercises with proper landing technique and low volume",
        emphasis: "Landing mechanics, basic explosive movement patterns",
        cautions: "Low impact, proper progression, technical focus",
        icon: <ActivitySquare className="h-5 w-5" />
      }
    ]
  },
  highSchool: {
    name: "High School (15-18)",
    description: "Balanced development with progressive intensity and technical refinement",
    recommendations: [
      {
        id: 1,
        title: "FITLIGHT Training System",
        description: "Technology-enhanced reaction training (4 sessions weekly) for significant agility improvements",
        emphasis: "Cognitive aspects of agility, reaction time",
        cautions: "Progress gradually in complexity",
        icon: <Brain className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Progressive Plyometric Training",
        description: "Multi-directional jumps with moderate intensity (2-3 sessions weekly)",
        emphasis: "Explosive power in all movement planes",
        cautions: "Monitor landing mechanics, adequate recovery between sessions",
        icon: <ActivitySquare className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Foundational Strength Development",
        description: "Basic resistance training with proper technique (2-3 sessions weekly)",
        emphasis: "Movement patterns, proper form, joint stability",
        cautions: "Technical mastery before intensity, supervised sessions",
        icon: <Dumbbell className="h-5 w-5" />
      }
    ]
  },
  college: {
    name: "College (19-22)",
    description: "Specialized training with position-specific focus and higher intensity",
    recommendations: [
      {
        id: 1,
        title: "Combined Training Approach",
        description: "Integration of reaction, speed, strength, and plyometric training for maximum effect",
        emphasis: "Comprehensive agility development, sport-specific application",
        cautions: "Balance training load, monitor fatigue",
        icon: <FlaskConical className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Position-Specific Training",
        description: "Tailored agility patterns based on perimeter vs. interior player needs",
        emphasis: "Game-specific movement patterns, positional requirements",
        cautions: "Balance specialization with comprehensive development",
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        id: 3,
        title: "High-Intensity Interval Training",
        description: "Structured HIT-COD training with 15s high-intensity/15s recovery intervals",
        emphasis: "Metabolic conditioning, basketball-specific energy systems",
        cautions: "Progressive intensity, careful monitoring of work:rest ratios",
        icon: <Heart className="h-5 w-5" />
      }
    ]
  },
  professional: {
    name: "Professional (23+)",
    description: "Elite performance training with individualized programming and advanced methods",
    recommendations: [
      {
        id: 1,
        title: "Individualized Training Programs",
        description: "Custom-designed training based on comprehensive player assessment data",
        emphasis: "Individual strengths/weaknesses, competition demands",
        cautions: "Regular reassessment, adaptation based on response",
        icon: <Brain className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Complex Integration Training",
        description: "Advanced combination of physical, technical, tactical, and mental training",
        emphasis: "Transfer to competition, performance specificity",
        cautions: "Recovery management, periodization across season",
        icon: <FlaskConical className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Advanced Neuromuscular Training",
        description: "Sophisticated reaction drills with complex decision-making elements",
        emphasis: "Elite cognitive-physical integration, anticipation",
        cautions: "Balance training novelty with established patterns",
        icon: <Brain className="h-5 w-5" />
      }
    ]
  }
};

// Training methods based on research
const TRAINING_METHODS = {
  reaction: {
    name: "Reaction Ability Training",
    description: "Improves capacity to respond quickly to stimuli, addressing cognitive/perceptual components of agility",
    methods: [
      {
        id: 1,
        title: "Small-Sided Games (SSG)",
        protocol: "3 sets of 2×2min45s with 2min recovery between sets",
        results: "7.2% improvement in modified agility T-test (large effect size)",
        suitable: "All age groups, particularly effective for youth players",
        icon: <ActivitySquare className="h-5 w-5" />
      },
      {
        id: 2,
        title: "FITLIGHT Training System",
        protocol: "8 weeks (4 sessions weekly) of light-based reaction training",
        results: "11-19% improvement in agility tests, significantly more effective than traditional methods",
        suitable: "High school through professional players",
        icon: <Brain className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Repeated Sprint Training (RST)",
        protocol: "3 sets of 6×20m sprints with 4min recovery between sets (8 weeks, 3 sessions weekly)",
        results: "Significant improvements in agility T-test performance (moderate effect size)",
        suitable: "College and professional players",
        icon: <Clock className="h-5 w-5" />
      }
    ]
  },
  speed: {
    name: "Speed Quality Training",
    description: "Addresses velocity component of agility, developing capacity to move quickly in multiple directions",
    methods: [
      {
        id: 1,
        title: "High-Intensity Interval Training with COD",
        protocol: "Intervals of 15s at 90% max speed alternated with 15s recovery",
        results: "1.2-14.4% improvement in agility over 4-8 weeks",
        suitable: "College and professional players",
        icon: <Clock className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Repeated Sprint Training with Directional Changes",
        protocol: "Linear speed development combined with planned direction changes",
        results: "Effective for developing transition speed between court positions",
        suitable: "High school through professional players",
        icon: <ActivitySquare className="h-5 w-5" />
      }
    ]
  },
  strength: {
    name: "Strength Quality Training",
    description: "Develops force production capabilities necessary for explosive movements and rapid direction changes",
    methods: [
      {
        id: 1,
        title: "Traditional Resistance Training",
        protocol: "Conventional weight training focusing on foundational strength",
        results: "1.41-10.33% improvement in agility over 4-8 weeks",
        suitable: "High school (basic), college and professional (advanced)",
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Functional Strength Training",
        protocol: "Training that mimics basketball-specific movement patterns",
        results: "Improved force production in game-relevant contexts",
        suitable: "All age groups (adjusted for appropriate resistance)",
        icon: <Dumbbell className="h-5 w-5" />
      },
      {
        id: 3,
        title: "Eccentric Training",
        protocol: "Emphasis on lowering phase to develop force absorption capacity",
        results: "Enhanced deceleration and direction change ability",
        suitable: "High school through professional players",
        icon: <Dumbbell className="h-5 w-5" />
      }
    ]
  },
  plyometric: {
    name: "Plyometric Training",
    description: "Emphasizes rapid stretch-contraction cycles to develop explosive power across movement planes",
    methods: [
      {
        id: 1,
        title: "Multi-directional Jumps",
        protocol: "Exercises across horizontal, sagittal, and frontal planes (2-3 sessions weekly)",
        results: "2.34-6.79% improvement in agility over 1-8 weeks",
        suitable: "Progressive intensity by age (low for youth, higher for older players)",
        icon: <ActivitySquare className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Surface Variation Training",
        protocol: "Plyometrics on various surfaces (wood, sand, grass)",
        results: "Improved neuromuscular adaptability and joint stability",
        suitable: "High school through professional (carefully monitored for youth)",
        icon: <ActivitySquare className="h-5 w-5" />
      }
    ]
  },
  combined: {
    name: "Combined Approach",
    description: "Integrates multiple training methods for comprehensive development and maximum results",
    methods: [
      {
        id: 1,
        title: "Integrated Agility Development",
        protocol: "Structured combination of reaction, speed, strength, and plyometric training",
        results: "Superior results compared to single-method approaches",
        suitable: "All age groups (with appropriate modifications)",
        icon: <CheckCircle className="h-5 w-5" />
      },
      {
        id: 2,
        title: "Position-Specific Integration",
        protocol: "Method combinations tailored to perimeter vs. interior player needs",
        results: "Optimized development based on positional demands",
        suitable: "College and professional players primarily",
        icon: <CheckCircle className="h-5 w-5" />
      }
    ]
  }
};

interface TrainingMethodologyProps {
  selectedAgeGroup: string;
  onAgeGroupChange: (value: string) => void;
  selectedMethodology: string;
  onMethodologyChange: (value: string) => void;
  onGenerateTrainingPlan: () => void;
}

export function TrainingMethodology({
  selectedAgeGroup,
  onAgeGroupChange,
  selectedMethodology,
  onMethodologyChange,
  onGenerateTrainingPlan
}: TrainingMethodologyProps) {
  const [activeTab, setActiveTab] = useState<string>("age-specific");
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="age-specific">Age-Specific Approaches</TabsTrigger>
          <TabsTrigger value="training-methods">Training Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="age-specific" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Age-Specific Training Approaches</h3>
            <Select value={selectedAgeGroup} onValueChange={onAgeGroupChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youth">Youth (12-14)</SelectItem>
                <SelectItem value="highSchool">High School (15-18)</SelectItem>
                <SelectItem value="college">College (19-22)</SelectItem>
                <SelectItem value="professional">Professional (23+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedAgeGroup && (
            <Card>
              <CardHeader>
                <CardTitle>{AGE_GROUPS[selectedAgeGroup as keyof typeof AGE_GROUPS].name}</CardTitle>
                <CardDescription>
                  {AGE_GROUPS[selectedAgeGroup as keyof typeof AGE_GROUPS].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-4">
                    {AGE_GROUPS[selectedAgeGroup as keyof typeof AGE_GROUPS].recommendations.map((rec) => (
                      <Card key={rec.id} className="border-l-4 border-l-primary">
                        <CardHeader className="py-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {rec.icon}
                              <CardTitle className="text-base">{rec.title}</CardTitle>
                            </div>
                            <Badge variant="outline" className="font-normal">
                              Recommended
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm">{rec.description}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Emphasis</h4>
                              <p className="text-xs">{rec.emphasis}</p>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Cautions</h4>
                              <p className="text-xs">{rec.cautions}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="training-methods" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Training Methodology Selection</h3>
            <Select value={selectedMethodology} onValueChange={onMethodologyChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select methodology" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reaction">Reaction Ability</SelectItem>
                <SelectItem value="speed">Speed Quality</SelectItem>
                <SelectItem value="strength">Strength Quality</SelectItem>
                <SelectItem value="plyometric">Plyometric</SelectItem>
                <SelectItem value="combined">Combined Approach</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedMethodology && (
            <Card>
              <CardHeader>
                <CardTitle>{TRAINING_METHODS[selectedMethodology as keyof typeof TRAINING_METHODS].name}</CardTitle>
                <CardDescription>
                  {TRAINING_METHODS[selectedMethodology as keyof typeof TRAINING_METHODS].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-4">
                    {TRAINING_METHODS[selectedMethodology as keyof typeof TRAINING_METHODS].methods.map((method) => (
                      <Card key={method.id} className="border-l-4 border-l-primary">
                        <CardHeader className="py-3">
                          <div className="flex items-center gap-2">
                            {method.icon}
                            <CardTitle className="text-base">{method.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-3">
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Protocol</h4>
                              <p className="text-sm">{method.protocol}</p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Results</h4>
                              <p className="text-sm">{method.results}</p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Suitable For</h4>
                              <p className="text-sm">{method.suitable}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={onGenerateTrainingPlan}>
                  Generate Training Plan
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}