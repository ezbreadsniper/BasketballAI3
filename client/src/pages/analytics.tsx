import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Analytics() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Performance Analytics</h1>
        <p className="text-neutral-600">Track and analyze your basketball performance metrics</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="shooting">Shooting</TabsTrigger>
          <TabsTrigger value="physical">Physical</TabsTrigger>
          <TabsTrigger value="game">Game Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Performance Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">Coming soon. This feature is under development.</p>
              <Button>Record New Performance Data</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shooting">
          <Card>
            <CardHeader>
              <CardTitle>Shooting Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Coming soon. This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="physical">
          <Card>
            <CardHeader>
              <CardTitle>Physical Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Coming soon. This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="game">
          <Card>
            <CardHeader>
              <CardTitle>Game Statistics</CardTitle>
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
