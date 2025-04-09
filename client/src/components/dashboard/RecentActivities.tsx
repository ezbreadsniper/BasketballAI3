import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Eye, Info } from "lucide-react";

interface Activity {
  id: number;
  title: string;
  subtitle: string;
  timestamp: string;
  duration: string;
  points: number;
  type: 'workout' | 'video' | 'assessment';
}

export default function RecentActivities() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ['/api/player/recent-activities'],
  });

  if (isLoading) {
    return (
      <div className="mt-8 mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 border-b border-neutral-200 flex items-center">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-4 flex-1">
                <Skeleton className="h-5 w-56 mb-1" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default activities if API returns nothing
  const defaultActivities: Activity[] = [
    {
      id: 1,
      title: "Shooting Form Workout",
      subtitle: "Today, 2:30 PM • 45 minutes",
      timestamp: "2:30 PM",
      duration: "45 minutes",
      points: 15,
      type: "workout"
    },
    {
      id: 2,
      title: "Free Throw Form Breakdown",
      subtitle: "Yesterday, 7:15 PM • 8 minutes",
      timestamp: "7:15 PM",
      duration: "8 minutes",
      points: 5,
      type: "video"
    },
    {
      id: 3,
      title: "Vertical Jump Assessment",
      subtitle: "2 days ago • 28 inches",
      timestamp: "5:45 PM",
      duration: "",
      points: 0,
      type: "assessment"
    }
  ];

  const displayActivities = activities || defaultActivities;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return (
          <div className="h-10 w-10 rounded-full bg-primary-light bg-opacity-20 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-primary" />
          </div>
        );
      case 'video':
        return (
          <div className="h-10 w-10 rounded-full bg-accent bg-opacity-20 flex items-center justify-center">
            <Eye className="h-5 w-5 text-accent" />
          </div>
        );
      case 'assessment':
        return (
          <div className="h-10 w-10 rounded-full bg-secondary bg-opacity-20 flex items-center justify-center">
            <Info className="h-5 w-5 text-secondary" />
          </div>
        );
      default:
        return (
          <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center">
            <Info className="h-5 w-5 text-neutral-500" />
          </div>
        );
    }
  };

  const getPointsBadge = (activity: Activity) => {
    if (activity.points > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success bg-opacity-10 text-success">
          +{activity.points} points
        </span>
      );
    }
    
    if (activity.type === 'assessment') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary">
          +2 inches
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Recent Activities</h2>
        <button className="text-sm font-medium text-secondary hover:text-secondary-dark">View All</button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {displayActivities.map((activity, index) => (
          <div 
            key={activity.id} 
            className={`p-6 ${index !== displayActivities.length - 1 ? 'border-b border-neutral-200' : ''} flex items-center`}
          >
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-900">
                {activity.type === 'workout' && 'Completed '}
                {activity.type === 'video' && 'Watched '}
                {activity.type === 'assessment' && 'Added new '}
                <span className="font-semibold">{activity.title}</span>
              </p>
              <p className="text-xs text-neutral-500 mt-1">{activity.subtitle}</p>
            </div>
            <div className="ml-auto">
              {getPointsBadge(activity)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
