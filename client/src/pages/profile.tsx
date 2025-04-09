import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@shared/schema";

export default function Profile() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user/current'],
  });

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">My Profile</h1>
        <p className="text-neutral-600">View and manage your player profile</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="skills">Skills Assessment</TabsTrigger>
          <TabsTrigger value="physical">Physical Metrics</TabsTrigger>
          <TabsTrigger value="history">Training History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Manage your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">Coming soon. This page is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="skills">
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>
                Track your basketball skills progress over time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">Coming soon. This page is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="physical">
          <Card>
            <CardHeader>
              <CardTitle>Physical Metrics</CardTitle>
              <CardDescription>
                View your physical development and test results
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">Coming soon. This page is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Training History</CardTitle>
              <CardDescription>
                Review your past training sessions and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg">Coming soon. This page is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
