import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Ruler, FileSpreadsheet, ArrowRight, CheckCircle, Dumbbell, Brain, TrendingUp, BarChartHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 0-20 scale interpretation
const SCALE_INTERPRETATION = [
  { range: "0-4", description: "Substantially below minimum standard for competitive play" },
  { range: "5-9", description: "Basic competency, minimum baseline for competitive participation" },
  { range: "10-14", description: "Average to above-average performance for competition level" },
  { range: "15-19", description: "High-level performance, top 25% at competition level" },
  { range: "20", description: "Elite/exceptional, top 1% performance" }
];

// Position-specific attribute weightings (from document)
const POSITION_WEIGHTINGS = {
  "PG": {
    name: "Point Guard",
    weightings: {
      "Ball Handling": 0.15,
      "Passing": 0.15,
      "Speed/Acceleration": 0.15,
      "Basketball IQ/Decision Making": 0.20,
      "Shooting": 0.15,
      "Other attributes": 0.20
    }
  },
  "SG": {
    name: "Shooting Guard",
    weightings: {
      "Shooting": 0.20,
      "Offensive Movement": 0.15,
      "Speed/Acceleration": 0.15,
      "Scoring-related attributes": 0.20,
      "Defensive attributes": 0.15,
      "Other attributes": 0.15
    }
  },
  "SF": {
    name: "Small Forward",
    weightings: {
      "Shooting": 0.15,
      "Athleticism": 0.20,
      "Versatility-related attributes": 0.20,
      "Defensive attributes": 0.15,
      "Offensive skills": 0.15,
      "Other attributes": 0.15
    }
  },
  "PF": {
    name: "Power Forward",
    weightings: {
      "Strength": 0.15,
      "Rebounding-related attributes": 0.15,
      "Inside scoring": 0.15,
      "Defensive attributes": 0.20,
      "Versatility": 0.15,
      "Other attributes": 0.20
    }
  },
  "C": {
    name: "Center",
    weightings: {
      "Height/Wingspan": 0.15,
      "Strength": 0.15,
      "Rebounding-related attributes": 0.15,
      "Interior defense": 0.20,
      "Post skills": 0.15,
      "Other attributes": 0.20
    }
  }
};

// Measurement protocols based on the document
const MEASUREMENT_PROTOCOLS = {
  physical: {
    name: "Physical Measurements",
    description: "Standardized protocols for measuring physical attributes",
    protocols: [
      {
        attribute: "Height",
        protocol: "Use wall-mounted stadiometer with player barefoot and standing with proper posture. Measure in the morning to control for diurnal variation.",
        equipment: "Wall-mounted stadiometer",
        units: "cm/inches",
        frequency: "Pre-season, mid-season"
      },
      {
        attribute: "Weight",
        protocol: "Use calibrated digital scales under consistent conditions (morning, post-void, pre-breakfast) to minimize fluctuation variables. Players wear lightweight athletic attire.",
        equipment: "Calibrated digital scale",
        units: "kg/lbs",
        frequency: "Weekly monitoring"
      },
      {
        attribute: "Wingspan",
        protocol: "Measure from fingertip to fingertip with arms extended horizontally, perpendicular to the body. Maintain level shoulders during measurement.",
        equipment: "Anthropometric tape",
        units: "cm/inches",
        frequency: "Pre-season"
      },
      {
        attribute: "Body Composition",
        protocol: "Measure body fat percentage using standardized technique. Same technician should perform all measurements for consistency.",
        equipment: "Skinfold calipers or bioelectrical impedance device",
        units: "% body fat",
        frequency: "Monthly"
      }
    ]
  },
  technical: {
    name: "Technical Skill Assessment",
    description: "Basketball-specific skill evaluation protocols",
    protocols: [
      {
        attribute: "Shooting",
        protocol: "Multi-component assessment including: spot shooting from five locations (10 attempts each), off-dribble shooting series, three-point efficiency, and form evaluation.",
        equipment: "Basketball court, balls, shot tracking system (optional)",
        units: "Effectiveness % and form score (1-5)",
        frequency: "Monthly"
      },
      {
        attribute: "Ball Handling",
        protocol: "Timed dribble course completion with standardized obstacles, two-ball handling drills, pressure handling against defensive opposition, and advanced move execution.",
        equipment: "Basketball court, balls, cones, stopwatch",
        units: "Time (seconds) and technique score (1-5)",
        frequency: "Monthly"
      },
      {
        attribute: "Passing",
        protocol: "Stationary and moving passing accuracy drills to targets, decision-making scenarios in 2v1/3v2 situations, and pass selection assessment in game contexts.",
        equipment: "Court, balls, targets, partners",
        units: "Accuracy % and decision score (1-5)",
        frequency: "Monthly"
      },
      {
        attribute: "Free Throws",
        protocol: "Assessment of both efficiency and consistency with standardized routine. Minimum 20 attempts under practice conditions and tracked game performance.",
        equipment: "Basketball court, balls, shot tracking system (optional)",
        units: "Percentage",
        frequency: "Weekly tracking"
      }
    ]
  },
  athletic: {
    name: "Athletic Performance Testing",
    description: "Standardized performance tests for physical capabilities",
    protocols: [
      {
        attribute: "Speed",
        protocol: "Timed three-quarter court sprint (baseline to opposite free-throw line) using electronic timing gates. Best time recorded from three attempts.",
        equipment: "Electronic timing gates, basketball court",
        units: "Seconds (to hundredth)",
        frequency: "Monthly"
      },
      {
        attribute: "Acceleration",
        protocol: "First 10-meter split time from speed test, isolating initial burst capability. Values recorded to hundredth of a second for precision.",
        equipment: "Electronic timing gates, basketball court",
        units: "Seconds (to hundredth)",
        frequency: "Monthly"
      },
      {
        attribute: "Agility",
        protocol: "Lane agility drill time measuring the ability to move laterally, forward, and backward around the paint area. Electronic timing ensures accuracy.",
        equipment: "Electronic timing gates, basketball court, cones",
        units: "Seconds (to hundredth)",
        frequency: "Monthly"
      },
      {
        attribute: "Vertical Jump",
        protocol: "Measurement using Vertec device or force plate technology. Both standing and approach jump heights are recorded.",
        equipment: "Vertec device or force plate",
        units: "Inches/cm",
        frequency: "Monthly"
      },
      {
        attribute: "Strength",
        protocol: "Composite assessment including weight room metrics (bench press repetitions at standardized weight) and functional strength tests (medicine ball throw distance).",
        equipment: "Weight room equipment, medicine balls",
        units: "Repetitions and distance (ft/m)",
        frequency: "Monthly"
      }
    ]
  },
  mental: {
    name: "Mental/Cognitive Evaluation",
    description: "Assessment of basketball's mental aspects",
    protocols: [
      {
        attribute: "Basketball IQ",
        protocol: "Video scenario analysis with multiple-choice response evaluation, basketball concepts understanding questionnaire, and coach evaluation of play recognition ability.",
        equipment: "Video equipment, questionnaires, evaluation forms",
        units: "Score (0-20 scale)",
        frequency: "Quarterly"
      },
      {
        attribute: "Decision Making",
        protocol: "Simulated game scenarios with decision points and time pressure, efficiency in making correct pass/shoot/dribble decisions in competitive settings.",
        equipment: "Video equipment, court, players",
        units: "Correct decision % and time (ms)",
        frequency: "Monthly"
      },
      {
        attribute: "Composure",
        protocol: "Performance under artificial pressure situations, recovery response following mistakes/failures, and consistency in late-game/clutch situations.",
        equipment: "Game/practice observation, pressure simulation drills",
        units: "Score (0-20 scale)",
        frequency: "Monthly game analysis"
      },
      {
        attribute: "Leadership",
        protocol: "Peer evaluation, coach assessment, game situation observation focusing on communication, influence, and team direction abilities.",
        equipment: "Evaluation forms, observation",
        units: "Score (0-20 scale)",
        frequency: "Quarterly"
      }
    ]
  }
};

interface AttributeMeasurementProps {
  onRecordMeasurement: (attribute: string, value: number) => void;
  currentAssessmentType: string;
  onAssessmentTypeChange: (value: string) => void;
  isRecordingMeasurement: boolean;
  onToggleRecording: () => void;
  temporaryMeasurements: {[key: string]: number};
  onTemporaryMeasurementChange: (attribute: string, value: number) => void;
  onSaveMeasurements: () => void;
}

export function AttributeMeasurement({
  onRecordMeasurement,
  currentAssessmentType,
  onAssessmentTypeChange,
  isRecordingMeasurement,
  onToggleRecording,
  temporaryMeasurements,
  onTemporaryMeasurementChange,
  onSaveMeasurements
}: AttributeMeasurementProps) {
  const [selectedAttribute, setSelectedAttribute] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("protocols");
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="protocols">Measurement Protocols</TabsTrigger>
          <TabsTrigger value="weightings">Position Weightings</TabsTrigger>
          <TabsTrigger value="scale">0-20 Scale</TabsTrigger>
        </TabsList>
        
        <TabsContent value="protocols" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Assessment Protocols
            </h3>
            <Select value={currentAssessmentType} onValueChange={onAssessmentTypeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="athletic">Athletic</SelectItem>
                <SelectItem value="mental">Mental/Cognitive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {currentAssessmentType && (
            <Card>
              <CardHeader>
                <CardTitle>{MEASUREMENT_PROTOCOLS[currentAssessmentType as keyof typeof MEASUREMENT_PROTOCOLS].name}</CardTitle>
                <CardDescription>
                  {MEASUREMENT_PROTOCOLS[currentAssessmentType as keyof typeof MEASUREMENT_PROTOCOLS].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-4">
                    {MEASUREMENT_PROTOCOLS[currentAssessmentType as keyof typeof MEASUREMENT_PROTOCOLS].protocols.map((protocol, index) => (
                      <Card 
                        key={index} 
                        className={`border-l-4 ${selectedAttribute === protocol.attribute ? 'border-l-primary ring-1 ring-primary' : 'border-l-muted'}`}
                        onClick={() => setSelectedAttribute(protocol.attribute)}
                      >
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center gap-2">
                              <Ruler className="h-4 w-4" />
                              {protocol.attribute}
                            </CardTitle>
                            {isRecordingMeasurement && selectedAttribute === protocol.attribute && (
                              <Badge variant="outline" className="font-normal bg-primary/10">
                                Recording
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-xs font-semibold uppercase text-muted-foreground">Protocol</h4>
                              <p className="text-sm">{protocol.protocol}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Equipment</h4>
                                <p className="text-xs">{protocol.equipment}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Units</h4>
                                <p className="text-xs">{protocol.units}</p>
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground">Frequency</h4>
                                <p className="text-xs">{protocol.frequency}</p>
                              </div>
                            </div>
                            {isRecordingMeasurement && selectedAttribute === protocol.attribute && (
                              <div className="mt-3 pt-3 border-t">
                                <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Record Measurement</h4>
                                
                                <div className="flex items-end gap-2">
                                  <div className="flex-1">
                                    <Label htmlFor="raw-measurement">Raw Measurement</Label>
                                    <Input 
                                      id="raw-measurement" 
                                      type="text" 
                                      placeholder="Enter raw value" 
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <Label htmlFor="normalized-score">Normalized Score (0-20)</Label>
                                    <Input 
                                      id="normalized-score" 
                                      type="number" 
                                      min="0" 
                                      max="20" 
                                      value={temporaryMeasurements[protocol.attribute] || ''}
                                      onChange={(e) => onTemporaryMeasurementChange(protocol.attribute, parseInt(e.target.value))} 
                                    />
                                  </div>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="mb-0.5"
                                    onClick={() => onRecordMeasurement(protocol.attribute, temporaryMeasurements[protocol.attribute] || 0)}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Record
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="flex gap-3 justify-between">
                <Button 
                  variant={isRecordingMeasurement ? "destructive" : "default"} 
                  onClick={onToggleRecording} 
                  className="flex-1"
                >
                  {isRecordingMeasurement ? "Cancel Recording" : "Start Recording"}
                </Button>
                {isRecordingMeasurement && (
                  <Button 
                    variant="default" 
                    onClick={onSaveMeasurements}
                    className="flex-1"
                  >
                    Save All Measurements
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="weightings" className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChartHorizontal className="h-5 w-5" />
            Position-Specific Attribute Weightings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(POSITION_WEIGHTINGS).map(([key, position]) => (
              <Card key={key} className="flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{position.name} ({key})</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 py-2">
                  <div className="space-y-3">
                    {Object.entries(position.weightings).map(([attribute, weight]) => (
                      <div key={attribute} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{attribute}</span>
                          <span className="text-sm font-medium">{Math.round(weight * 100)}%</span>
                        </div>
                        <Progress value={weight * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="scale" className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            0-20 Score Interpretation
          </h3>
          
          <Card>
            <CardHeader>
              <CardTitle>Standardized Interpretation Framework</CardTitle>
              <CardDescription>
                The 0-20 scale follows a standardized interpretation framework for consistent evaluation of player attributes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SCALE_INTERPRETATION.map((level, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-16 h-16 rounded-md flex items-center justify-center bg-primary/10 border">
                      <span className="text-lg font-bold">{level.range}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{level.description}</p>
                      <Progress 
                        value={index === 4 ? 100 : (index + 1) * 20} 
                        className="h-2 mt-2" 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Star Rating Conversion</CardTitle>
              <CardDescription>
                The overall player rating is converted to a 5-star system with half-star increments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                <Card className="border-primary/50">
                  <CardHeader className="py-2 text-center">
                    <span className="font-bold text-lg">★☆☆☆☆</span>
                  </CardHeader>
                  <CardContent className="py-2 text-center">
                    <p className="text-sm font-medium">0-19</p>
                    <p className="text-xs text-muted-foreground">Far below standard</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/50">
                  <CardHeader className="py-2 text-center">
                    <span className="font-bold text-lg">★★☆☆☆</span>
                  </CardHeader>
                  <CardContent className="py-2 text-center">
                    <p className="text-sm font-medium">20-39</p>
                    <p className="text-xs text-muted-foreground">Below average</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/50">
                  <CardHeader className="py-2 text-center">
                    <span className="font-bold text-lg">★★★☆☆</span>
                  </CardHeader>
                  <CardContent className="py-2 text-center">
                    <p className="text-sm font-medium">40-59</p>
                    <p className="text-xs text-muted-foreground">Average player</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/50">
                  <CardHeader className="py-2 text-center">
                    <span className="font-bold text-lg">★★★★☆</span>
                  </CardHeader>
                  <CardContent className="py-2 text-center">
                    <p className="text-sm font-medium">60-79</p>
                    <p className="text-xs text-muted-foreground">Above average</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/50">
                  <CardHeader className="py-2 text-center">
                    <span className="font-bold text-lg">★★★★★</span>
                  </CardHeader>
                  <CardContent className="py-2 text-center">
                    <p className="text-sm font-medium">80-100</p>
                    <p className="text-xs text-muted-foreground">Elite talent</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}