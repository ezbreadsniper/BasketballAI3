import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DevelopmentSummary from "@/components/dashboard/DevelopmentSummary";
import PlayerProfileOverview from "@/components/dashboard/PlayerProfileOverview";
import AITrainingRecommendations from "@/components/dashboard/AITrainingRecommendations";
import TrainingLibrary from "@/components/dashboard/TrainingLibrary";
import RecentActivities from "@/components/dashboard/RecentActivities";
import { User } from "@shared/schema";

export default function Dashboard() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user/current'],
  });

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-1" />
            <Skeleton className="h-5 w-96" />
          </div>
        </div>
        <DevelopmentSummary />
        <PlayerProfileOverview />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
        <Skeleton className="h-80 mt-8" />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Player Dashboard</h1>
          <p className="text-neutral-600">Track your progress and follow your development plan</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button className="inline-flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Log Training
          </Button>
          <Button variant="outline" className="inline-flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Development Summary */}
      <DevelopmentSummary />

      {/* Player Profile Overview */}
      <PlayerProfileOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Training Recommendations */}
        <AITrainingRecommendations />

        {/* Training Library */}
        <TrainingLibrary />
      </div>

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  );
}
