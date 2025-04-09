import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Eye, LineChart, Clock, History, ChevronRight, ArrowUpRight } from "lucide-react";

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
      <div className="bg-neutral-800 border border-neutral-700 rounded-sm mt-4">
        <div className="border-b border-neutral-700 px-3 py-2">
          <Skeleton className="h-5 w-40 bg-neutral-700" />
        </div>
        <div className="px-3 divide-y divide-neutral-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-3 flex items-start">
              <Skeleton className="h-6 w-6 rounded-sm bg-neutral-700" />
              <div className="ml-3 flex-1">
                <Skeleton className="h-3.5 w-48 mb-1 bg-neutral-700" />
                <Skeleton className="h-3 w-32 bg-neutral-700" />
              </div>
              <Skeleton className="h-5 w-12 bg-neutral-700" />
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
  
  const formatTimeAgo = (subtitle: string): string => {
    // Simple extraction of the time portion from the subtitle
    if (!subtitle) return "";
    
    if (subtitle.includes("Today")) {
      return "Today";
    } else if (subtitle.includes("Yesterday")) {
      return "Yesterday"; 
    } else {
      const match = subtitle.match(/(\d+)\s+days?\s+ago/);
      return match ? `${match[1]}d ago` : "";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'workout':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'video':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'assessment':
        return <LineChart className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-neutral-500" />;
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'workout':
        return 'text-green-500';
      case 'video':
        return 'text-blue-500';
      case 'assessment':
        return 'text-yellow-500';
      default:
        return 'text-neutral-500';
    }
  };

  const getPointsBadge = (activity: Activity) => {
    if (activity.points > 0) {
      return (
        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-green-900 text-green-400 rounded-sm">
          +{activity.points}
        </span>
      );
    }
    
    if (activity.type === 'assessment') {
      return (
        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-blue-900 text-blue-400 rounded-sm">
          +2"
        </span>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-sm mt-4">
      <div className="flex items-center justify-between border-b border-neutral-700 px-3 py-2">
        <div className="flex items-center">
          <History className="h-3.5 w-3.5 text-neutral-400 mr-2" />
          <h2 className="text-xs font-semibold text-neutral-100 uppercase">Recent Activities</h2>
        </div>
        <a href="/progress" className="flex items-center text-xs text-primary hover:text-primary/80">
          View All
          <ChevronRight className="h-3 w-3 ml-1" />
        </a>
      </div>
      
      <div className="divide-y divide-neutral-700">
        {displayActivities.map((activity) => (
          <div 
            key={activity.id} 
            className="px-3 py-3 hover:bg-neutral-750 transition-colors"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <div className={`w-6 h-6 border border-neutral-700 rounded-sm flex items-center justify-center bg-neutral-750`}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-neutral-100 mb-0.5">
                      {activity.title}
                    </p>
                    <div className="flex items-center">
                      <span className={`text-[10px] ${getActivityTypeColor(activity.type)}`}>
                        {activity.type === 'workout' ? 'Training' : 
                         activity.type === 'video' ? 'Video' : 'Assessment'}
                      </span>
                      <span className="text-[10px] text-neutral-500 mx-1.5">•</span>
                      <span className="text-[10px] text-neutral-500">{formatTimeAgo(activity.subtitle)}</span>
                      {activity.duration && (
                        <>
                          <span className="text-[10px] text-neutral-500 mx-1.5">•</span>
                          <span className="text-[10px] text-neutral-500 flex items-center">
                            <Clock className="h-2.5 w-2.5 mr-0.5" />
                            {activity.duration}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {getPointsBadge(activity)}
                    <button className="ml-2 text-primary opacity-0 hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
