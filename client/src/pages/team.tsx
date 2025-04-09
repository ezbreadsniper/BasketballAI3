import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Settings, 
  ChevronRight,
  ChevronDown, 
  Calendar, 
  Users, 
  Star, 
  Heart,
  Play,
  Pause,
  Save,
  Plus,
  ArrowRight,
  MousePointer,
  Circle,
  Square,
  ArrowUpRight,
  X,
  HelpCircle,
  Clipboard,
  Briefcase,
  Shield,
  ChevronUp,
  Gauge,
  BarChart2,
  ArrowUpDown,
  FileText,
  Medal,
  Activity,
  Clock,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

// Types
type Player = {
  id: number;
  number: number;
  name: string;
  position: string;
  age: number;
  height: string;
  attributes: {
    technical: number;
    mental: number;
    physical: number;
  };
  personality: string;
  condition: string;
  value: string;
  rating: number;
};

type PositionData = {
  id: number;
  position: string;
  x: string;
  y: string;
  playerId: number;
};

type FormationData = {
  starting: PositionData[];
  bench: {
    id: number;
    position: string;
    playerId: number;
  }[];
};

type DrawingObject = {
  id: string;
  type: 'arrow' | 'circle' | 'square' | 'line';
  points: { x: number; y: number }[];
  color: string;
};

type NBAPlay = {
  id: number;
  name: string;
  description: string;
  animation: {
    frames: {
      positions: { id: number; x: string; y: string }[];
      arrows: DrawingObject[];
    }[];
  };
};

// Draggable player component
const DraggablePlayer = ({ player, position, index }: { player: Player; position: PositionData; index: number }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { id: player.id, position: position.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <motion.div 
      ref={drag}
      className={`absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ 
        top: position.y, 
        left: position.x,
        zIndex: isDragging ? 100 : 10
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.1 }}
    >
      <div className="flex flex-col items-center select-none">
        <div className="glass-panel bg-gradient-to-br from-amber-400 to-amber-600 w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-sm mb-1 shadow-lg hover-glow border-2 border-amber-300">
          {player.number}
        </div>
        <div className="text-white text-xs font-semibold bg-black bg-opacity-80 backdrop-blur-sm px-2 py-0.5 rounded-sm shadow-sm">
          {player.name.split(' ').pop()}
        </div>
        <div className="text-white text-[10px] bg-primary bg-opacity-90 backdrop-blur-sm px-1.5 rounded-sm">
          {position.position}
        </div>
      </div>
    </motion.div>
  );
};

// Court drop zone
const CourtDropZone = ({ onDrop, children }: { onDrop: (item: any, position: { x: string; y: string }) => void; children: React.ReactNode }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'player',
    drop: (item: any, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;
      
      const dropTargetRect = (document.getElementById('court') as HTMLElement).getBoundingClientRect();
      const x = ((offset.x - dropTargetRect.left) / dropTargetRect.width) * 100 + '%';
      const y = ((offset.y - dropTargetRect.top) / dropTargetRect.height) * 100 + '%';
      
      onDrop(item, { x, y });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div 
      id="court"
      ref={drop} 
      className={`relative h-[550px] basketball-court rounded-sm overflow-hidden ${isOver ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
    >
      {children}
    </div>
  );
};

// Bench draggable player
const BenchPlayer = ({ player, position }: { player: Player; position: { id: number; position: string }; }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { id: player.id, position: position.id, fromBench: true },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <motion.div 
      ref={drag}
      className={`bg-neutral-800 border border-neutral-700 p-2 rounded-sm flex flex-col items-center hover:bg-neutral-700 transition-colors ${isDragging ? 'opacity-50' : 'opacity-100'} cursor-grab`}
      whileHover={{ y: -3, boxShadow: "0 5px 10px rgba(0,0,0,0.3)" }}
    >
      <div className="bg-gradient-to-b from-amber-500 to-amber-600 w-8 h-8 rounded-full flex items-center justify-center text-black text-xs mb-1 shadow font-bold border border-amber-300">
        {player.number}
      </div>
      <div className="text-neutral-200 text-xs text-center font-semibold">
        {player.name.split(' ').pop()}
      </div>
      <div className="text-primary text-[10px] font-medium">{position.position}</div>
    </motion.div>
  );
};

// Drawing Tool component
const DrawingTool = ({ 
  activeTool, 
  color, 
  drawings, 
  onDrawingComplete 
}: { 
  activeTool: string | null;
  color: string;
  drawings: DrawingObject[];
  onDrawingComplete: (drawing: DrawingObject) => void;
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const courtRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeTool || !courtRef.current) return;
    
    const rect = courtRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setCurrentPoints([{ x, y }]);
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !courtRef.current) return;
    
    const rect = courtRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    if (activeTool === 'arrow' || activeTool === 'line') {
      // For arrows and lines, we only need start and end points
      setCurrentPoints([currentPoints[0], { x, y }]);
    } else {
      // For other shapes, we might want to capture the movement path
      setCurrentPoints([...currentPoints, { x, y }]);
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !activeTool) return;
    
    const newDrawing: DrawingObject = {
      id: `drawing-${Date.now()}`,
      type: activeTool as 'arrow' | 'circle' | 'square' | 'line',
      points: currentPoints,
      color
    };
    
    onDrawingComplete(newDrawing);
    setIsDrawing(false);
    setCurrentPoints([]);
  };

  const renderDrawing = (drawing: DrawingObject) => {
    switch(drawing.type) {
      case 'arrow': {
        if (drawing.points.length < 2) return null;
        
        const [start, end] = drawing.points;
        const courtWidth = courtRef.current?.clientWidth || 0;
        const courtHeight = courtRef.current?.clientHeight || 0;
        
        // Calculate arrow angle
        const angle = Math.atan2(
          (end.y - start.y) * courtHeight, 
          (end.x - start.x) * courtWidth
        );
        
        return (
          <motion.svg 
            key={drawing.id}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.line
              className="play-arrow"
              x1={start.x * 100 + '%'}
              y1={start.y * 100 + '%'}
              x2={end.x * 100 + '%'}
              y2={end.y * 100 + '%'}
              stroke={drawing.color}
              strokeWidth={3}
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={drawing.color}
                />
              </marker>
            </defs>
          </motion.svg>
        );
      }
        
      case 'circle': {
        if (drawing.points.length < 2) return null;
        
        const circleCenter = drawing.points[0];
        const circlePoint = drawing.points[drawing.points.length - 1];
        const radius = Math.sqrt(
          Math.pow((circlePoint.x - circleCenter.x) * (courtRef.current?.clientWidth || 0), 2) +
          Math.pow((circlePoint.y - circleCenter.y) * (courtRef.current?.clientHeight || 0), 2)
        );
        
        return (
          <motion.div
            key={drawing.id}
            className="absolute rounded-full border-2 pointer-events-none"
            style={{
              left: `calc(${circleCenter.x * 100}% - ${radius}px)`,
              top: `calc(${circleCenter.y * 100}% - ${radius}px)`,
              width: `${radius * 2}px`,
              height: `${radius * 2}px`,
              borderColor: drawing.color
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        );
      }
        
      case 'square': {
        if (drawing.points.length < 2) return null;
        
        const squareStart = drawing.points[0];
        const squareEnd = drawing.points[drawing.points.length - 1];
        
        // Calculate square dimensions
        const left = Math.min(squareStart.x, squareEnd.x) * 100 + '%';
        const top = Math.min(squareStart.y, squareEnd.y) * 100 + '%';
        const squareWidth = Math.abs(squareEnd.x - squareStart.x) * 100 + '%';
        const squareHeight = Math.abs(squareEnd.y - squareStart.y) * 100 + '%';
        
        return (
          <motion.div
            key={drawing.id}
            className="absolute border-2 pointer-events-none"
            style={{
              left,
              top,
              width: squareWidth,
              height: squareHeight,
              borderColor: drawing.color
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        );
      }
        
      case 'line': {
        if (drawing.points.length < 2) return null;
        
        const [lineStart, lineEnd] = drawing.points;
        
        return (
          <motion.svg 
            key={drawing.id}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.line
              x1={lineStart.x * 100 + '%'}
              y1={lineStart.y * 100 + '%'}
              x2={lineEnd.x * 100 + '%'}
              y2={lineEnd.y * 100 + '%'}
              stroke={drawing.color}
              strokeWidth={2}
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.svg>
        );
      }
        
      default:
        return null;
    }
  };

  return (
    <div 
      ref={courtRef}
      className="absolute top-0 left-0 w-full h-full"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDrawing(false)}
    >
      {/* Current drawing preview */}
      {isDrawing && activeTool && renderDrawing({
        id: 'preview',
        type: activeTool as 'arrow' | 'circle' | 'square' | 'line',
        points: currentPoints,
        color
      })}
      
      {/* Existing drawings */}
      {drawings.map(drawing => renderDrawing(drawing))}
    </div>
  );
};

export default function Team() {
  // Players data
  const players = [
    { 
      id: 1, 
      number: 1, 
      name: "S. Angelo Garcia", 
      position: "PG", 
      age: 19, 
      height: "6'2\"",
      attributes: {
        technical: 16,
        mental: 15,
        physical: 14
      },
      personality: "Determined",
      condition: "Fit",
      value: "$45K",
      rating: 4.5
    },
    { 
      id: 2, 
      number: 5, 
      name: "J. Andy Smith", 
      position: "SG", 
      age: 20, 
      height: "6'4\"",
      attributes: {
        technical: 15,
        mental: 14,
        physical: 14
      },
      personality: "Model Professional",
      condition: "Fit",
      value: "$50K",
      rating: 4
    },
    { 
      id: 3, 
      number: 7, 
      name: "B. Ryan Harvey", 
      position: "SF", 
      age: 22, 
      height: "6'7\"",
      attributes: {
        technical: 13,
        mental: 12,
        physical: 16
      },
      personality: "Determined",
      condition: "Fit",
      value: "$60K",
      rating: 3.5
    },
    { 
      id: 4, 
      number: 14, 
      name: "R. Mike Miller", 
      position: "PF", 
      age: 23, 
      height: "6'8\"",
      attributes: {
        technical: 12,
        mental: 13,
        physical: 15
      },
      personality: "Team Player",
      condition: "Fit",
      value: "$55K",
      rating: 3
    },
    { 
      id: 5, 
      number: 21, 
      name: "C. Gabriel Grant", 
      position: "C", 
      age: 24, 
      height: "6'11\"",
      attributes: {
        technical: 13,
        mental: 12,
        physical: 16
      },
      personality: "Ambitious",
      condition: "Light Injury (3d)",
      value: "$65K",
      rating: 3.5
    },
    { 
      id: 6, 
      number: 8, 
      name: "G. Sean Tygart", 
      position: "PG", 
      age: 19, 
      height: "6'1\"",
      attributes: {
        technical: 13,
        mental: 14,
        physical: 12
      },
      personality: "Professional",
      condition: "Fit",
      value: "$35K",
      rating: 3
    },
    { 
      id: 7, 
      number: 11, 
      name: "B. Jeremy Long", 
      position: "SG", 
      age: 21, 
      height: "6'5\"",
      attributes: {
        technical: 12,
        mental: 14,
        physical: 13
      },
      personality: "Team Player",
      condition: "Fit",
      value: "$30K",
      rating: 3
    },
    { 
      id: 8, 
      number: 20, 
      name: "L. Denieroson", 
      position: "PF", 
      age: 20, 
      height: "6'9\"",
      attributes: {
        technical: 11,
        mental: 12,
        physical: 15
      },
      personality: "Low Determination",
      condition: "Fit",
      value: "$25K",
      rating: 2.5
    },
    { 
      id: 9, 
      number: 45, 
      name: "Q. Drew Duffy", 
      position: "SF", 
      age: 22, 
      height: "6'6\"",
      attributes: {
        technical: 11,
        mental: 13,
        physical: 13
      },
      personality: "Balanced",
      condition: "Fit",
      value: "$30K",
      rating: 2.5
    },
    { 
      id: 10, 
      number: 32, 
      name: "F. Iver Iverson", 
      position: "C", 
      age: 25, 
      height: "7'0\"",
      attributes: {
        technical: 10,
        mental: 11,
        physical: 14
      },
      personality: "Balanced",
      condition: "Fit",
      value: "$40K",
      rating: 2.5
    }
  ];

  // State for court players and bench players
  const [formations, setFormations] = useState<FormationData>({
    starting: [
      { id: 1, position: "PG", x: "50%", y: "85%", playerId: 1 },
      { id: 2, position: "SG", x: "25%", y: "70%", playerId: 2 },
      { id: 3, position: "SF", x: "75%", y: "70%", playerId: 3 },
      { id: 4, position: "PF", x: "35%", y: "35%", playerId: 4 },
      { id: 5, position: "C", x: "50%", y: "15%", playerId: 5 }
    ],
    bench: [
      { id: 6, position: "PG", playerId: 6 },
      { id: 7, position: "SG", playerId: 7 },
      { id: 8, position: "PF", playerId: 8 },
      { id: 9, position: "SF", playerId: 9 },
      { id: 10, position: "C", playerId: 10 }
    ]
  });

  // NBA plays library
  const nbaPlays: NBAPlay[] = [
    {
      id: 1,
      name: "Pick and Roll",
      description: "Basic pick and roll play with screener and ball handler",
      animation: {
        frames: [
          {
            positions: [
              { id: 1, x: "50%", y: "85%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "35%", y: "35%" },
              { id: 5, x: "50%", y: "15%" }
            ],
            arrows: []
          },
          {
            positions: [
              { id: 1, x: "45%", y: "75%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "45%", y: "65%" },
              { id: 5, x: "50%", y: "15%" }
            ],
            arrows: [
              {
                id: "arrow-1",
                type: "arrow",
                points: [
                  { x: 0.5, y: 0.85 },
                  { x: 0.45, y: 0.75 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "35%", y: "65%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "50%", y: "55%" },
              { id: 5, x: "50%", y: "15%" }
            ],
            arrows: [
              {
                id: "arrow-2",
                type: "arrow",
                points: [
                  { x: 0.45, y: 0.75 },
                  { x: 0.35, y: 0.65 }
                ],
                color: "#3b82f6"
              },
              {
                id: "arrow-3",
                type: "arrow",
                points: [
                  { x: 0.45, y: 0.65 },
                  { x: 0.50, y: 0.55 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "30%", y: "55%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "40%", y: "40%" },
              { id: 5, x: "50%", y: "15%" }
            ],
            arrows: [
              {
                id: "arrow-4",
                type: "arrow",
                points: [
                  { x: 0.35, y: 0.65 },
                  { x: 0.30, y: 0.55 }
                ],
                color: "#3b82f6"
              },
              {
                id: "arrow-5",
                type: "arrow",
                points: [
                  { x: 0.50, y: 0.55 },
                  { x: 0.40, y: 0.40 }
                ],
                color: "#3b82f6"
              }
            ]
          }
        ]
      }
    },
    {
      id: 2,
      name: "Triangle Offense",
      description: "Classic triangle offense formation and movement",
      animation: {
        frames: [
          {
            positions: [
              { id: 1, x: "50%", y: "85%" },
              { id: 2, x: "20%", y: "50%" },
              { id: 3, x: "80%", y: "50%" },
              { id: 4, x: "35%", y: "20%" },
              { id: 5, x: "65%", y: "20%" }
            ],
            arrows: []
          },
          {
            positions: [
              { id: 1, x: "35%", y: "75%" },
              { id: 2, x: "20%", y: "50%" },
              { id: 3, x: "80%", y: "50%" },
              { id: 4, x: "35%", y: "20%" },
              { id: 5, x: "65%", y: "20%" }
            ],
            arrows: [
              {
                id: "arrow-1",
                type: "arrow",
                points: [
                  { x: 0.5, y: 0.85 },
                  { x: 0.35, y: 0.75 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "35%", y: "75%" },
              { id: 2, x: "20%", y: "50%" },
              { id: 3, x: "65%", y: "65%" },
              { id: 4, x: "35%", y: "20%" },
              { id: 5, x: "65%", y: "20%" }
            ],
            arrows: [
              {
                id: "arrow-2",
                type: "arrow",
                points: [
                  { x: 0.8, y: 0.5 },
                  { x: 0.65, y: 0.65 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "35%", y: "75%" },
              { id: 2, x: "20%", y: "50%" },
              { id: 3, x: "65%", y: "65%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "65%", y: "20%" }
            ],
            arrows: [
              {
                id: "arrow-3",
                type: "arrow",
                points: [
                  { x: 0.35, y: 0.2 },
                  { x: 0.35, y: 0.4 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "35%", y: "75%" },
              { id: 2, x: "35%", y: "60%" },
              { id: 3, x: "65%", y: "65%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "65%", y: "20%" }
            ],
            arrows: [
              {
                id: "arrow-4",
                type: "arrow",
                points: [
                  { x: 0.2, y: 0.5 },
                  { x: 0.35, y: 0.6 }
                ],
                color: "#3b82f6"
              }
            ]
          }
        ]
      }
    },
    {
      id: 3,
      name: "Horns Set",
      description: "Horns set with double high screen and roll",
      animation: {
        frames: [
          {
            positions: [
              { id: 1, x: "50%", y: "85%" },
              { id: 2, x: "20%", y: "70%" },
              { id: 3, x: "80%", y: "70%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "65%", y: "40%" }
            ],
            arrows: []
          },
          {
            positions: [
              { id: 1, x: "50%", y: "75%" },
              { id: 2, x: "20%", y: "70%" },
              { id: 3, x: "80%", y: "70%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "65%", y: "40%" }
            ],
            arrows: [
              {
                id: "arrow-1",
                type: "arrow",
                points: [
                  { x: 0.5, y: 0.85 },
                  { x: 0.5, y: 0.75 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "50%", y: "60%" },
              { id: 2, x: "20%", y: "70%" },
              { id: 3, x: "80%", y: "70%" },
              { id: 4, x: "35%", y: "45%" },
              { id: 5, x: "65%", y: "45%" }
            ],
            arrows: [
              {
                id: "arrow-2",
                type: "arrow",
                points: [
                  { x: 0.5, y: 0.75 },
                  { x: 0.5, y: 0.6 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "50%", y: "60%" },
              { id: 2, x: "20%", y: "50%" },
              { id: 3, x: "80%", y: "50%" },
              { id: 4, x: "35%", y: "45%" },
              { id: 5, x: "65%", y: "45%" }
            ],
            arrows: [
              {
                id: "arrow-3",
                type: "arrow",
                points: [
                  { x: 0.2, y: 0.7 },
                  { x: 0.2, y: 0.5 }
                ],
                color: "#3b82f6"
              },
              {
                id: "arrow-4",
                type: "arrow",
                points: [
                  { x: 0.8, y: 0.7 },
                  { x: 0.8, y: 0.5 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "35%", y: "50%" },
              { id: 2, x: "20%", y: "50%" },
              { id: 3, x: "80%", y: "50%" },
              { id: 4, x: "40%", y: "40%" },
              { id: 5, x: "60%", y: "40%" }
            ],
            arrows: [
              {
                id: "arrow-5",
                type: "arrow",
                points: [
                  { x: 0.5, y: 0.6 },
                  { x: 0.35, y: 0.5 }
                ],
                color: "#3b82f6"
              }
            ]
          }
        ]
      }
    }
  ];

  // State
  const [activeTab, setActiveTab] = useState('tactics');
  const [selectedPlay, setSelectedPlay] = useState<NBAPlay | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [drawings, setDrawings] = useState<DrawingObject[]>([]);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState('#3b82f6'); // Default blue

  // Animation interval ref
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  // Clear animation on component unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Handle player drop on court
  const handlePlayerDrop = (item: any, newPosition: { x: string; y: string }) => {
    // Find the player
    const player = getPlayerById(item.id);
    if (!player) return;
    
    // Update formations
    setFormations(prev => {
      let newFormations = { ...prev };
      
      if (item.fromBench) {
        // Remove from bench
        const benchIndex = newFormations.bench.findIndex(p => p.playerId === item.id);
        if (benchIndex >= 0) {
          const [removed] = newFormations.bench.splice(benchIndex, 1);
          
          // Add to court
          const newPositionId = Date.now(); // Generate unique ID
          newFormations.starting.push({
            id: newPositionId,
            position: removed.position,
            x: newPosition.x,
            y: newPosition.y,
            playerId: item.id
          });
        }
      } else {
        // Update existing court position
        const posIndex = newFormations.starting.findIndex(p => p.id === item.position);
        if (posIndex >= 0) {
          newFormations.starting[posIndex] = {
            ...newFormations.starting[posIndex],
            x: newPosition.x,
            y: newPosition.y
          };
        }
      }
      
      return newFormations;
    });
  };

  // Start play animation
  const startPlayAnimation = () => {
    if (!selectedPlay || isAnimating) return;
    
    setIsAnimating(true);
    setAnimationFrame(0);
    
    // Clear previous animation if exists
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    
    // Run animation frames
    animationRef.current = setInterval(() => {
      setAnimationFrame(prev => {
        const nextFrame = prev + 1;
        if (nextFrame >= selectedPlay.animation.frames.length) {
          // Animation complete
          if (animationRef.current) {
            clearInterval(animationRef.current);
          }
          setIsAnimating(false);
          return 0;
        }
        return nextFrame;
      });
    }, 1000); // 1 second per frame
  };

  // Stop play animation
  const stopPlayAnimation = () => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }
    setIsAnimating(false);
    setAnimationFrame(0);
    
    // Reset to initial positions
    if (selectedPlay) {
      updatePositionsFromPlay(selectedPlay, 0);
    }
  };

  // Update positions from play animation frame
  const updatePositionsFromPlay = (play: NBAPlay, frameIndex: number) => {
    const frame = play.animation.frames[frameIndex];
    if (!frame) return;
    
    setFormations(prev => {
      const newStarting = [...prev.starting].map(pos => {
        const framePos = frame.positions.find(p => p.id === pos.id);
        if (framePos) {
          return { ...pos, x: framePos.x, y: framePos.y };
        }
        return pos;
      });
      
      return { ...prev, starting: newStarting };
    });
    
    // Update drawings
    setDrawings(frame.arrows);
  };

  // Effect to update positions when animation frame changes
  useEffect(() => {
    if (selectedPlay && isAnimating) {
      updatePositionsFromPlay(selectedPlay, animationFrame);
    }
  }, [selectedPlay, animationFrame, isAnimating]);

  // Handle drawing complete
  const handleDrawingComplete = (drawing: DrawingObject) => {
    setDrawings(prev => [...prev, drawing]);
  };

  // Clear all drawings
  const clearDrawings = () => {
    setDrawings([]);
  };

  // Get player by ID helper
  const getPlayerById = (id: number) => {
    return players.find(player => player.id === id);
  };

  // Function to render stars based on rating
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star key="half" className="h-3 w-3 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-3 w-3 text-neutral-600" />
        ))}
      </div>
    );
  };

  // Function to get attribute color class based on value
  const getAttributeColor = (value: number) => {
    if (value >= 15) return "rating-excellent"; // Excellent
    if (value >= 12) return "rating-good";  // Good
    if (value >= 9) return "rating-average"; // Average
    return "rating-poor"; // Poor
  };

  // Function to get the condition indicator
  const getConditionIndicator = (condition: string) => {
    if (condition.includes("Injury")) {
      return <Heart className="h-3.5 w-3.5 text-red-500" />;
    }
    return <Heart className="h-3.5 w-3.5 text-green-500" />;
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="py-3 px-2 sm:px-3 lg:px-4 bg-neutral-900 text-neutral-100">
        {/* Football Manager style header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-sm flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center mb-0.5">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
                  <span className="text-xs text-neutral-400">April 9, 2025</span>
                </div>
                <h1 className="text-base font-bold text-neutral-100">Squad Management</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 md:mt-0">
            <Button size="sm" variant="outline" className="h-8 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              Save Lineup
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              Export Team Sheet
            </Button>
          </div>
        </div>

        {/* Football Manager style tabs */}
        <Tabs defaultValue="tactics" className="w-full">
          <TabsList className="bg-neutral-800 border-b border-neutral-700 p-0 h-auto mb-4">
            <TabsTrigger 
              value="overview" 
              className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="tactics" 
              className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
            >
              Tactics
            </TabsTrigger>
            <TabsTrigger 
              value="squad" 
              className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
            >
              Squad
            </TabsTrigger>
            <TabsTrigger 
              value="playbook" 
              className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
            >
              Playbook
            </TabsTrigger>
            <TabsTrigger 
              value="training" 
              className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
            >
              Training
            </TabsTrigger>
          </TabsList>

          {/* Interactive Tactics Tab with Court */}
          <TabsContent value="tactics" className="m-0">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Left column - Tactical board */}
              <div className="lg:w-3/5 fm-card">
                <div className="fm-card-header">
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                    <h2 className="fm-card-title">Interactive Court</h2>
                  </div>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-7 w-7 p-0 rounded-sm ${activeTool === 'arrow' ? 'bg-primary text-white border-primary' : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'}`}
                            onClick={() => setActiveTool(activeTool === 'arrow' ? null : 'arrow')}
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Draw Arrow</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-7 w-7 p-0 rounded-sm ${activeTool === 'circle' ? 'bg-primary text-white border-primary' : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'}`}
                            onClick={() => setActiveTool(activeTool === 'circle' ? null : 'circle')}
                          >
                            <Circle className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Draw Circle</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`h-7 w-7 p-0 rounded-sm ${activeTool === 'square' ? 'bg-primary text-white border-primary' : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700'}`}
                            onClick={() => setActiveTool(activeTool === 'square' ? null : 'square')}
                          >
                            <Square className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Draw Zone</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    {/* Color selector */}
                    <Select
                      value={activeColor}
                      onValueChange={setActiveColor}
                    >
                      <SelectTrigger 
                        className="h-7 w-12 bg-neutral-800 border-neutral-700 text-neutral-200 focus:ring-primary"
                      >
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: activeColor }}></div>
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ffffff'].map(color => (
                          <SelectItem 
                            key={color} 
                            value={color}
                            className="flex items-center cursor-pointer hover:bg-neutral-700"
                          >
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></div>
                            <span className="text-xs text-neutral-200">{color}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-red-400 hover:bg-neutral-700"
                            onClick={clearDrawings}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Clear
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Clear All Drawings</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-0 w-7 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                          >
                            <HelpCircle className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-xs space-y-1">
                            <p>Click and drag players to position them on court</p>
                            <p>Use the drawing tools to create plays</p>
                            <p>Select a play from the playlist to animate</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <div className="fm-card-body p-3">
                  {/* Interactive court with drag and drop */}
                  <CourtDropZone onDrop={handlePlayerDrop}>
                    {/* Court markings */}
                    <div className="absolute w-3/4 h-4/5 court-marking top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"></div>
                    <div className="absolute w-24 h-24 court-marking top-[15%] left-1/2 transform -translate-x-1/2 rounded-full"></div>
                    <div className="absolute w-24 h-24 court-marking bottom-[15%] left-1/2 transform -translate-x-1/2 rounded-full"></div>
                    <div className="absolute w-px h-full bg-white bg-opacity-30 left-1/2 transform -translate-x-1/2"></div>
                    
                    {/* Drawing overlay */}
                    <DrawingTool 
                      activeTool={activeTool} 
                      color={activeColor} 
                      drawings={drawings} 
                      onDrawingComplete={handleDrawingComplete}
                    />
                    
                    {/* Player positions */}
                    <AnimatePresence>
                      {formations.starting.map((pos, index) => {
                        const player = getPlayerById(pos.playerId);
                        if (!player) return null;
                        
                        return (
                          <DraggablePlayer 
                            key={pos.id} 
                            player={player} 
                            position={pos} 
                            index={index}
                          />
                        );
                      })}
                    </AnimatePresence>
                  </CourtDropZone>

                  {/* Play animation controls when a play is selected */}
                  {selectedPlay && (
                    <motion.div 
                      className="mt-3 bg-neutral-750 border border-neutral-700 p-3 rounded-sm glass-panel fade-in"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-xs font-medium text-neutral-200">{selectedPlay.name}</h3>
                          <p className="text-[10px] text-neutral-400">{selectedPlay.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isAnimating ? (
                            <Button 
                              size="sm" 
                              className="h-8 w-8 p-0 bg-red-600 hover:bg-red-700 rounded-full"
                              onClick={stopPlayAnimation}
                            >
                              <Pause className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 rounded-full"
                              onClick={startPlayAnimation}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Animation progress */}
                      <div className="w-full bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full transition-all duration-300 ease-in-out"
                          style={{ 
                            width: isAnimating 
                              ? `${((animationFrame + 1) / selectedPlay.animation.frames.length) * 100}%` 
                              : '0%' 
                          }}
                        ></div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Right column - Players and Plays */}
              <div className="lg:w-2/5 flex flex-col gap-4">
                {/* Bench players */}
                <div className="fm-card">
                  <div className="fm-card-header">
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                      <h2 className="fm-card-title">Available Players</h2>
                    </div>
                  </div>
                  
                  <div className="fm-card-body">
                    <p className="text-xs text-neutral-400 mb-2">Drag players onto the court to position them.</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-2">
                      {formations.bench.map((pos) => {
                        const player = getPlayerById(pos.playerId);
                        if (!player) return null;
                        
                        return (
                          <BenchPlayer key={pos.id} player={player} position={pos} />
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* NBA Plays Library */}
                <div className="fm-card">
                  <div className="fm-card-header">
                    <div className="flex items-center">
                      <ArrowRight className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                      <h2 className="fm-card-title">NBA Plays Library</h2>
                    </div>
                  </div>
                  
                  <div className="fm-card-body p-0">
                    <div className="border-b border-neutral-700 px-3 py-2">
                      <p className="text-xs text-neutral-400">Select a play to animate on the court.</p>
                    </div>
                    <div className="max-h-[250px] overflow-y-auto">
                      {nbaPlays.map((play) => (
                        <div 
                          key={play.id}
                          className={`flex items-center justify-between px-3 py-2.5 border-b border-neutral-700 last:border-0 cursor-pointer hover:bg-neutral-750 transition-colors ${selectedPlay?.id === play.id ? 'bg-neutral-750' : ''}`}
                          onClick={() => {
                            setSelectedPlay(play);
                            // Set initial positions
                            if (play.animation.frames.length > 0) {
                              updatePositionsFromPlay(play, 0);
                            }
                          }}
                        >
                          <div>
                            <h3 className="text-xs font-medium text-neutral-200">{play.name}</h3>
                            <p className="text-[10px] text-neutral-500">{play.description}</p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-6 w-6 p-0 bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (selectedPlay?.id === play.id) {
                                startPlayAnimation();
                              } else {
                                setSelectedPlay(play);
                                // Set initial positions then animate
                                if (play.animation.frames.length > 0) {
                                  updatePositionsFromPlay(play, 0);
                                  setTimeout(() => startPlayAnimation(), 500);
                                }
                              }
                            }}
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Squad Tab */}
          <TabsContent value="squad" className="m-0">
            <div className="fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Team Roster</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="fm-card-body p-0">
                {/* Search and filter bar */}
                <div className="px-3 py-2 border-b border-neutral-700 flex items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input 
                      placeholder="Search players..." 
                      className="h-8 pl-8 bg-neutral-800 border-neutral-700 text-neutral-200 text-xs focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex items-center ml-3 space-x-1">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Name
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Position
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Age
                    </Button>
                  </div>
                </div>
                
                {/* Table header */}
                <div className="grid grid-cols-12 bg-neutral-750 text-[10px] font-medium text-neutral-400 uppercase px-3 py-1.5">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-1 text-center">Pos</div>
                  <div className="col-span-1 text-center">Age</div>
                  <div className="col-span-3 text-center">Attributes</div>
                  <div className="col-span-1 text-center">Value</div>
                  <div className="col-span-2 text-center">Rating</div>
                </div>
                
                {/* Players list */}
                <div className="overflow-y-auto max-h-[450px] fancy-scrollbar">
                  {players.map((player, index) => (
                    <motion.div 
                      key={player.id} 
                      className={`grid grid-cols-12 text-xs px-3 py-2 items-center ${
                        index % 2 === 0 ? 'bg-neutral-850' : 'bg-neutral-800'
                      } hover:bg-neutral-700 cursor-pointer`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ 
                        backgroundColor: 'rgba(55, 65, 81, 0.8)', 
                        transition: { duration: 0.1 } 
                      }}
                    >
                      <div className="col-span-1 text-center font-medium text-neutral-300">{player.number}</div>
                      <div className="col-span-3 flex items-center">
                        <div className="mr-2">
                          {getConditionIndicator(player.condition)}
                        </div>
                        <div>
                          <div className="text-neutral-200 font-medium">{player.name}</div>
                          <div className="text-[10px] text-neutral-500">{player.personality}</div>
                        </div>
                      </div>
                      <div className="col-span-1 text-center font-medium text-neutral-300">{player.position}</div>
                      <div className="col-span-1 text-center text-neutral-400">{player.age}</div>
                      
                      {/* Technical, Mental, Physical attributes */}
                      <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.technical)}`}>
                              {player.attributes.technical}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.mental)}`}>
                              {player.attributes.mental}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.physical)}`}>
                              {player.attributes.physical}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1 text-center text-neutral-300">{player.value}</div>
                      <div className="col-span-2 flex justify-center">
                        {renderStarRating(player.rating)}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Playbook Tab */}
          <TabsContent value="playbook" className="m-0">
            <div className="fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Team Playbook</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    New
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              <div className="fm-card-body p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {nbaPlays.map((play) => (
                    <div 
                      key={play.id}
                      className="bg-neutral-750 border border-neutral-700 rounded-sm p-3 hover:border-neutral-600 cursor-pointer hover-glow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-neutral-200">{play.name}</h3>
                          <p className="text-xs text-neutral-500 mt-0.5">{play.description}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-6 w-6 p-0 bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700 rounded-full"
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="mt-2 h-20 bg-green-900/50 rounded-sm flex items-center justify-center">
                        <div className="text-xs text-neutral-400">Play Diagram</div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Empty play slot */}
                  <div className="bg-neutral-750 border border-dashed border-neutral-700 rounded-sm p-3 hover:border-neutral-600 cursor-pointer flex flex-col items-center justify-center h-[126px]">
                    <Plus className="h-5 w-5 text-neutral-500 mb-1" />
                    <p className="text-xs text-neutral-500">Add New Play</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Other tabs (simplified) */}
          <TabsContent value="overview" className="m-0">
            <div className="fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Team Overview</h2>
                </div>
              </div>
              <div className="fm-card-body">
                <div className="p-4 text-center">
                  <p className="text-xs text-neutral-400">Team overview will be available after joining or creating a team.</p>
                  <Button className="mt-4 text-xs slick-btn">Join or Create Team</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="training" className="m-0">
            <div className="fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Training Schedule</h2>
                </div>
              </div>
              <div className="fm-card-body">
                <div className="p-4 text-center">
                  <p className="text-xs text-neutral-400">Team training schedule will be available soon.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DndProvider>
  );

  return (
    <div className="py-4 px-3 sm:px-4 lg:px-6 bg-neutral-900 text-neutral-100">
      {/* Football Manager style header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="text-sm text-neutral-400">April 9, 2025</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100">Team Management</h1>
        </div>
      </div>

      {/* Football Manager style tabs */}
      <Tabs defaultValue="tactics" className="w-full">
        <TabsList className="bg-neutral-800 border-b border-neutral-700 p-0 h-auto mb-4">
          <TabsTrigger 
            value="overview" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="tactics" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Tactics
          </TabsTrigger>
          <TabsTrigger 
            value="squad" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Squad
          </TabsTrigger>
          <TabsTrigger 
            value="training" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Training
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Schedule
          </TabsTrigger>
        </TabsList>

        {/* Tactics Tab (main one based on the screenshot) */}
        <TabsContent value="tactics" className="m-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left column - Tactical board */}
            <div className="lg:w-1/2 fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Lineup & Formation</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    Analysis
                  </Button>
                </div>
              </div>
              
              <div className="fm-card-body">
                {/* Tactical formation display */}
                <div className="relative h-96 bg-green-900 rounded-sm overflow-hidden mb-4">
                  {/* Court markings */}
                  <div className="absolute w-3/4 h-4/5 border-2 border-white border-opacity-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"></div>
                  <div className="absolute w-24 h-24 border-2 border-white border-opacity-30 top-[15%] left-1/2 transform -translate-x-1/2 rounded-full"></div>
                  <div className="absolute w-24 h-24 border-2 border-white border-opacity-30 bottom-[15%] left-1/2 transform -translate-x-1/2 rounded-full"></div>
                  <div className="absolute w-px h-full bg-white bg-opacity-30 left-1/2 transform -translate-x-1/2"></div>
                  
                  {/* Player positions */}
                  {formations.starting.map((pos) => {
                    const player = getPlayerById(pos.playerId);
                    if (!player) return null;
                    
                    return (
                      <div 
                        key={pos.id}
                        className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ 
                          top: pos.y, 
                          left: pos.x 
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="bg-yellow-400 w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-xs mb-1">
                            {player.number}
                          </div>
                          <div className="text-white text-xs font-bold bg-black bg-opacity-50 px-1 rounded">
                            {player.name.split(' ').pop()}
                          </div>
                          <div className="text-white text-[10px] bg-black bg-opacity-50 px-1 rounded">
                            {pos.position}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bench players */}
                <div className="mt-4">
                  <h3 className="text-xs font-medium text-neutral-300 mb-2">SUBSTITUTES</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {formations.bench.map((pos) => {
                      const player = getPlayerById(pos.playerId);
                      if (!player) return null;
                      
                      return (
                        <div key={pos.id} className="bg-neutral-750 border border-neutral-700 p-2 rounded-sm flex flex-col items-center">
                          <div className="bg-neutral-800 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1">
                            {player.number}
                          </div>
                          <div className="text-neutral-300 text-xs text-center font-medium">
                            {player.name.split(' ').pop()}
                          </div>
                          <div className="text-neutral-500 text-[10px]">{pos.position}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Formation analysis */}
                <div className="mt-4 bg-neutral-750 border border-neutral-700 rounded-sm p-3">
                  <h3 className="text-xs font-medium text-neutral-300 mb-2">FORMATION ANALYSIS</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs">
                      <span className="text-neutral-500">Offense:</span>
                      <span className="text-neutral-200 ml-2">Strong</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-neutral-500">Defense:</span>
                      <span className="text-neutral-200 ml-2">Average</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-neutral-500">Balance:</span>
                      <span className="text-neutral-200 ml-2">Good</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Squad list */}
            <div className="lg:w-1/2 fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Squad</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="fm-card-body p-0">
                {/* Search and filter bar */}
                <div className="px-3 py-2 border-b border-neutral-700 flex items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input 
                      placeholder="Search players..." 
                      className="h-8 pl-8 bg-neutral-800 border-neutral-700 text-neutral-200 text-xs focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex items-center ml-3 space-x-1">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Name
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Position
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Age
                    </Button>
                  </div>
                </div>
                
                {/* Table header */}
                <div className="grid grid-cols-12 bg-neutral-750 text-[10px] font-medium text-neutral-400 uppercase px-3 py-1.5">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-1 text-center">Pos</div>
                  <div className="col-span-1 text-center">Age</div>
                  <div className="col-span-3 text-center">Attributes</div>
                  <div className="col-span-1 text-center">Value</div>
                  <div className="col-span-2 text-center">Rating</div>
                </div>
                
                {/* Players list */}
                <div className="overflow-y-auto max-h-[450px]">
                  {players.map((player, index) => (
                    <div 
                      key={player.id} 
                      className={`grid grid-cols-12 text-xs px-3 py-2 items-center ${
                        index % 2 === 0 ? 'bg-neutral-850' : 'bg-neutral-800'
                      } hover:bg-neutral-700 cursor-pointer`}
                    >
                      <div className="col-span-1 text-center font-medium text-neutral-300">{player.number}</div>
                      <div className="col-span-3 flex items-center">
                        <div className="mr-2">
                          {getConditionIndicator(player.condition)}
                        </div>
                        <div>
                          <div className="text-neutral-200 font-medium">{player.name}</div>
                          <div className="text-[10px] text-neutral-500">{player.personality}</div>
                        </div>
                      </div>
                      <div className="col-span-1 text-center font-medium text-neutral-300">{player.position}</div>
                      <div className="col-span-1 text-center text-neutral-400">{player.age}</div>
                      
                      {/* Technical, Mental, Physical attributes */}
                      <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.technical)}`}>
                              {player.attributes.technical}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.mental)}`}>
                              {player.attributes.mental}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.physical)}`}>
                              {player.attributes.physical}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1 text-center text-neutral-300">{player.value}</div>
                      <div className="col-span-2 flex justify-center">
                        {renderStarRating(player.rating)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Other tabs (simplified for now) */}
        <TabsContent value="overview" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Team Overview</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Team overview will be available after joining or creating a team.</p>
                <Button className="mt-4 text-xs bg-primary hover:bg-primary/90">Join or Create Team</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="squad" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Squad Management</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Detailed squad management will be available soon.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Training Schedule</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Team training schedule will be available soon.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Season Schedule</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Season schedule will be available once games are scheduled.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
