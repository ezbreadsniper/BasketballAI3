import React from 'react';
import { motion } from 'framer-motion';

interface BasketballCourtProps {
  children?: React.ReactNode;
  className?: string;
  drawingEnabled?: boolean;
  onCourtClick?: (e: React.MouseEvent) => void;
}

const BasketballCourt: React.FC<BasketballCourtProps> = ({ 
  children, 
  className = '', 
  drawingEnabled = false,
  onCourtClick
}) => {
  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      onClick={drawingEnabled ? onCourtClick : undefined}
    >
      {/* Main court */}
      <div className="absolute inset-0 bg-amber-200 border-4 border-white overflow-hidden">
        {/* Court wooden floor texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJyZ2JhKDIyMCwxNzAsMTAwLDAuMikiLz48cGF0aCBkPSJNMCAwaDIwdjIwSDB6TTE5IDE5aDIwdjIwSDE5eiIgZmlsbD0icmdiYSgyMjUsMTc1LDEwNSwwLjIpIi8+PC9zdmc+')] opacity-50"></div>
        
        {/* Red keys/lanes */}
        <div className="absolute top-0 left-0 w-[33%] h-[28%] bg-red-800 border-r-4 border-b-4 border-white"></div>
        <div className="absolute top-0 right-0 w-[33%] h-[28%] bg-red-800 border-l-4 border-b-4 border-white"></div>
        <div className="absolute bottom-0 left-0 w-[33%] h-[28%] bg-red-800 border-r-4 border-t-4 border-white"></div>
        <div className="absolute bottom-0 right-0 w-[33%] h-[28%] bg-red-800 border-l-4 border-t-4 border-white"></div>
        
        {/* Mid court line */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-white transform -translate-y-1/2"></div>
        
        {/* Center circle */}
        <div className="absolute top-1/2 left-1/2 w-[20%] h-0 pb-[20%] rounded-full border-4 border-white -translate-x-1/2 -translate-y-1/2"></div>
        
        {/* Three point arcs */}
        <div className="absolute top-0 left-0 w-[75%] h-[70%] border-b-4 border-r-4 border-white rounded-br-[50%] transform"></div>
        <div className="absolute top-0 right-0 w-[75%] h-[70%] border-b-4 border-l-4 border-white rounded-bl-[50%] transform"></div>
        <div className="absolute bottom-0 left-0 w-[75%] h-[70%] border-t-4 border-r-4 border-white rounded-tr-[50%] transform"></div>
        <div className="absolute bottom-0 right-0 w-[75%] h-[70%] border-t-4 border-l-4 border-white rounded-tl-[50%] transform"></div>
        
        {/* Free throw circles */}
        <div className="absolute top-[15%] left-1/2 w-[16%] h-0 pb-[16%] border-4 border-white rounded-full -translate-x-1/2 border-dashed"></div>
        <div className="absolute bottom-[15%] left-1/2 w-[16%] h-0 pb-[16%] border-4 border-white rounded-full -translate-x-1/2 border-dashed"></div>
        
        {/* Free throw lines */}
        <div className="absolute top-[28%] left-1/3 right-1/3 h-1 bg-white"></div>
        <div className="absolute bottom-[28%] left-1/3 right-1/3 h-1 bg-white"></div>
        
        {/* Backboards and rims */}
        <div className="absolute top-[1%] left-1/2 w-[10%] h-[1%] bg-gray-800 -translate-x-1/2"></div>
        <div className="absolute top-[3%] left-1/2 w-[6%] h-0 pb-[6%] border-2 border-orange-500 rounded-full -translate-x-1/2"></div>
        <div className="absolute bottom-[1%] left-1/2 w-[10%] h-[1%] bg-gray-800 -translate-x-1/2"></div>
        <div className="absolute bottom-[3%] left-1/2 w-[6%] h-0 pb-[6%] border-2 border-orange-500 rounded-full -translate-x-1/2"></div>
      </div>
      
      {/* Children (players, drawings, etc) */}
      {children}
    </div>
  );
};

export default BasketballCourt;