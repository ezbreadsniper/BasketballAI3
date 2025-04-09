import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { User, BarChart2, Brain, ChevronRight } from "lucide-react";
import SkillsRadarChart from "../charts/SkillsRadarChart";

interface PhysicalMetric {
  name: string;
  value: number;
  maxValue: number;
}

interface BasketballIQMetric {
  name: string;
  value: number;
  maxValue: number;
}

interface PlayerProfileData {
  physicalMetrics: PhysicalMetric[];
  basketballIQMetrics: BasketballIQMetric[];
  radarData: {
    playerSkills: number[];
    positionAverage: number[];
  };
}

export default function PlayerProfileOverview() {
  const { data, isLoading } = useQuery<PlayerProfileData>({
    queryKey: ['/api/player/profile-overview'],
  });

  const defaultPhysicalMetrics: PhysicalMetric[] = [
    { name: "Speed", value: 7.8, maxValue: 10 },
    { name: "Strength", value: 6.5, maxValue: 10 },
    { name: "Vertical", value: 7.0, maxValue: 10 },
    { name: "Agility", value: 8.2, maxValue: 10 },
    { name: "Endurance", value: 7.4, maxValue: 10 }
  ];

  const defaultBasketballIQMetrics: BasketballIQMetric[] = [
    { name: "Court Vision", value: 8.0, maxValue: 10 },
    { name: "Decision Making", value: 7.2, maxValue: 10 },
    { name: "Defensive Reading", value: 6.8, maxValue: 10 },
    { name: "Tactical Awareness", value: 7.6, maxValue: 10 },
    { name: "Game Management", value: 7.5, maxValue: 10 }
  ];

  const radarData = {
    playerSkills: [64, 75, 68, 71, 75, 78],
    positionAverage: [70, 65, 60, 65, 70, 75]
  };

  if (isLoading) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-sm mb-4">
        <div className="border-b border-neutral-700 px-3 py-2">
          <Skeleton className="h-5 w-40 bg-neutral-700" />
        </div>
        <div className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/3">
              <Skeleton className="h-56 w-full bg-neutral-700" />
            </div>
            <div className="lg:w-1/3 space-y-3">
              <Skeleton className="h-5 w-28 bg-neutral-700" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 bg-neutral-700" />
                    <Skeleton className="h-3 w-10 bg-neutral-700" />
                  </div>
                  <Skeleton className="h-2 w-full bg-neutral-700" />
                </div>
              ))}
            </div>
            <div className="lg:w-1/3 space-y-3">
              <Skeleton className="h-5 w-28 bg-neutral-700" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 bg-neutral-700" />
                    <Skeleton className="h-3 w-10 bg-neutral-700" />
                  </div>
                  <Skeleton className="h-2 w-full bg-neutral-700" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const physicalMetrics = data?.physicalMetrics || defaultPhysicalMetrics;
  const basketballIQMetrics = data?.basketballIQMetrics || defaultBasketballIQMetrics;
  const chartData = data?.radarData || radarData;

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-sm h-full">
      <div className="flex items-center justify-between border-b border-neutral-700 px-3 py-2">
        <div className="flex items-center">
          <User className="h-3.5 w-3.5 text-neutral-400 mr-2" />
          <h2 className="text-xs font-semibold text-neutral-100 uppercase">Marcus Johnson - Point Guard</h2>
        </div>
        <a href="/profile" className="flex items-center text-xs text-primary hover:text-primary/80">
          Full Profile
          <ChevronRight className="h-3 w-3 ml-1" />
        </a>
      </div>
      
      <div className="p-3">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Radar Chart */}
          <div className="lg:w-1/3 bg-neutral-750 border border-neutral-700 rounded-sm p-3">
            <div className="chart-container h-52">
              <SkillsRadarChart playerData={chartData.playerSkills} positionAverage={chartData.positionAverage} />
            </div>
            <div className="mt-2 border-t border-neutral-700 pt-2">
              <div className="flex text-xs justify-center space-x-6">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-primary rounded-full mr-1"></div>
                  <span className="text-neutral-300">Player</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-blue-600 rounded-full mr-1"></div>
                  <span className="text-neutral-300">Position Avg</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Physical Attributes */}
          <div className="lg:w-1/3">
            <div className="flex items-center mb-2">
              <BarChart2 className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
              <h3 className="text-xs font-medium text-neutral-200">Physical Attributes</h3>
            </div>
            
            <div className="space-y-2.5">
              {physicalMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400">{metric.name}</span>
                    <span className="text-xs font-medium text-neutral-200">{metric.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full bg-neutral-700 rounded-sm">
                    <div 
                      className={`h-1.5 rounded-sm ${Math.round(metric.value) >= 8 ? 'bg-green-600' : Math.round(metric.value) >= 6 ? 'bg-blue-600' : 'bg-yellow-600'}`}
                      style={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Basketball IQ */}
          <div className="lg:w-1/3">
            <div className="flex items-center mb-2">
              <Brain className="h-3.5 w-3.5 text-green-400 mr-1.5" />
              <h3 className="text-xs font-medium text-neutral-200">Basketball IQ</h3>
            </div>
            
            <div className="space-y-2.5">
              {basketballIQMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-400">{metric.name}</span>
                    <span className="text-xs font-medium text-neutral-200">{metric.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full bg-neutral-700 rounded-sm">
                    <div 
                      className={`h-1.5 rounded-sm ${Math.round(metric.value) >= 8 ? 'bg-green-600' : Math.round(metric.value) >= 6 ? 'bg-blue-600' : 'bg-yellow-600'}`}
                      style={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
