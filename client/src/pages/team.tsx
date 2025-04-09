import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Team() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">My Team</h1>
        <p className="text-neutral-600">Manage your team and track player performance</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="roster">Roster</TabsTrigger>
          <TabsTrigger value="practices">Practices</TabsTrigger>
          <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">Coming soon. This feature is under development.</p>
              <Button>Join or Create Team</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roster">
          <Card>
            <CardHeader>
              <CardTitle>Team Roster</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Coming soon. This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="practices">
          <Card>
            <CardHeader>
              <CardTitle>Practice Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Coming soon. This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Coming soon. This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
