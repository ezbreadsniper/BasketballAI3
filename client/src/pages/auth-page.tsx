import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, ClipboardCheck, Target } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

const registerSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, {
    message: "Full name is required",
  }),
  role: z.enum(["player", "coach"], {
    required_error: "Please select a role",
  }),
  position: z.string().optional(),
  team: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  
  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  
  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      role: "player",
      position: "",
      team: "",
    },
  });
  
  const onLoginSubmit = async (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };
  
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    // Destructure to remove confirmPassword which isn't needed for the API
    const { confirmPassword, ...registerData } = values;
    registerMutation.mutate(registerData);
  };
  
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-neutral-900">
      {/* Left side - Auth form */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center p-6 md:p-10">
        <div className="flex items-center mb-8">
          <Target className="text-primary h-8 w-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">HoopAI</h1>
        </div>
        
        <Card className="w-full max-w-md bg-neutral-800 border-neutral-700 text-neutral-100 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl text-center text-white">Welcome to HoopAI</CardTitle>
            <CardDescription className="text-center text-neutral-400">
              Sign in or create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="login" 
              className="w-full" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-neutral-700">
                <TabsTrigger value="login" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-sm data-[state=active]:bg-primary data-[state=active]:text-white">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300">Username</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter username" 
                              className="bg-neutral-700 border-neutral-600 text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300">Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="••••••••" 
                              className="bg-neutral-700 border-neutral-600 text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-neutral-400">
                    Don't have an account?{" "}
                    <button 
                      onClick={() => setActiveTab("register")}
                      className="text-primary hover:underline"
                    >
                      Register
                    </button>
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="register">
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300">Full Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              className="bg-neutral-700 border-neutral-600 text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300">Username</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Choose a username" 
                                className="bg-neutral-700 border-neutral-600 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300">I am a</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                                  <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
                                <SelectItem value="player">Player</SelectItem>
                                <SelectItem value="coach">Coach</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {registerForm.watch("role") === "player" && (
                      <FormField
                        control={registerForm.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300">Position</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-neutral-700 border-neutral-600 text-white">
                                  <SelectValue placeholder="Select your position" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-neutral-700 border-neutral-600 text-white">
                                <SelectItem value="PG">Point Guard (PG)</SelectItem>
                                <SelectItem value="SG">Shooting Guard (SG)</SelectItem>
                                <SelectItem value="SF">Small Forward (SF)</SelectItem>
                                <SelectItem value="PF">Power Forward (PF)</SelectItem>
                                <SelectItem value="C">Center (C)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={registerForm.control}
                      name="team"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-300">
                            {registerForm.watch("role") === "player" ? "Your Team" : "Team You Coach"}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter team name" 
                              className="bg-neutral-700 border-neutral-600 text-white" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300">Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="bg-neutral-700 border-neutral-600 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-neutral-300">Confirm Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="••••••••" 
                                className="bg-neutral-700 border-neutral-600 text-white" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
                <div className="mt-4 text-center">
                  <p className="text-sm text-neutral-400">
                    Already have an account?{" "}
                    <button 
                      onClick={() => setActiveTab("login")}
                      className="text-primary hover:underline"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Right side - App info */}
      <div className="hidden md:flex md:w-3/5 bg-gradient-to-br from-primary/90 to-primary/70 text-white">
        <div className="p-12 flex flex-col justify-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Transform Your Basketball Development</h2>
          <p className="text-lg mb-8 text-white/90">
            HoopAI uses cutting-edge AI to deliver personalized training plans, detailed 
            performance analytics, and comprehensive player development tools.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-3 text-white flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Personalized Training Plans</h3>
                <p className="text-white/80">AI-generated training regimens tailored to your position, strengths, and areas for improvement</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-3 text-white flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Comprehensive Player Assessments</h3>
                <p className="text-white/80">Detailed player attribute tracking using professional basketball development methodology</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-3 text-white flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Team Management Tools</h3>
                <p className="text-white/80">For coaches: roster management, tactical planning tools, and detailed player development tracking</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 mr-3 text-white flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Performance Analytics</h3>
                <p className="text-white/80">Track progress over time with visual charts and actionable insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}