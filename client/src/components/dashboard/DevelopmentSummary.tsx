import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpCircle } from "lucide-react";

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
      <div className="mb-8">
        <Skeleton className="h-7 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start">
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-20 mb-1" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
              <Skeleton className="h-2 w-full mt-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default metrics if API returns nothing
  const defaultMetrics: DevelopmentMetric[] = [
    {
      label: "Overall Progress",
      value: "78%",
      change: "+3% this month",
      percentage: 78,
      icon: <ArrowUpCircle className="h-6 w-6 text-primary" />,
      color: "bg-primary"
    },
    {
      label: "Shooting Accuracy",
      value: "64%",
      change: "+5% this month",
      percentage: 64,
      icon: <ArrowUpCircle className="h-6 w-6 text-secondary" />,
      color: "bg-secondary"
    },
    {
      label: "Vertical Jump",
      value: '28"',
      change: '+2" this month',
      percentage: 70,
      icon: <ArrowUpCircle className="h-6 w-6 text-accent" />,
      color: "bg-accent"
    }
  ];

  const displayMetrics = metrics || defaultMetrics;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-neutral-900 mb-4">Development Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-500 mb-1">{metric.label}</p>
                <div className="flex items-end">
                  <span className="text-2xl font-bold text-neutral-900">{metric.value}</span>
                  <span className="ml-2 text-sm font-medium text-success">{metric.change}</span>
                </div>
              </div>
              <div className={`p-2 ${metric.color} bg-opacity-10 rounded-lg`}>
                {metric.icon}
              </div>
            </div>
            <div className="mt-4 h-2 w-full bg-neutral-200 rounded-full">
              <div className={`h-2 ${metric.color} rounded-full`} style={{ width: `${metric.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
