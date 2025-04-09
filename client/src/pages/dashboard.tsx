import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Download, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="py-4 px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <Skeleton className="h-6 w-64 mb-1" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Get current date for Football Manager style header
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  return (
    <div className="py-4 px-3 sm:px-4 lg:px-6">
      {/* Football Manager style header with date and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="text-sm text-neutral-400">{formattedDate}</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100">Player Development Hub</h1>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button size="sm" variant="outline" className="inline-flex items-center text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Log Training
          </Button>
          <Button size="sm" variant="outline" className="inline-flex items-center text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Football Manager style tabs for different dashboard views */}
      <Tabs defaultValue="overview" className="w-full mb-6">
        <TabsList className="bg-neutral-800 border-b border-neutral-700 p-0 h-auto mb-6">
          <TabsTrigger value="overview" className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none">
            Overview
          </TabsTrigger>
          <TabsTrigger value="player" className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none">
            Player Profile
          </TabsTrigger>
          <TabsTrigger value="training" className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none">
            Training Schedule
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none">
            Statistics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="m-0">
          {/* Development Summary */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
            <div className="xl:col-span-1">
              <DevelopmentSummary />
            </div>
            <div className="xl:col-span-2">
              <PlayerProfileOverview />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* AI Training Recommendations */}
            <AITrainingRecommendations />

            {/* Training Library */}
            <TrainingLibrary />
          </div>

          {/* Recent Activities */}
          <div className="mt-4">
            <RecentActivities />
          </div>
        </TabsContent>
        
        <TabsContent value="player" className="m-0">
          <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
            <h2 className="text-sm font-medium text-neutral-100 mb-2">Player Profile Details</h2>
            <p className="text-xs text-neutral-400">Switch to the Player Profile page for complete information.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="m-0">
          <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
            <h2 className="text-sm font-medium text-neutral-100 mb-2">Training Schedule</h2>
            <p className="text-xs text-neutral-400">Switch to the Training Schedule page for complete information.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="stats" className="m-0">
          <div className="bg-neutral-800 border border-neutral-700 rounded p-4">
            <h2 className="text-sm font-medium text-neutral-100 mb-2">Player Statistics</h2>
            <p className="text-xs text-neutral-400">Switch to the Statistics page for complete information.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
