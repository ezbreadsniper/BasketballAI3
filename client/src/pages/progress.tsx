import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Progress() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Progress Tracking</h1>
        <p className="text-neutral-600">Monitor your improvement and development over time</p>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="timeline">Development Timeline</TabsTrigger>
          <TabsTrigger value="goals">Goals & Milestones</TabsTrigger>
          <TabsTrigger value="comparison">Benchmark Comparison</TabsTrigger>
          <TabsTrigger value="reports">Progress Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="timeline">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Development Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-4">Coming soon. This feature is under development.</p>
              <Button>Add Progress Entry</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Goals & Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Coming soon. This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Benchmark Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">Coming soon. This feature is under development.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Progress Reports</CardTitle>
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
