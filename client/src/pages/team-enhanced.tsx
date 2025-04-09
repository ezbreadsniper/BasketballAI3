import React, { useState, useRef, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Users, 
  SquareUser, 
  RefreshCw, 
  PlayCircle, 
  PauseCircle, 
  Rewind, 
  FastForward, 
  MousePointer,
  Circle as CircleIcon,
  Square as SquareIcon,
  ArrowUpRight,
  Minus
} from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import BasketballCourt from '@/components/team/BasketballCourt';
import DraggableCourtPlayer from '@/components/team/DraggableCourtPlayer';
import PlayerStats from '@/components/team/PlayerStats';

// Type definitions
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

// Bench player component
const BenchPlayer = ({ player, position, onClick }: { 
  player: Player; 
  position: { id: number; position: string }; 
  onClick?: (player: Player) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'benchPlayer',
    item: { id: player.id, benchPosition: position.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  // Get color based on player position
  const getPositionColor = (pos: string) => {
    switch(pos) {
      case 'PG': return 'from-blue-500 to-blue-700';
      case 'SG': return 'from-purple-500 to-purple-700';
      case 'SF': return 'from-green-500 to-green-700';
      case 'PF': return 'from-orange-500 to-orange-700';
      case 'C': return 'from-red-500 to-red-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getBorderColor = (pos: string) => {
    switch(pos) {
      case 'PG': return 'border-blue-400';
      case 'SG': return 'border-purple-400';
      case 'SF': return 'border-green-400';
      case 'PF': return 'border-orange-400';
      case 'C': return 'border-red-400';
      default: return 'border-gray-400';
    }
  };

  const totalRating = ((player.attributes.technical + player.attributes.mental + player.attributes.physical) / 3).toFixed(1);

  return (
    <motion.div
      ref={drag}
      className={`flex items-center p-2 my-1 rounded-md bg-neutral-800 border border-neutral-700 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick && onClick(player)}
    >
      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 
                      bg-gradient-to-br ${getPositionColor(player.position)} border-2 ${getBorderColor(player.position)}`}>
        {player.number}
        <div className="absolute -bottom-1 -right-1 bg-black text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
          {totalRating}
        </div>
      </div>
      <div>
        <div className="text-white text-sm font-medium">{player.name}</div>
        <div className="text-gray-400 text-xs">{position.position} • {player.height}</div>
      </div>
    </motion.div>
  );
};

// Drawing canvas component
const DrawingCanvas = ({ 
  activeTool, 
  color,
  onDrawingComplete,
  drawings = []
}: { 
  activeTool: string | null; 
  color: string;
  onDrawingComplete: (drawing: DrawingObject) => void;
  drawings?: DrawingObject[];
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<{ x: number; y: number }[]>([]);
  const courtRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeTool || !courtRef.current) return;
    
    const rect = courtRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    setIsDrawing(true);
    setCurrentPoints([{ x, y }]);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !courtRef.current) return;
    
    const rect = courtRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    if (activeTool === 'arrow' || activeTool === 'line') {
      setCurrentPoints([currentPoints[0], { x, y }]);
    } else {
      setCurrentPoints([...currentPoints, { x, y }]);
    }
  };
  
  const handleMouseUp = () => {
    if (isDrawing && currentPoints.length > 1 && activeTool) {
      const newDrawing: DrawingObject = {
        id: `drawing-${Date.now()}`,
        type: activeTool as 'arrow' | 'circle' | 'square' | 'line',
        points: currentPoints,
        color
      };
      
      onDrawingComplete(newDrawing);
    }
    
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

export default function TeamEnhanced() {
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
              { id: 4, x: "35%", y: "40%" },
              { id: 5, x: "65%", y: "40%" }
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
              { id: 2, x: "30%", y: "60%" },
              { id: 3, x: "80%", y: "70%" },
              { id: 4, x: "30%", y: "40%" },
              { id: 5, x: "70%", y: "40%" }
            ],
            arrows: [
              {
                id: "arrow-3",
                type: "arrow",
                points: [
                  { x: 0.2, y: 0.7 },
                  { x: 0.3, y: 0.6 }
                ],
                color: "#3b82f6"
              },
              {
                id: "arrow-4",
                type: "arrow",
                points: [
                  { x: 0.35, y: 0.4 },
                  { x: 0.3, y: 0.4 }
                ],
                color: "#3b82f6"
              },
              {
                id: "arrow-5",
                type: "arrow",
                points: [
                  { x: 0.65, y: 0.4 },
                  { x: 0.7, y: 0.4 }
                ],
                color: "#3b82f6"
              }
            ]
          },
          {
            positions: [
              { id: 1, x: "60%", y: "50%" },
              { id: 2, x: "30%", y: "60%" },
              { id: 3, x: "80%", y: "70%" },
              { id: 4, x: "35%", y: "50%" },
              { id: 5, x: "65%", y: "20%" }
            ],
            arrows: [
              {
                id: "arrow-6",
                type: "arrow",
                points: [
                  { x: 0.5, y: 0.6 },
                  { x: 0.6, y: 0.5 }
                ],
                color: "#3b82f6"
              },
              {
                id: "arrow-7",
                type: "arrow",
                points: [
                  { x: 0.3, y: 0.4 },
                  { x: 0.35, y: 0.5 }
                ],
                color: "#3b82f6"
              },
              {
                id: "arrow-8",
                type: "arrow",
                points: [
                  { x: 0.7, y: 0.4 },
                  { x: 0.65, y: 0.2 }
                ],
                color: "#3b82f6"
              }
            ]
          }
        ]
      }
    }
  ];

  // Court state
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [color, setColor] = useState('#3b82f6'); // Default blue color
  const [drawings, setDrawings] = useState<DrawingObject[]>([]);
  const [currentPlay, setCurrentPlay] = useState<NBAPlay | null>(null);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activeTab, setActiveTab] = useState('roster');
  const isMobile = useIsMobile();
  
  // Animation refs
  const animationIntervalRef = useRef<any>(null);
  const courtContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle dropping players
  const [, dropRef] = useDrop(
    () => ({
      accept: ['player', 'benchPlayer'],
      drop: (item: any, monitor) => {
        const dropPosition = monitor.getClientOffset();
        if (dropPosition && courtContainerRef.current) {
          const courtRect = courtContainerRef.current.getBoundingClientRect();
          const relativeX = Math.min(Math.max((dropPosition.x - courtRect.left) / courtRect.width, 0), 1);
          const relativeY = Math.min(Math.max((dropPosition.y - courtRect.top) / courtRect.height, 0), 1);
          
          if (item.id && item.position !== undefined) {
            // Court player being moved
            const newStarting = formations.starting.map(pos => {
              if (pos.id === item.position) {
                return { ...pos, x: relativeX * 100 + '%', y: relativeY * 100 + '%' };
              }
              return pos;
            });
            setFormations({ ...formations, starting: newStarting });
          } else if (item.id && item.benchPosition !== undefined) {
            // Bench player being moved to court - would need to implement swap logic
            console.log('Bench player dropped on court', item);
          }
        }
      }
    }),
    [formations]
  );
  
  // Create a temp copy of starting positions when playing animation
  const visualPositions = isPlayingAnimation && currentPlay && currentPlay.animation.frames[currentFrameIndex]
    ? currentPlay.animation.frames[currentFrameIndex].positions
    : formations.starting;
    
  // Create a temp copy of drawings when playing animation
  const visualDrawings = isPlayingAnimation && currentPlay && currentPlay.animation.frames[currentFrameIndex]
    ? [...drawings, ...(currentPlay.animation.frames[currentFrameIndex].arrows || [])]
    : drawings;
  
  // Methods for animation controls
  const playAnimation = useCallback(() => {
    if (!currentPlay || currentPlay.animation.frames.length <= 1) return;
    
    setIsPlayingAnimation(true);
    setCurrentFrameIndex(0);
    
    clearInterval(animationIntervalRef.current);
    animationIntervalRef.current = setInterval(() => {
      setCurrentFrameIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= currentPlay.animation.frames.length) {
          clearInterval(animationIntervalRef.current);
          setIsPlayingAnimation(false);
          return 0;
        }
        return nextIndex;
      });
    }, 1000); // 1 second per frame
  }, [currentPlay]);
  
  const pauseAnimation = () => {
    clearInterval(animationIntervalRef.current);
    setIsPlayingAnimation(false);
  };
  
  const prevFrame = () => {
    if (!currentPlay) return;
    pauseAnimation();
    setCurrentFrameIndex(prevIndex => {
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? currentPlay.animation.frames.length - 1 : newIndex;
    });
  };
  
  const nextFrame = () => {
    if (!currentPlay) return;
    pauseAnimation();
    setCurrentFrameIndex(prevIndex => {
      const newIndex = prevIndex + 1;
      return newIndex >= currentPlay.animation.frames.length ? 0 : newIndex;
    });
  };
  
  // Clean up animation interval on unmount
  React.useEffect(() => {
    return () => {
      clearInterval(animationIntervalRef.current);
    };
  }, []);
  
  // Handle selecting plays
  const handlePlaySelect = (play: NBAPlay) => {
    setCurrentPlay(play);
    setCurrentFrameIndex(0);
    pauseAnimation();
  };
  
  // Reset court to starting positions
  const resetPositions = () => {
    pauseAnimation();
    setCurrentPlay(null);
    setCurrentFrameIndex(0);
    setDrawings([]);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(prev => !prev);
    setActiveTool(null);
    if (isPlayingAnimation) {
      pauseAnimation();
    }
  };
  
  // Update positions from a play
  const updatePositionsFromPlay = (play: NBAPlay, frameIndex: number) => {
    if (play.animation.frames[frameIndex]) {
      const newPositions = play.animation.frames[frameIndex].positions.map(pos => {
        const originalPos = formations.starting.find(startPos => startPos.id === pos.id);
        if (originalPos) {
          return { 
            ...originalPos, 
            x: pos.x, 
            y: pos.y 
          };
        }
        return originalPos!; // Non-null assertion to keep TypeScript happy
      });
      
      setFormations(prev => ({
        ...prev,
        starting: newPositions as PositionData[]
      }));
    }
  };
  
  // Handle adding drawings
  const handleDrawingComplete = (drawing: DrawingObject) => {
    setDrawings(prev => [...prev, drawing]);
  };
  
  // Find player by position
  const getPlayerByPosition = (positionData: PositionData) => {
    return players.find(player => player.id === positionData.playerId);
  };
  
  // Handle player selection
  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
  };

  return (
    <AppLayout>
      <DndProvider backend={HTML5Backend}>
        <div className="h-full p-4 pb-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Team Management</h1>
              <p className="text-gray-400">Manage your team roster and formations</p>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={toggleEditMode}
                className={`px-3 py-1.5 rounded-md ${isEditMode ? 'bg-primary text-white' : 'bg-neutral-800 text-neutral-300'} flex items-center gap-2`}
              >
                <SquareUser size={18} />
                <span>{isEditMode ? 'Exit Edit Mode' : 'Edit Mode'}</span>
              </button>
              
              <button 
                onClick={resetPositions}
                className="px-3 py-1.5 rounded-md bg-neutral-800 text-neutral-300 flex items-center gap-2"
              >
                <RefreshCw size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>
          
          <div className="flex gap-4 h-[calc(100vh-180px)]">
            {/* Main panel */}
            <div className="flex-1 flex flex-col bg-neutral-850 rounded-lg border border-neutral-700 overflow-hidden">
              {/* Top toolbar for edit mode */}
              {isEditMode && (
                <div className="flex p-2 gap-2 bg-neutral-800">
                  <button 
                    onClick={() => setActiveTool(activeTool === 'select' ? null : 'select')}
                    className={`p-2 rounded-md ${activeTool === 'select' ? 'bg-primary text-white' : 'bg-neutral-700 text-neutral-300'}`}
                  >
                    <MousePointer size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveTool(activeTool === 'arrow' ? null : 'arrow')}
                    className={`p-2 rounded-md ${activeTool === 'arrow' ? 'bg-primary text-white' : 'bg-neutral-700 text-neutral-300'}`}
                  >
                    <ArrowUpRight size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveTool(activeTool === 'circle' ? null : 'circle')}
                    className={`p-2 rounded-md ${activeTool === 'circle' ? 'bg-primary text-white' : 'bg-neutral-700 text-neutral-300'}`}
                  >
                    <CircleIcon size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveTool(activeTool === 'square' ? null : 'square')}
                    className={`p-2 rounded-md ${activeTool === 'square' ? 'bg-primary text-white' : 'bg-neutral-700 text-neutral-300'}`}
                  >
                    <SquareIcon size={16} />
                  </button>
                  <button 
                    onClick={() => setActiveTool(activeTool === 'line' ? null : 'line')}
                    className={`p-2 rounded-md ${activeTool === 'line' ? 'bg-primary text-white' : 'bg-neutral-700 text-neutral-300'}`}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <div className="ml-auto flex gap-2">
                    <button 
                      onClick={() => setColor('#3b82f6')} // blue
                      className={`w-6 h-6 rounded-full bg-blue-500 border-2 ${color === '#3b82f6' ? 'border-white' : 'border-transparent'}`}
                    />
                    <button 
                      onClick={() => setColor('#ef4444')} // red
                      className={`w-6 h-6 rounded-full bg-red-500 border-2 ${color === '#ef4444' ? 'border-white' : 'border-transparent'}`}
                    />
                    <button 
                      onClick={() => setColor('#10b981')} // green
                      className={`w-6 h-6 rounded-full bg-green-500 border-2 ${color === '#10b981' ? 'border-white' : 'border-transparent'}`}
                    />
                    <button 
                      onClick={() => setColor('#f59e0b')} // yellow
                      className={`w-6 h-6 rounded-full bg-amber-500 border-2 ${color === '#f59e0b' ? 'border-white' : 'border-transparent'}`}
                    />
                  </div>
                </div>
              )}
              
              {/* Court container */}
              <div className="relative flex-1 overflow-hidden" ref={courtContainerRef}>
                <div 
                  className="absolute inset-0"
                  ref={dropRef}
                >
                  {/* Basketball court */}
                  <BasketballCourt>
                    {/* Player positions */}
                    {visualPositions.map((posData, index) => {
                      const player = getPlayerByPosition(posData);
                      if (!player) return null;
                      
                      return (
                        <DraggableCourtPlayer 
                          key={posData.id} 
                          player={player} 
                          position={posData} 
                          index={index}
                          showDetails={true}
                          onClick={handlePlayerClick}
                        />
                      );
                    })}
                    
                    {/* Drawing canvas layer */}
                    {isEditMode && activeTool && activeTool !== 'select' && (
                      <DrawingCanvas 
                        activeTool={activeTool} 
                        color={color}
                        onDrawingComplete={handleDrawingComplete}
                      />
                    )}
                    
                    {/* Show existing drawings */}
                    {visualDrawings.length > 0 && (
                      <DrawingCanvas 
                        activeTool={null}
                        color={color}
                        onDrawingComplete={() => {}}
                        drawings={visualDrawings}
                      />
                    )}
                  </BasketballCourt>
                </div>
              </div>
              
              {/* Animation controls - only show when a play is selected */}
              {currentPlay && (
                <div className="flex items-center justify-between p-3 bg-neutral-800 border-t border-neutral-700">
                  <div className="text-sm text-white">
                    {currentPlay.name} - Frame {currentFrameIndex + 1}/{currentPlay.animation.frames.length}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button onClick={prevFrame} className="p-1 hover:bg-neutral-700 rounded-full">
                      <Rewind size={18} className="text-neutral-300" />
                    </button>
                    
                    {isPlayingAnimation ? (
                      <button onClick={pauseAnimation} className="p-1 hover:bg-neutral-700 rounded-full">
                        <PauseCircle size={24} className="text-white" />
                      </button>
                    ) : (
                      <button onClick={playAnimation} className="p-1 hover:bg-neutral-700 rounded-full">
                        <PlayCircle size={24} className="text-white" />
                      </button>
                    )}
                    
                    <button onClick={nextFrame} className="p-1 hover:bg-neutral-700 rounded-full">
                      <FastForward size={18} className="text-neutral-300" />
                    </button>
                    
                    <button 
                      onClick={() => updatePositionsFromPlay(currentPlay, currentFrameIndex)}
                      className="ml-4 px-3 py-1 bg-primary text-white text-sm rounded-md"
                    >
                      Save Position
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Side panel - responsive */}
            <div className={`bg-neutral-850 rounded-lg border border-neutral-700 overflow-hidden flex flex-col ${isMobile ? 'hidden' : 'w-96'}`}>
              {/* Tabs */}
              <div className="flex border-b border-neutral-700">
                <button 
                  className={`px-4 py-3 font-medium ${activeTab === 'roster' ? 'text-white bg-neutral-800 border-b-2 border-primary' : 'text-neutral-400'}`}
                  onClick={() => setActiveTab('roster')}
                >
                  Roster
                </button>
                <button 
                  className={`px-4 py-3 font-medium ${activeTab === 'plays' ? 'text-white bg-neutral-800 border-b-2 border-primary' : 'text-neutral-400'}`}
                  onClick={() => setActiveTab('plays')}
                >
                  Plays
                </button>
                <button 
                  className={`px-4 py-3 font-medium ${activeTab === 'stats' ? 'text-white bg-neutral-800 border-b-2 border-primary' : 'text-neutral-400'}`}
                  onClick={() => setActiveTab('stats')}
                >
                  Stats
                </button>
              </div>
              
              {/* Panel content - Roster tab */}
              {activeTab === 'roster' && (
                <div className="flex-1 overflow-auto">
                  {/* Selected player info */}
                  {selectedPlayer && (
                    <div className="p-3 border-b border-neutral-700">
                      <PlayerStats player={selectedPlayer} />
                    </div>
                  )}
                  
                  {/* Bench players */}
                  <div className="p-3">
                    <h3 className="text-white font-medium mb-3 flex items-center">
                      <Users size={16} className="mr-2" />
                      Bench Players
                    </h3>
                    
                    <div className="space-y-1">
                      {formations.bench.map((benchPos) => {
                        const player = players.find(p => p.id === benchPos.playerId);
                        if (!player) return null;
                        
                        return (
                          <BenchPlayer
                            key={benchPos.id}
                            player={player}
                            position={benchPos}
                            onClick={handlePlayerClick}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Panel content - Plays tab */}
              {activeTab === 'plays' && (
                <div className="flex-1 overflow-auto p-3">
                  <h3 className="text-white font-medium mb-3">Team Plays</h3>
                  
                  <div className="space-y-2">
                    {nbaPlays.map(play => (
                      <div 
                        key={play.id}
                        className={`p-3 rounded-md cursor-pointer ${currentPlay?.id === play.id ? 'bg-primary bg-opacity-20 border border-primary' : 'bg-neutral-800 hover:bg-neutral-700'}`}
                        onClick={() => handlePlaySelect(play)}
                      >
                        <div className="text-white text-sm font-medium">{play.name}</div>
                        <div className="text-neutral-400 text-xs">{play.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Panel content - Stats tab */}
              {activeTab === 'stats' && (
                <div className="flex-1 overflow-auto p-3">
                  <h3 className="text-white font-medium mb-3">Team Stats</h3>
                  
                  <div className="space-y-4">
                    {players.slice(0, 5).map(player => (
                      <div 
                        key={player.id}
                        className="p-3 rounded-md bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                        onClick={() => handlePlayerClick(player)}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 
                                          bg-gradient-to-br 
                                          ${player.position === 'PG' ? 'from-blue-500 to-blue-700' : 
                                            player.position === 'SG' ? 'from-purple-500 to-purple-700' : 
                                            player.position === 'SF' ? 'from-green-500 to-green-700' : 
                                            player.position === 'PF' ? 'from-orange-500 to-orange-700' : 
                                            'from-red-500 to-red-700'}`}>
                            {player.number}
                          </div>
                          <div>
                            <div className="text-white text-sm font-medium">{player.name}</div>
                            <div className="text-gray-400 text-xs">{player.position} • {player.height}</div>
                          </div>
                          <div className="ml-auto">
                            <div className="text-xl font-bold text-amber-500">
                              {player.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-neutral-900 p-2 rounded text-center">
                            <div className="text-green-500 text-lg font-bold">
                              {player.attributes.technical}
                            </div>
                            <div className="text-xs text-neutral-400">Technical</div>
                          </div>
                          <div className="bg-neutral-900 p-2 rounded text-center">
                            <div className="text-blue-500 text-lg font-bold">
                              {player.attributes.physical}
                            </div>
                            <div className="text-xs text-neutral-400">Physical</div>
                          </div>
                          <div className="bg-neutral-900 p-2 rounded text-center">
                            <div className="text-amber-500 text-lg font-bold">
                              {player.attributes.mental}
                            </div>
                            <div className="text-xs text-neutral-400">Mental</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DndProvider>
    </AppLayout>
  );
}