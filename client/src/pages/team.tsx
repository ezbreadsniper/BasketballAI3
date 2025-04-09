import { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Users, 
  Star, 
  Play,
  MousePointer,
  Circle,
  Square,
  ArrowUpRight,
  X,
  HelpCircle
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

// Bench player component
const BenchPlayer = ({ player, position }: { player: Player; position: { id: number; position: string }; }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'player',
    item: { id: player.id, fromBench: true },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className={`bg-neutral-800 border border-neutral-700 p-2 rounded-sm flex flex-col items-center cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="bg-amber-500 w-8 h-8 rounded-full flex items-center justify-center text-black font-medium text-xs mb-1 border-2 border-amber-400">
        {player.number}
      </div>
      <div className="text-neutral-300 text-xs text-center font-medium">
        {player.name.split(' ').pop()}
      </div>
      <div className="text-neutral-500 text-[10px]">{position.position}</div>
    </div>
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
      ref={drop} 
      id="court" 
      className={`relative w-full h-[400px] bg-green-900 rounded-sm overflow-hidden ${isOver ? 'ring-2 ring-primary' : ''}`}
    >
      {children}
    </div>
  );
};

// Drawing tool component
interface DrawingToolProps {
  activeTool: string | null;
  color: string;
  drawings: DrawingObject[];
  onDrawingComplete: (drawing: DrawingObject) => void;
}

const DrawingTool = ({ activeTool, color, drawings, onDrawingComplete }: DrawingToolProps) => {
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeTool || !canvasRef.current) return;
    
    setIsDrawing(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCurrentPoints([{ x, y }]);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !activeTool || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    if (activeTool === 'arrow' || activeTool === 'line') {
      // For arrows and lines, we just track start and end points
      setCurrentPoints([currentPoints[0], { x, y }]);
    } else {
      // For shapes, we add the point to the path
      setCurrentPoints([...currentPoints, { x, y }]);
    }
  };
  
  const handleMouseUp = () => {
    if (!isDrawing || !activeTool) return;
    
    setIsDrawing(false);
    
    if (currentPoints.length < 2) {
      setCurrentPoints([]);
      return;
    }
    
    const newDrawing: DrawingObject = {
      id: `drawing-${Date.now()}`,
      type: activeTool as 'arrow' | 'circle' | 'square' | 'line',
      points: currentPoints,
      color: color
    };
    
    onDrawingComplete(newDrawing);
    setCurrentPoints([]);
  };
  
  const renderPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    
    if (activeTool === 'line') {
      return `M ${points[0].x} ${points[0].y} L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
    } else if (activeTool === 'arrow') {
      const start = points[0];
      const end = points[points.length - 1];
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
    
    let path = `M ${points[0].x} ${points[0].y}`;
    points.slice(1).forEach(point => {
      path += ` L ${point.x} ${point.y}`;
    });
    return path;
  };
  
  const renderDrawing = (drawing: DrawingObject) => {
    const { type, points, color } = drawing;
    
    if (type === 'line') {
      return (
        <svg key={drawing.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <path 
            d={renderPath(points)} 
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    } else if (type === 'arrow') {
      const start = points[0];
      const end = points[points.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      return (
        <svg key={drawing.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker id={`arrowhead-${drawing.id}`} markerWidth="10" markerHeight="7" 
              refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={color} />
            </marker>
          </defs>
          <path 
            d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} 
            stroke={color}
            strokeWidth="2"
            markerEnd={`url(#arrowhead-${drawing.id})`}
            fill="none"
          />
        </svg>
      );
    } else if (type === 'circle') {
      // Simplified circle based on first and last points
      const start = points[0];
      const end = points[points.length - 1];
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const radius = Math.sqrt(dx * dx + dy * dy);
      
      return (
        <svg key={drawing.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <circle 
            cx={start.x}
            cy={start.y}
            r={radius}
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    } else if (type === 'square') {
      // Simplified square based on first and last points
      const start = points[0];
      const end = points[points.length - 1];
      const width = Math.abs(end.x - start.x);
      const height = Math.abs(end.y - start.y);
      const left = Math.min(start.x, end.x);
      const top = Math.min(start.y, end.y);
      
      return (
        <svg key={drawing.id} className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <rect 
            x={left}
            y={top}
            width={width}
            height={height}
            stroke={color}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      );
    }
    
    return null;
  };
  
  return (
    <div 
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full cursor-crosshair z-0"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Existing drawings */}
      {drawings.map(drawing => renderDrawing(drawing))}
      
      {/* Current drawing in progress */}
      {isDrawing && currentPoints.length > 0 && (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <path 
            d={renderPath(currentPoints)} 
            stroke={color}
            strokeWidth="2"
            fill="none"
            strokeDasharray={activeTool === 'line' || activeTool === 'arrow' ? "0" : "5,5"}
          />
        </svg>
      )}
    </div>
  );
};

export default function Team() {
  // Mock player data
  const [players] = useState<Player[]>([
    { id: 1, number: 3, name: "Stephen Curry", position: "PG", age: 33, height: "6'3\"", attributes: { technical: 18, mental: 17, physical: 15 }, personality: "Leader", condition: "Fit", value: "$50M", rating: 4.8 },
    { id: 2, number: 11, name: "Klay Thompson", position: "SG", age: 31, height: "6'6\"", attributes: { technical: 16, mental: 15, physical: 14 }, personality: "Focused", condition: "Good", value: "$40M", rating: 4.3 },
    { id: 3, number: 22, name: "Andrew Wiggins", position: "SF", age: 26, height: "6'7\"", attributes: { technical: 14, mental: 13, physical: 16 }, personality: "Quiet", condition: "Excellent", value: "$30M", rating: 3.8 },
    { id: 4, number: 23, name: "Draymond Green", position: "PF", age: 31, height: "6'6\"", attributes: { technical: 15, mental: 18, physical: 16 }, personality: "Passionate", condition: "Good", value: "$25M", rating: 4.2 },
    { id: 5, number: 5, name: "Kevon Looney", position: "C", age: 25, height: "6'9\"", attributes: { technical: 12, mental: 14, physical: 15 }, personality: "Consistent", condition: "Fit", value: "$10M", rating: 3.5 },
    { id: 6, number: 4, name: "Moses Moody", position: "SG", age: 19, height: "6'6\"", attributes: { technical: 11, mental: 12, physical: 13 }, personality: "Developing", condition: "Excellent", value: "$3M", rating: 2.8 },
    { id: 7, number: 2, name: "Gary Payton II", position: "PG", age: 28, height: "6'3\"", attributes: { technical: 12, mental: 15, physical: 16 }, personality: "Defensive", condition: "Fit", value: "$2M", rating: 3.2 },
    { id: 8, number: 1, name: "James Wiseman", position: "C", age: 20, height: "7'0\"", attributes: { technical: 11, mental: 11, physical: 16 }, personality: "Raw", condition: "Injured", value: "$8M", rating: 3.0 },
    { id: 9, number: 8, name: "Nemanja Bjelica", position: "PF", age: 33, height: "6'10\"", attributes: { technical: 13, mental: 14, physical: 12 }, personality: "Veteran", condition: "Good", value: "$2M", rating: 2.9 },
    { id: 10, number: 95, name: "Juan Toscano", position: "SF", age: 28, height: "6'6\"", attributes: { technical: 10, mental: 13, physical: 14 }, personality: "Energetic", condition: "Fit", value: "$1.5M", rating: 2.7 },
  ]);
  
  // Formations state (starting lineup and bench)
  const [formations, setFormations] = useState<FormationData>({
    starting: [
      { id: 1, position: "PG", x: "50%", y: "85%", playerId: 1 },
      { id: 2, position: "SG", x: "25%", y: "70%", playerId: 2 },
      { id: 3, position: "SF", x: "75%", y: "70%", playerId: 3 },
      { id: 4, position: "PF", x: "35%", y: "40%", playerId: 4 },
      { id: 5, position: "C", x: "65%", y: "40%", playerId: 5 },
    ],
    bench: [
      { id: 6, position: "SG", playerId: 6 },
      { id: 7, position: "PG", playerId: 7 },
      { id: 8, position: "C", playerId: 8 },
      { id: 9, position: "PF", playerId: 9 },
      { id: 10, position: "SF", playerId: 10 },
    ]
  });
  
  // Drawing tools state
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<string>("#ffffff");
  const [drawings, setDrawings] = useState<DrawingObject[]>([]);
  
  // NBA play animation state
  const [nbaPlays] = useState<NBAPlay[]>([
    {
      id: 1,
      name: "Pick and Roll",
      description: "Basic pick and roll with the center and point guard",
      animation: {
        frames: [
          {
            positions: [
              { id: 1, x: "50%", y: "85%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "65%", y: "40%" },
            ],
            arrows: []
          },
          {
            positions: [
              { id: 1, x: "50%", y: "70%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "55%", y: "55%" },
            ],
            arrows: [
              {
                id: "arrow-1",
                type: "arrow",
                points: [
                  { x: 50, y: 85 },
                  { x: 50, y: 70 }
                ],
                color: "#ffffff"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "40%", y: "60%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "45%", y: "55%" },
            ],
            arrows: [
              {
                id: "arrow-2",
                type: "arrow",
                points: [
                  { x: 50, y: 70 },
                  { x: 40, y: 60 }
                ],
                color: "#ffffff"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "35%", y: "50%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "35%", y: "30%" },
            ],
            arrows: [
              {
                id: "arrow-3",
                type: "arrow",
                points: [
                  { x: 45, y: 55 },
                  { x: 35, y: 30 }
                ],
                color: "#ffffff"
              }
            ]
          }
        ]
      }
    },
    {
      id: 2,
      name: "Horns Set",
      description: "Common Horns set with high post screens",
      animation: {
        frames: [
          {
            positions: [
              { id: 1, x: "50%", y: "85%" },
              { id: 2, x: "25%", y: "70%" },
              { id: 3, x: "75%", y: "70%" },
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "65%", y: "40%" },
            ],
            arrows: []
          },
          {
            positions: [
              { id: 1, x: "50%", y: "70%" },
              { id: 2, x: "20%", y: "50%" },
              { id: 3, x: "80%", y: "50%" },
              { id: 4, x: "40%", y: "40%" },
              { id: 5, x: "60%", y: "40%" },
            ],
            arrows: []
          }
        ]
      }
    }
  ]);
  
  const [selectedPlay, setSelectedPlay] = useState<NBAPlay | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationFrame, setAnimationFrame] = useState(0);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  
  // Helper function to get player by ID
  const getPlayerById = (id: number): Player | undefined => {
    return players.find(player => player.id === id);
  };
  
  // Helper function to get attribute color
  const getAttributeColor = (value: number): string => {
    if (value >= 16) return 'bg-green-600 text-white';
    if (value >= 13) return 'bg-green-400 text-white';
    if (value >= 10) return 'bg-yellow-500 text-black';
    if (value >= 7) return 'bg-orange-500 text-black';
    return 'bg-red-500 text-white';
  };
  
  // Helper function to render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex">
        {Array.from({ length: Math.floor(rating) }).map((_, i) => (
          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        ))}
        {rating % 1 >= 0.5 && (
          <Star className="h-3 w-3 text-yellow-400" />
        )}
      </div>
    );
  };
  
  // Helper function to get condition indicator
  const getConditionIndicator = (condition: string) => {
    switch (condition) {
      case 'Excellent':
        return <div className="w-2 h-4 bg-green-500 rounded-sm"></div>;
      case 'Good':
        return <div className="w-2 h-4 bg-green-300 rounded-sm"></div>;
      case 'Fit':
        return <div className="w-2 h-4 bg-yellow-400 rounded-sm"></div>;
      case 'Injured':
        return <div className="w-2 h-4 bg-red-500 rounded-sm"></div>;
      default:
        return <div className="w-2 h-4 bg-gray-400 rounded-sm"></div>;
    }
  };
  
  // Handle player dropping on court
  const handlePlayerDrop = (item: any, newPosition: { x: string; y: string }) => {
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
          clearInterval(animationRef.current as NodeJS.Timeout);
          setIsAnimating(false);
          return 0;
        }
        return nextFrame;
      });
    }, 1000); // 1 second per frame
  };
  
  // Handle selecting a play
  const handleSelectPlay = (playName: string) => {
    const play = nbaPlays.find(p => p.name === playName);
    setSelectedPlay(play || null);
  };
  
  // Update positions from play animation
  const updatePositionsFromPlay = (play: NBAPlay, frameIndex: number) => {
    const frame = play.animation.frames[frameIndex];
    
    setFormations(prev => {
      const newStarting = prev.starting.map(pos => {
        const newPos = frame.positions.find(p => p.id === pos.id);
        if (newPos) {
          return { ...pos, x: newPos.x, y: newPos.y };
        }
        return pos;
      });
      
      return {
        ...prev,
        starting: newStarting
      };
    });
    
    // Update drawings
    setDrawings(frame.arrows);
  };
  
  // When animation frame changes, update positions
  useEffect(() => {
    if (isAnimating && selectedPlay) {
      updatePositionsFromPlay(selectedPlay, animationFrame);
    }
    
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [animationFrame, isAnimating, selectedPlay]);
  
  // Handle drawing completion
  const handleDrawingComplete = (drawing: DrawingObject) => {
    setDrawings(prev => [...prev, drawing]);
  };
  
  // Clear all drawings
  const clearDrawings = () => {
    setDrawings([]);
  };

  // Drawing tools data
  const drawingTools = [
    { id: 'arrow', icon: <ArrowUpRight className="h-3.5 w-3.5" /> },
    { id: 'line', icon: <div className="w-3.5 h-0.5 bg-current" /> },
    { id: 'circle', icon: <Circle className="h-3.5 w-3.5" /> },
    { id: 'square', icon: <Square className="h-3.5 w-3.5" /> },
  ];

  // Drawing colors
  const drawingColors = [
    '#ffffff', // white
    '#ef4444', // red
    '#22c55e', // green
    '#3b82f6', // blue
    '#eab308', // yellow
  ];
  
  return (
    <DndProvider backend={HTML5Backend}>
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
              {/* Left column - Basketball Court */}
              <div className="lg:w-2/3 fm-card">
                <div className="fm-card-header">
                  <div className="flex items-center">
                    <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                    <h2 className="fm-card-title">Basketball Court</h2>
                  </div>
                  <div className="flex space-x-2">
                    <Select value={selectedPlay?.name || ""} onValueChange={handleSelectPlay}>
                      <SelectTrigger className="h-7 bg-neutral-800 border-neutral-700 text-neutral-200 w-[180px] text-xs">
                        <SelectValue placeholder="Select Play" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200">
                        {nbaPlays.map(play => (
                          <SelectItem key={play.id} value={play.name} className="text-xs">
                            {play.name}
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
                            disabled={!selectedPlay || isAnimating}
                            className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700"
                            onClick={startPlayAnimation}
                          >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            Run
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Run Selected Play</p>
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

                  {/* Drawing tools row */}
                  <div className="mt-3 p-2 bg-neutral-800 rounded flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-neutral-400 mr-1">Tools:</div>
                      {drawingTools.map(tool => (
                        <Button
                          key={tool.id}
                          variant="outline"
                          size="sm"
                          className={`h-7 w-7 p-0 flex items-center justify-center ${
                            activeTool === tool.id ? 'bg-neutral-700 text-white' : 'bg-neutral-800 text-neutral-400'
                          }`}
                          onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id)}
                        >
                          {tool.icon}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-neutral-400 mr-1">Color:</div>
                      {drawingColors.map(color => (
                        <button
                          key={color}
                          className={`h-5 w-5 rounded-full cursor-pointer border ${
                            activeColor === color ? 'border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setActiveColor(color)}
                        />
                      ))}
                      
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
                </div>
              </div>

              {/* Right column - Squad list */}
              <div className="lg:w-1/3 space-y-4">
                <div className="fm-card">
                  <div className="fm-card-header">
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                      <h2 className="fm-card-title">Starting Lineup</h2>
                    </div>
                  </div>
                  <div className="fm-card-body p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-neutral-800">
                          <tr className="text-xs text-neutral-400 border-b border-neutral-700">
                            <th className="py-2 px-3 text-left font-medium">#</th>
                            <th className="py-2 px-3 text-left font-medium">Name</th>
                            <th className="py-2 px-3 text-left font-medium">POS</th>
                            <th className="py-2 px-3 text-left font-medium">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formations.starting.map((pos) => {
                            const player = getPlayerById(pos.playerId);
                            if (!player) return null;
                            return (
                              <tr key={player.id} className="text-xs border-b border-neutral-800 hover:bg-neutral-800/50">
                                <td className="py-2 px-3 text-amber-400 font-bold">{player.number}</td>
                                <td className="py-2 px-3 text-white">{player.name}</td>
                                <td className="py-2 px-3 text-primary">{player.position}</td>
                                <td className="py-2 px-3">
                                  <div className="flex">
                                    {Array.from({ length: Math.floor(player.rating) }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    {player.rating % 1 >= 0.5 && (
                                      <Star className="h-3 w-3 text-yellow-400" />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Bench players */}
                <div className="fm-card">
                  <div className="fm-card-header">
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                      <h2 className="fm-card-title">Bench</h2>
                    </div>
                  </div>
                  <div className="fm-card-body p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-neutral-800">
                          <tr className="text-xs text-neutral-400 border-b border-neutral-700">
                            <th className="py-2 px-3 text-left font-medium">#</th>
                            <th className="py-2 px-3 text-left font-medium">Name</th>
                            <th className="py-2 px-3 text-left font-medium">POS</th>
                            <th className="py-2 px-3 text-left font-medium">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formations.bench.map((pos) => {
                            const player = getPlayerById(pos.playerId);
                            if (!player) return null;
                            return (
                              <tr key={player.id} className="text-xs border-b border-neutral-800 hover:bg-neutral-800/50">
                                <td className="py-2 px-3 text-amber-400 font-bold">{player.number}</td>
                                <td className="py-2 px-3 text-white">{player.name}</td>
                                <td className="py-2 px-3 text-primary">{player.position}</td>
                                <td className="py-2 px-3">
                                  <div className="flex">
                                    {Array.from({ length: Math.floor(player.rating) }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    {player.rating % 1 >= 0.5 && (
                                      <Star className="h-3 w-3 text-yellow-400" />
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                {/* Formation analysis */}
                <div className="bg-neutral-750 border border-neutral-700 rounded-sm p-3">
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
    </DndProvider>
  );
}