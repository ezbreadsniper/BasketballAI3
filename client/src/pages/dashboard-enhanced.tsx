import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Gauge } from '@/components/ui/gauge';
import { 
  Zap, 
  Calendar, 
  Award, 
  TrendingUp, 
  BarChart2, 
  Video, 
  BookOpen,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Star
} from 'lucide-react';

// Component for glass panel effect
const GlassPanel = ({ 
  children, 
  className = '', 
  hoverEffect = false
}: { 
  children: React.ReactNode, 
  className?: string,
  hoverEffect?: boolean
}) => (
  <motion.div 
    className={`bg-neutral-800/60 backdrop-blur-md border border-neutral-700/50 rounded-lg overflow-hidden shadow-lg ${className}`}
    whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : {}}
  >
    {children}
  </motion.div>
);

// Development Progress Card
const DevelopmentProgress = () => {
  const { data } = useQuery({
    queryKey: ['/api/player/development-summary'],
  });

  const progressData = data || [
    { label: 'Overall Progress', value: 78, change: '+4%', percentage: 78, icon: <TrendingUp />, color: 'text-blue-500' },
    { label: 'Technical Skills', value: 82, change: '+6%', percentage: 82, icon: <BarChart2 />, color: 'text-green-500' },
    { label: 'Physical Condition', value: 75, change: '+2%', percentage: 75, icon: <Zap />, color: 'text-orange-500' },
    { label: 'Mental Strength', value: 79, change: '+5%', percentage: 79, icon: <Award />, color: 'text-purple-500' }
  ];

  return (
    <GlassPanel className="p-4">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
        <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded-md mr-2">
          <TrendingUp size={18} />
        </span>
        Development Progress
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {progressData.map((item, index) => (
          <motion.div 
            key={index}
            className="flex flex-col items-center bg-neutral-900/50 rounded-md p-3 border border-neutral-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Gauge 
                value={item.percentage} 
                size={85} 
                primary={
                  item.label === 'Technical Skills' ? 'success' :
                  item.label === 'Physical Condition' ? 'warning' :
                  item.label === 'Mental Strength' ? 'info' : 'primary'
                }
                showValue={false}
                strokeWidth={8}
              />
            </div>
            <h3 className="text-white text-sm font-medium">{item.label}</h3>
            <div className="flex items-center mt-1">
              <span className="text-white text-xl font-bold">{item.value}</span>
              <span className={`text-xs ml-2 ${item.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                {item.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </GlassPanel>
  );
};

// AI Training Recommendations
const AIRecommendations = () => {
  const { data } = useQuery({
    queryKey: ['/api/training/recommendations'],
  });

  const recommendations = data || [
    { id: 1, title: 'Focus on Shooting Form', description: 'Your recent free throw percentage has dropped. We recommend working on your shooting form.', duration: '30 mins', priority: 'High', category: 'Shooting', icon: 'shooting' },
    { id: 2, title: 'Defensive Positioning Drills', description: 'Analysis shows your defensive stance could be improved for better on-court performance.', duration: '45 mins', priority: 'Medium', category: 'Defense', icon: 'defense' },
    { id: 3, title: 'Ball Handling Routine', description: 'Adding this routine to your practice will improve your ball control in game situations.', duration: '20 mins', priority: 'High', category: 'Ball Handling', icon: 'ball-handling' }
  ];

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-500/20 text-red-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Low': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Shooting': return 'bg-green-500/20 text-green-400';
      case 'Defense': return 'bg-blue-500/20 text-blue-400';
      case 'Ball Handling': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Shooting': return <Zap size={14} />;
      case 'Defense': return <Award size={14} />;
      case 'Ball Handling': return <TrendingUp size={14} />;
      default: return <Calendar size={14} />;
    }
  };

  return (
    <GlassPanel className="p-4">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
        <span className="bg-purple-500/20 text-purple-400 p-1.5 rounded-md mr-2">
          <Zap size={18} />
        </span>
        AI Training Recommendations
      </h2>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div 
            key={rec.id}
            className="bg-neutral-900/50 border border-neutral-800 rounded-md p-3 hover:border-primary transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 3 }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-white font-medium">{rec.title}</h3>
                <p className="text-neutral-400 text-sm mt-1">{rec.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-md text-xs ${getPriorityColor(rec.priority)} flex items-center`}>
                  {rec.priority}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center text-neutral-400">
                <Clock size={12} className="mr-1" />
                {rec.duration}
              </div>
              <div className={`px-2 py-1 rounded-md flex items-center ${getCategoryColor(rec.category)}`}>
                {getCategoryIcon(rec.category)}
                <span className="ml-1">{rec.category}</span>
              </div>
            </div>
          </motion.div>
        ))}
        <button className="w-full mt-3 flex items-center justify-center py-2 text-sm text-neutral-400 hover:text-white transition-colors">
          View all recommendations
          <ChevronRight size={14} className="ml-1" />
        </button>
      </div>
    </GlassPanel>
  );
};

// Recent Activities
const RecentActivities = () => {
  const { data } = useQuery({
    queryKey: ['/api/player/recent-activities'],
  });

  const activities = data || [
    { id: 1, title: 'Shooting Practice', subtitle: 'Free throws and 3-pointers', timestamp: '2 hours ago', duration: '45 mins', points: 150, type: 'workout' },
    { id: 2, title: 'Watched Game Analysis', subtitle: 'Defensive positioning', timestamp: 'Yesterday', duration: '35 mins', points: 75, type: 'video' },
    { id: 3, title: 'Stamina Assessment', subtitle: 'Conditioning evaluation', timestamp: '2 days ago', duration: '30 mins', points: 100, type: 'assessment' }
  ];

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'workout': return <Zap size={16} className="text-green-400" />;
      case 'video': return <Video size={16} className="text-blue-400" />;
      case 'assessment': return <BarChart2 size={16} className="text-purple-400" />;
      default: return <Calendar size={16} className="text-neutral-400" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'workout': return 'bg-green-500/10';
      case 'video': return 'bg-blue-500/10';
      case 'assessment': return 'bg-purple-500/10';
      default: return 'bg-neutral-500/10';
    }
  };

  return (
    <GlassPanel className="p-4">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
        <span className="bg-green-500/20 text-green-400 p-1.5 rounded-md mr-2">
          <Calendar size={18} />
        </span>
        Recent Activities
      </h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <motion.div 
            key={activity.id}
            className="flex items-center bg-neutral-900/50 border border-neutral-800 rounded-md p-3 hover:border-primary transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.type)} flex items-center justify-center mr-3`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-grow">
              <h3 className="text-white font-medium">{activity.title}</h3>
              <p className="text-neutral-400 text-xs">{activity.subtitle}</p>
            </div>
            <div className="text-right">
              <div className="text-neutral-300 text-xs">{activity.timestamp}</div>
              <div className="text-neutral-400 text-xs mt-1">{activity.duration}</div>
            </div>
            <div className="ml-4 flex-shrink-0 bg-primary/20 text-primary rounded-md px-2 py-1 text-xs font-medium">
              +{activity.points} pts
            </div>
          </motion.div>
        ))}
        <button className="w-full mt-3 flex items-center justify-center py-2 text-sm text-neutral-400 hover:text-white transition-colors">
          View activity history
          <ChevronRight size={14} className="ml-1" />
        </button>
      </div>
    </GlassPanel>
  );
};

// Training Resources
const TrainingResources = () => {
  const { data } = useQuery({
    queryKey: ['/api/training/resources'],
  });

  const resources = data || [
    { id: 1, title: 'Free Throw Form Breakdown', description: 'Learn proper form for consistent free throws', duration: '15 mins', category: 'Shooting' },
    { id: 2, title: 'Defensive Stance Drills', description: 'Improve your defensive positioning with these exercises', duration: '22 mins', category: 'Defense' },
    { id: 3, title: 'Advanced Ball Handling', description: 'Take your dribbling skills to the next level', duration: '18 mins', category: 'Ball Handling' }
  ];

  const firstThree = resources ? resources.slice(0, 3) : [];

  return (
    <GlassPanel className="p-4">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
        <span className="bg-orange-500/20 text-orange-400 p-1.5 rounded-md mr-2">
          <BookOpen size={18} />
        </span>
        Training Library
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {firstThree.map((resource, index) => (
          <motion.div 
            key={resource.id}
            className="group bg-neutral-900/50 border border-neutral-800 rounded-md overflow-hidden hover:border-primary transition-colors"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -3 }}
          >
            <div className="h-32 bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-primary/20 backdrop-blur-md flex items-center justify-center">
                <Video className="text-white h-7 w-7" />
              </div>
              
              <div className="absolute bottom-2 right-2 bg-neutral-900/80 text-white text-xs px-2 py-0.5 rounded-md backdrop-blur-sm">
                {resource.duration}
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-white font-medium truncate group-hover:text-primary transition-colors">{resource.title}</h3>
              <p className="text-neutral-400 text-xs mt-1 line-clamp-2">{resource.description}</p>
              <div className="mt-2 flex items-center">
                <div className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-md">
                  {resource.category}
                </div>
                <div className="ml-auto flex text-amber-400">
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="fill-current" />
                  <Star size={12} className="text-neutral-600" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <button className="w-full mt-3 flex items-center justify-center py-2 text-sm text-neutral-400 hover:text-white transition-colors">
        View all resources
        <ChevronRight size={14} className="ml-1" />
      </button>
    </GlassPanel>
  );
};

// Quick Stats Card
const QuickStats = () => {
  const { data: profileData } = useQuery({
    queryKey: ['/api/player/profile-overview'],
  });

  const statsData = [
    { label: 'Shooting', value: profileData?.techScore || 82, color: 'from-green-500 to-emerald-700' },
    { label: 'Speed', value: profileData?.speedScore || 88, color: 'from-blue-500 to-indigo-700' },
    { label: 'Endurance', value: profileData?.enduranceScore || 76, color: 'from-orange-500 to-amber-700' },
    { label: 'Decision making', value: profileData?.decisionMakingScore || 79, color: 'from-purple-500 to-fuchsia-700' },
  ];

  return (
    <GlassPanel className="p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-white mb-3 flex items-center">
        <span className="bg-red-500/20 text-red-400 p-1.5 rounded-md mr-2">
          <BarChart2 size={18} />
        </span>
        Quick Stats
      </h2>
      <div className="flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-3">
          {statsData.map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-neutral-900/50 rounded-md p-3 flex flex-col items-center border border-neutral-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-full h-1.5 bg-neutral-800 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.value}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="text-white font-bold text-xl">{stat.value}</div>
              <div className="text-neutral-400 text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        <motion.button 
          className="mt-4 w-full bg-gradient-to-r from-primary/90 to-primary/70 text-white py-2 rounded-md backdrop-blur-sm font-medium flex items-center justify-center"
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          View Full Performance Analysis
          <ArrowUpRight size={16} className="ml-1" />
        </motion.button>
      </div>
    </GlassPanel>
  );
};

export default function DashboardEnhanced() {
  return (
    <div className="p-4 pb-0">
      {/* Hero section with player name and overall stats */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Welcome back, Marcus Johnson
        </h1>
        <p className="text-neutral-400">Your basketball development dashboard • April 9, 2025</p>
      </motion.div>
      
      {/* Main dashboard grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <DevelopmentProgress />
        </div>
        <div>
          <QuickStats />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <AIRecommendations />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>
      
      <div className="mb-4">
        <TrainingResources />
      </div>
    </div>
  );
}