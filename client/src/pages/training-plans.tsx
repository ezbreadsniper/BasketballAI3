import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";

export default function TrainingPlans() {
  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/training/plans'],
  });

  if (isLoading) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-1" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-40 mt-4 md:mt-0" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Training Plans</h1>
          <p className="text-neutral-600">Access and manage your personalized training programs</p>
        </div>
        <Button className="mt-4 md:mt-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Training Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center p-6 h-64">
          <div className="rounded-full w-12 h-12 bg-neutral-100 flex items-center justify-center mb-4">
            <PlusCircle className="h-6 w-6 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Create Custom Plan</h3>
          <p className="text-sm text-neutral-500 text-center mb-4">Design a training plan tailored to your specific needs</p>
          <Button variant="outline">Get Started</Button>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">3-Point Shooting Master</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-neutral-600 mb-4">
              <p>Comprehensive plan to improve your 3-point shooting accuracy and consistency</p>
              <div className="flex items-center mt-3 text-xs text-neutral-500">
                <span>8 weeks</span>
                <span className="mx-2">•</span>
                <span>4 sessions/week</span>
                <span className="mx-2">•</span>
                <span>High priority</span>
              </div>
            </div>
            <div className="h-2 w-full bg-neutral-200 rounded-full mb-3">
              <div className="h-2 bg-primary rounded-full" style={{ width: '25%' }}></div>
            </div>
            <div className="flex justify-between text-xs mb-4">
              <span>25% complete</span>
              <span>2/8 weeks</span>
            </div>
            <Button variant="outline" className="w-full">Continue Plan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Explosive First Step</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-neutral-600 mb-4">
              <p>Athleticism training to develop an explosive first step and improve driving ability</p>
              <div className="flex items-center mt-3 text-xs text-neutral-500">
                <span>6 weeks</span>
                <span className="mx-2">•</span>
                <span>3 sessions/week</span>
                <span className="mx-2">•</span>
                <span>Medium priority</span>
              </div>
            </div>
            <div className="h-2 w-full bg-neutral-200 rounded-full mb-3">
              <div className="h-2 bg-primary rounded-full" style={{ width: '50%' }}></div>
            </div>
            <div className="flex justify-between text-xs mb-4">
              <span>50% complete</span>
              <span>3/6 weeks</span>
            </div>
            <Button variant="outline" className="w-full">Continue Plan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Elite Defender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-neutral-600 mb-4">
              <p>Defensive training program focusing on footwork, positioning, and reaction time</p>
              <div className="flex items-center mt-3 text-xs text-neutral-500">
                <span>4 weeks</span>
                <span className="mx-2">•</span>
                <span>5 sessions/week</span>
                <span className="mx-2">•</span>
                <span>Medium priority</span>
              </div>
            </div>
            <div className="h-2 w-full bg-neutral-200 rounded-full mb-3">
              <div className="h-2 bg-primary rounded-full" style={{ width: '10%' }}></div>
            </div>
            <div className="flex justify-between text-xs mb-4">
              <span>10% complete</span>
              <span>3 days in</span>
            </div>
            <Button variant="outline" className="w-full">Continue Plan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Ball Handling Mastery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-neutral-600 mb-4">
              <p>Advanced dribbling techniques and drills to improve ball control and confidence</p>
              <div className="flex items-center mt-3 text-xs text-neutral-500">
                <span>6 weeks</span>
                <span className="mx-2">•</span>
                <span>Daily practice</span>
                <span className="mx-2">•</span>
                <span>High priority</span>
              </div>
            </div>
            <Button variant="outline" className="w-full">Start Plan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
