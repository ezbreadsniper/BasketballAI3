import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
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
      <div className="mb-8">
        <Skeleton className="h-7 w-40 mb-4" />
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
              <Skeleton className="h-56 w-full" />
            </div>
            <div className="md:w-1/3 mb-6 md:mb-0 md:px-4">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/3 md:pl-6 border-t md:border-t-0 md:border-l border-neutral-200 pt-6 md:pt-0">
              <Skeleton className="h-5 w-40 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
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
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Player Profile</h2>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
            <div className="chart-container h-64">
              <SkillsRadarChart playerData={chartData.playerSkills} positionAverage={chartData.positionAverage} />
            </div>
            <div className="text-center mt-4">
              <span className="text-sm font-medium text-neutral-500">Skills Assessment</span>
            </div>
          </div>
          <div className="md:w-1/3 mb-6 md:mb-0 md:px-4">
            <h3 className="text-sm font-semibold text-neutral-900 uppercase mb-4">Physical Metrics</h3>
            <div className="space-y-4">
              {physicalMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700">{metric.name}</span>
                    <span className="text-sm font-medium text-neutral-900">{metric.value} / {metric.maxValue}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${(metric.value / metric.maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:w-1/3 md:pl-6 border-t md:border-t-0 md:border-l border-neutral-200 pt-6 md:pt-0">
            <h3 className="text-sm font-semibold text-neutral-900 uppercase mb-4">Basketball IQ</h3>
            <div className="space-y-4">
              {basketballIQMetrics.map((metric, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700">{metric.name}</span>
                    <span className="text-sm font-medium text-neutral-900">{metric.value} / {metric.maxValue}</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 rounded-full">
                    <div 
                      className="h-2 bg-secondary rounded-full" 
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
