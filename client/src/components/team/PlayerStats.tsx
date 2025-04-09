import React from 'react';
import { Gauge } from '@/components/ui/gauge';
import { motion } from 'framer-motion';

interface PlayerAttribute {
  name: string;
  value: number;
  category: 'technical' | 'physical' | 'mental';
  primary?: 'danger' | 'warning' | 'success' | 'info';
}

interface PlayerStatsProps {
  player: {
    id: number;
    name: string;
    position: string;
    number: number;
    attributes: {
      technical: number;
      mental: number;
      physical: number;
    };
    detailedAttributes?: PlayerAttribute[];
  };
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  // Default detailed attributes if not provided
  const detailedAttributes = player.detailedAttributes || [
    { name: 'Shooting', value: 65, category: 'technical', primary: 'success' },
    { name: 'Ball Handling', value: 78, category: 'technical', primary: 'success' },
    { name: 'Passing', value: 72, category: 'technical', primary: 'success' },
    { name: 'Speed', value: 82, category: 'physical', primary: 'info' },
    { name: 'Stamina', value: 68, category: 'physical', primary: 'info' },
    { name: 'Vertical', value: 75, category: 'physical', primary: 'info' },
    { name: 'Basketball IQ', value: 80, category: 'mental', primary: 'warning' },
    { name: 'Leadership', value: 60, category: 'mental', primary: 'warning' },
    { name: 'Decision Making', value: 73, category: 'mental', primary: 'warning' },
  ];

  // Calculate average for each category
  const technicalAvg = Math.floor(player.attributes.technical * 5); // Convert 0-20 scale to 0-100
  const physicalAvg = Math.floor(player.attributes.physical * 5);
  const mentalAvg = Math.floor(player.attributes.mental * 5);

  // Group attributes by category
  const technical = detailedAttributes.filter(attr => attr.category === 'technical');
  const physical = detailedAttributes.filter(attr => attr.category === 'physical');
  const mental = detailedAttributes.filter(attr => attr.category === 'mental');

  return (
    <div className="bg-neutral-850 border border-neutral-700 rounded-sm p-4">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-700">
        <div>
          <h2 className="text-sm font-semibold text-neutral-100">{player.name}</h2>
          <div className="flex items-center mt-1">
            <div className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {player.number}
            </div>
            <span className="text-xs text-neutral-400 ml-2">{player.position}</span>
          </div>
        </div>
      </div>

      {/* Main attributes with gauges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col items-center">
          <Gauge 
            size={70} 
            value={technicalAvg} 
            primary="success" 
            className="mb-2"
            showValue={false}
            strokeWidth={8}
          />
          <div className="text-center">
            <span className="text-xl font-bold text-green-500">{technicalAvg}</span>
            <p className="text-xs text-neutral-400 uppercase">Technical</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Gauge 
            size={70} 
            value={physicalAvg} 
            primary="info" 
            className="mb-2"
            showValue={false}
            strokeWidth={8}
          />
          <div className="text-center">
            <span className="text-xl font-bold text-blue-500">{physicalAvg}</span>
            <p className="text-xs text-neutral-400 uppercase">Physical</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <Gauge 
            size={70} 
            value={mentalAvg} 
            primary="warning" 
            className="mb-2"
            showValue={false}
            strokeWidth={8}
          />
          <div className="text-center">
            <span className="text-xl font-bold text-yellow-500">{mentalAvg}</span>
            <p className="text-xs text-neutral-400 uppercase">Mental</p>
          </div>
        </div>
      </div>

      {/* Detailed attributes */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs uppercase font-semibold text-green-500 mb-2">Technical</h3>
          <div className="space-y-2">
            {technical.map((attr, index) => (
              <AttributeBar key={`tech-${index}`} attribute={attr} />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xs uppercase font-semibold text-blue-500 mb-2">Physical</h3>
          <div className="space-y-2">
            {physical.map((attr, index) => (
              <AttributeBar key={`phys-${index}`} attribute={attr} />
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xs uppercase font-semibold text-yellow-500 mb-2">Mental</h3>
          <div className="space-y-2">
            {mental.map((attr, index) => (
              <AttributeBar key={`ment-${index}`} attribute={attr} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AttributeBar: React.FC<{ attribute: PlayerAttribute }> = ({ attribute }) => {
  const colorMap = {
    'success': 'from-green-500 to-green-700',
    'info': 'from-blue-500 to-blue-700',
    'warning': 'from-yellow-500 to-yellow-700',
    'danger': 'from-red-500 to-red-700'
  };

  const color = colorMap[attribute.primary || 'success'] || colorMap.success;

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-neutral-300">{attribute.name}</span>
        <span className="text-xs font-medium text-neutral-200">{attribute.value}</span>
      </div>
      <div className="h-1.5 w-full bg-neutral-700 rounded-full overflow-hidden">
        <motion.div 
          className={`h-full bg-gradient-to-r ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${attribute.value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default PlayerStats;