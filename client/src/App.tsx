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
import Resources from "@/pages/resources";
import Analytics from "@/pages/analytics";
import Progress from "@/pages/progress";
import PlayerAssessment from "@/pages/player-assessment";
import InjuryManagement from "@/pages/injury-management";
import AuthPage from "./pages/auth-page";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      <ProtectedRoute path="/" component={() => (
        <AppLayout>
          <Dashboard />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/profile" component={() => (
        <AppLayout>
          <Profile />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/training-plans" component={() => (
        <AppLayout>
          <TrainingPlans />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/player-assessment" component={() => (
        <AppLayout>
          <PlayerAssessment />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/team" component={() => (
        <AppLayout>
          <Team />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/resources" component={() => (
        <AppLayout>
          <Resources />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/analytics" component={() => (
        <AppLayout>
          <Analytics />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/progress" component={() => (
        <AppLayout>
          <Progress />
        </AppLayout>
      )} />
      
      <ProtectedRoute path="/injury-management" component={() => (
        <AppLayout>
          <InjuryManagement />
        </AppLayout>
      )} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
