import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import TrainingPlans from "@/pages/training-plans";
import Team from "@/pages/team";
import TeamEnhanced from "@/pages/team-enhanced";
import Resources from "@/pages/resources";
import Analytics from "@/pages/analytics";
import Progress from "@/pages/progress";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/profile" component={Profile} />
        <Route path="/training-plans" component={TrainingPlans} />
        <Route path="/team" component={TeamEnhanced} />
        <Route path="/team-old" component={Team} />
        <Route path="/resources" component={Resources} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/progress" component={Progress} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
