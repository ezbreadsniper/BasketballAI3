import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, ChevronUp, ChevronDown, Dumbbell, Target, Activity } from "lucide-react";

interface DevelopmentMetric {
  label: string;
  value: string | number;
  change: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

export default function DevelopmentSummary() {
  const { data: metrics, isLoading } = useQuery<DevelopmentMetric[]>({
    queryKey: ['/api/player/development-summary'],
  });

  if (isLoading) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-3 mb-4">
        <Skeleton className="h-5 w-48 mb-3 bg-neutral-700" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-b border-neutral-700 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 bg-neutral-700" />
                <Skeleton className="h-4 w-12 bg-neutral-700" />
              </div>
              <Skeleton className="h-2 w-full mt-2 bg-neutral-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default metrics if API returns nothing
  const defaultMetrics: DevelopmentMetric[] = [
    {
      label: "Overall Rating",
      value: "78",
      change: "+3",
      percentage: 78,
      icon: <Target className="h-3.5 w-3.5" />,
      color: "bg-green-600"
    },
    {
      label: "Shooting",
      value: "64",
      change: "+5",
      percentage: 64,
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      color: "bg-blue-600"
    },
    {
      label: "Athleticism",
      value: "70",
      change: "+2",
      percentage: 70,
      icon: <Dumbbell className="h-3.5 w-3.5" />,
      color: "bg-yellow-600"
    }
  ];

  const displayMetrics = metrics || defaultMetrics;

  const getChangeIcon = (change: string) => {
    if (change.startsWith('+')) {
      return <ChevronUp className="h-3 w-3 text-green-400" />;
    } else if (change.startsWith('-')) {
      return <ChevronDown className="h-3 w-3 text-red-400" />;
    }
    return null;
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-sm h-full">
      <div className="flex items-center justify-between border-b border-neutral-700 px-3 py-2">
        <h2 className="text-xs font-semibold text-neutral-100 uppercase">Development Progress</h2>
        <Activity className="h-3.5 w-3.5 text-neutral-400" />
      </div>
      <div className="p-3">
        <div className="space-y-3">
          {displayMetrics.map((metric, index) => (
            <div key={index} className="border-b border-neutral-700 pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-sm flex items-center justify-center ${metric.color} mr-2`}>
                    {metric.icon}
                  </div>
                  <span className="text-xs text-neutral-300">{metric.label}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-neutral-100 mr-1.5">{metric.value}</span>
                  <div className="flex items-center">
                    {getChangeIcon(metric.change)}
                    <span className={`text-xs ml-0.5 ${metric.change.startsWith('+') ? 'text-green-400' : metric.change.startsWith('-') ? 'text-red-400' : 'text-neutral-400'}`}>
                      {metric.change.replace(/[+-]/, '')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-1.5 w-full bg-neutral-700 rounded-sm">
                <div 
                  className={`h-1.5 ${metric.color} rounded-sm`} 
                  style={{ width: `${metric.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
