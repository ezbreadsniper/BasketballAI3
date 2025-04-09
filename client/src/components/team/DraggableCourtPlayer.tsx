import React from 'react';
import { motion } from 'framer-motion';

interface Player {
  id: number;
  number: number;
  name: string;
  position: string;
  attributes: {
    technical: number;
    mental: number;
    physical: number;
  };
}

interface PositionData {
  id: number;
  position: string;
  x: string;
  y: string;
  playerId: number;
}

interface DraggableCourtPlayerProps {
  player: Player;
  position: PositionData;
  index: number;
  showDetails?: boolean;
  onClick?: (player: Player) => void;
}

const DraggableCourtPlayer: React.FC<DraggableCourtPlayerProps> = ({ 
  player, 
  position, 
  index, 
  showDetails = false,
  onClick
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  
  // Handle dragging
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const dragData = {
      id: player.id,
      position: position.id
    };
    e.dataTransfer.setData('text', JSON.stringify(dragData));
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a ghost image that looks better
    const ghost = document.createElement('div');
    ghost.classList.add('w-12', 'h-12', 'rounded-full', 'bg-primary', 'flex', 'items-center', 'justify-center', 'text-white', 'font-bold');
    ghost.textContent = player.number.toString();
    ghost.style.opacity = '0.8';
    document.body.appendChild(ghost);
    e.dataTransfer.setDragImage(ghost, 20, 20);
    
    setTimeout(() => {
      ghost.remove();
    }, 0);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };

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
      className={`absolute cursor-grab ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ 
        top: position.y, 
        left: position.x,
        transform: 'translate(-50%, -50%)',
        zIndex: isDragging ? 100 : 10
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
      whileHover={{ scale: 1.1 }}
    >
      <div
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => onClick && onClick(player)}
        className="flex flex-col items-center select-none"
      >
        <div className={`relative glass-panel bg-gradient-to-br ${getPositionColor(player.position)} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 ${getBorderColor(player.position)}`}>
          <span className="text-sm">{player.number}</span>
          
          {/* Show rating on player */}
          <div className="absolute -bottom-1 -right-1 bg-black text-white text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white">
            {totalRating}
          </div>
        </div>
        
        {showDetails && (
          <>
            <div className="text-white text-xs font-medium bg-black bg-opacity-70 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm mt-1 whitespace-nowrap">
              {player.name.split(' ').pop()}
            </div>
            <div className="text-white text-[10px] bg-black bg-opacity-60 backdrop-blur-sm px-1.5 rounded-sm whitespace-nowrap">
              {position.position}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default DraggableCourtPlayer;