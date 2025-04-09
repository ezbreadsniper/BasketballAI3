import { useQuery } from "@tanstack/react-query";
import { 
  PlusCircle, 
  Download, 
  Calendar, 
  Clock, 
  ChevronRight, 
  ArrowUp, 
  ArrowDown, 
  Award, 
  TrendingUp, 
  BarChart3, 
  Shield, 
  Users, 
  Flame,
  MessagesSquare, 
  CalendarDays,
  XCircle,
  CheckCircle2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
    <div className="py-3 px-2 sm:px-3 lg:px-4 bg-neutral-900">
      {/* FM-Style Top Header with date and upcoming game */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
        {/* Left Side - Next Match Panel */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-3 lg:flex items-start flex-1">
          <div className="flex justify-between items-start w-full">
            <div>
              <div className="uppercase text-[11px] font-semibold text-pink-500 mb-1 flex items-center">
                <span>NEXT MATCH</span>
              </div>
              <div className="mb-2">
                <div className="text-white font-semibold text-sm mb-0.5">
                  Hometown Eagles vs Rival Hawks
                </div>
                <div className="text-neutral-400 text-xs flex items-center">
                  <span>Saturday, April 12, 2025 (Today)</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 text-neutral-300">
                  <Users className="h-3 w-3 text-neutral-400" />
                  <span>Home Court Arena</span>
                </div>
                <span className="text-neutral-600">|</span>
                <div className="flex items-center gap-1 text-neutral-300">
                  <Clock className="h-3 w-3 text-neutral-400" />
                  <span>7:30 PM</span>
                </div>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center">
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-sm px-2 py-1 text-xs text-pink-400">
                <span>PREVIOUS MEETINGS</span>
              </div>
              <ChevronRight className="h-4 w-4 text-neutral-500" />
            </div>
          </div>
        </div>
      
        {/* Right Side - Team News Panel */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-sm p-3 w-full md:max-w-sm">
          <div className="uppercase text-[11px] font-semibold text-neutral-300 mb-2 flex items-center">
            <span>UPCOMING TEAM NEWS</span>
          </div>
          
          <div className="space-y-2">
            {/* Training Schedule Item */}
            <div className="flex items-center text-xs">
              <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                <Calendar className="h-3 w-3 text-green-400" />
              </div>
              <div>
                <div className="text-green-400">Team Training Session</div>
                <div className="text-neutral-400 text-[10px]">Tomorrow, 10:00 AM</div>
              </div>
            </div>
            
            {/* Player Status Item */}
            <div className="flex items-center text-xs">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center mr-2">
                <Flame className="h-3 w-3 text-amber-400" />
              </div>
              <div>
                <div className="text-amber-400">Mike Johnson - Light Injury</div>
                <div className="text-neutral-400 text-[10px]">Expected return in 3 days</div>
              </div>
            </div>
            
            {/* Coach Meeting Item */}
            <div className="flex items-center text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                <MessagesSquare className="h-3 w-3 text-blue-400" />
              </div>
              <div>
                <div className="text-blue-400">Coach Strategy Meeting</div>
                <div className="text-neutral-400 text-[10px]">Today, 4:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FM-Style Main Content - Multi-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-3">
        {/* Column 1 - League Table / Progress */}
        <div className="space-y-3">
          <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
            <div className="border-b border-neutral-700 p-2">
              <h3 className="text-xs uppercase font-semibold text-neutral-200">League Standings</h3>
            </div>
            <div className="p-2">
              <table className="w-full text-[10px]">
                <thead className="text-neutral-400">
                  <tr>
                    <th className="text-left font-normal p-1">Pos</th>
                    <th className="text-left font-normal p-1">Team</th>
                    <th className="text-center font-normal p-1">P</th>
                    <th className="text-center font-normal p-1">W</th>
                    <th className="text-center font-normal p-1">L</th>
                    <th className="text-right font-normal p-1">Pts</th>
                  </tr>
                </thead>
                <tbody className="text-neutral-300">
                  <tr className="bg-neutral-700/30">
                    <td className="p-1 text-green-400">1st</td>
                    <td className="p-1 font-medium text-white">Eagles</td>
                    <td className="text-center p-1">20</td>
                    <td className="text-center p-1">18</td>
                    <td className="text-center p-1">2</td>
                    <td className="text-right p-1">36</td>
                  </tr>
                  <tr>
                    <td className="p-1">2nd</td>
                    <td className="p-1">Spartans</td>
                    <td className="text-center p-1">20</td>
                    <td className="text-center p-1">15</td>
                    <td className="text-center p-1">5</td>
                    <td className="text-right p-1">30</td>
                  </tr>
                  <tr>
                    <td className="p-1">3rd</td>
                    <td className="p-1">Falcons</td>
                    <td className="text-center p-1">20</td>
                    <td className="text-center p-1">14</td>
                    <td className="text-center p-1">6</td>
                    <td className="text-right p-1">28</td>
                  </tr>
                  <tr>
                    <td className="p-1">4th</td>
                    <td className="p-1">Raiders</td>
                    <td className="text-center p-1">20</td>
                    <td className="text-center p-1">12</td>
                    <td className="text-center p-1">8</td>
                    <td className="text-right p-1">24</td>
                  </tr>
                  <tr>
                    <td className="p-1">5th</td>
                    <td className="p-1">Hawks</td>
                    <td className="text-center p-1">20</td>
                    <td className="text-center p-1">10</td>
                    <td className="text-center p-1">10</td>
                    <td className="text-right p-1">20</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
            <div className="border-b border-neutral-700 p-2">
              <h3 className="text-xs uppercase font-semibold text-neutral-200">Development Progress</h3>
            </div>
            <div className="p-2 space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-neutral-400">Shooting</span>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-neutral-100 mr-1.5">72</span>
                    <div className="flex items-center">
                      <ArrowUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400 ml-0.5">+4</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-neutral-700 rounded-sm">
                  <div className="h-1.5 bg-blue-600 rounded-sm" style={{ width: '72%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-neutral-400">Defense</span>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-neutral-100 mr-1.5">68</span>
                    <div className="flex items-center">
                      <ArrowUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400 ml-0.5">+2</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-neutral-700 rounded-sm">
                  <div className="h-1.5 bg-green-600 rounded-sm" style={{ width: '68%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-neutral-400">Playmaking</span>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-neutral-100 mr-1.5">75</span>
                    <div className="flex items-center">
                      <ArrowUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400 ml-0.5">+3</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-neutral-700 rounded-sm">
                  <div className="h-1.5 bg-purple-600 rounded-sm" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-neutral-400">Athleticism</span>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-neutral-100 mr-1.5">81</span>
                    <div className="flex items-center">
                      <ArrowUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400 ml-0.5">+1</span>
                    </div>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-neutral-700 rounded-sm">
                  <div className="h-1.5 bg-amber-600 rounded-sm" style={{ width: '81%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Column 2-3 - Player Ratings */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
            <div className="border-b border-neutral-700 p-2 flex justify-between items-center">
              <h3 className="text-xs uppercase font-semibold text-neutral-200">Best Attributes</h3>
              <div className="text-[10px] text-neutral-400">Updated 2 days ago</div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-2 text-black font-bold text-sm">
                    12
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">D. Jordan Smith</div>
                    <div className="text-[10px] text-neutral-400 flex items-center">
                      <span className="text-primary">PG</span>
                      <span className="mx-1 text-neutral-600">|</span>
                      <span>Athletic Playmaker</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Speed</span>
                    <span className="text-white">18</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Ball Handling</span>
                    <span className="text-white">17</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Passing</span>
                    <span className="text-white">16</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-2 text-black font-bold text-sm">
                    8
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">T. Raekwon Davis</div>
                    <div className="text-[10px] text-neutral-400 flex items-center">
                      <span className="text-primary">SG</span>
                      <span className="mx-1 text-neutral-600">|</span>
                      <span>Sharpshooter</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Three-Point</span>
                    <span className="text-white">18</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Free Throw</span>
                    <span className="text-white">17</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Mid-Range</span>
                    <span className="text-white">16</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-2 text-black font-bold text-sm">
                    23
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">J. Marcus Williams</div>
                    <div className="text-[10px] text-neutral-400 flex items-center">
                      <span className="text-primary">SF</span>
                      <span className="mx-1 text-neutral-600">|</span>
                      <span>Two-Way Player</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Perimeter D</span>
                    <span className="text-white">17</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Athleticism</span>
                    <span className="text-white">16</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Finishing</span>
                    <span className="text-white">15</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mr-2 text-black font-bold text-sm">
                    42
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">B. Anthony Miller</div>
                    <div className="text-[10px] text-neutral-400 flex items-center">
                      <span className="text-primary">C</span>
                      <span className="mx-1 text-neutral-600">|</span>
                      <span>Rim Protector</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Blocking</span>
                    <span className="text-white">18</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Rebounding</span>
                    <span className="text-white">17</span>
                  </div>
                  <div className="bg-neutral-700 text-[10px] px-1.5 py-0.5 rounded flex items-center">
                    <span className="text-blue-400 font-medium mr-1">Interior D</span>
                    <span className="text-white">16</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
            <div className="border-b border-neutral-700 p-2 flex justify-between items-center">
              <h3 className="text-xs uppercase font-semibold text-neutral-200">Upcoming Matchups</h3>
              <div className="text-[10px] text-neutral-400">Next 4 games</div>
            </div>
            <div className="p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-neutral-700 bg-neutral-750 rounded-sm p-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium text-white">vs Hawks</div>
                    <div className="text-[10px] text-neutral-400">Apr 12</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500/20 rounded-sm p-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-[10px] text-neutral-300">65% win probability</span>
                    </div>
                    <div className="text-[10px] text-orange-400">HOME</div>
                  </div>
                </div>
                
                <div className="border border-neutral-700 bg-neutral-750 rounded-sm p-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium text-white">at Spartans</div>
                    <div className="text-[10px] text-neutral-400">Apr 15</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-500/20 rounded-sm p-1">
                        <Info className="h-3 w-3 text-amber-500" />
                      </div>
                      <span className="text-[10px] text-neutral-300">48% win probability</span>
                    </div>
                    <div className="text-[10px] text-blue-400">AWAY</div>
                  </div>
                </div>
                
                <div className="border border-neutral-700 bg-neutral-750 rounded-sm p-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium text-white">vs Raiders</div>
                    <div className="text-[10px] text-neutral-400">Apr 19</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-500/20 rounded-sm p-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </div>
                      <span className="text-[10px] text-neutral-300">72% win probability</span>
                    </div>
                    <div className="text-[10px] text-orange-400">HOME</div>
                  </div>
                </div>
                
                <div className="border border-neutral-700 bg-neutral-750 rounded-sm p-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-xs font-medium text-white">at Falcons</div>
                    <div className="text-[10px] text-neutral-400">Apr 22</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-red-500/20 rounded-sm p-1">
                        <XCircle className="h-3 w-3 text-red-500" />
                      </div>
                      <span className="text-[10px] text-neutral-300">35% win probability</span>
                    </div>
                    <div className="text-[10px] text-blue-400">AWAY</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Column 4 - Training Recommendations */}
        <div className="space-y-3">
          <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
            <div className="border-b border-neutral-700 p-2">
              <h3 className="text-xs uppercase font-semibold text-neutral-200">Tactical Style - Defense</h3>
            </div>
            <div className="p-3">
              <div className="bg-neutral-750 border border-neutral-700 rounded-sm p-2 mb-3">
                <div className="grid grid-cols-3 text-[10px] text-center mb-2">
                  <div className="text-neutral-400">Man</div>
                  <div className="text-neutral-400">Zone</div>
                  <div className="text-neutral-400">Press</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="h-16 bg-neutral-700/50 rounded-sm flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                  </div>
                  <div className="h-16 bg-neutral-700/50 rounded-sm"></div>
                  <div className="h-16 bg-neutral-700/50 rounded-sm"></div>
                </div>
                <div className="grid grid-cols-3 gap-1 mt-1">
                  <div className="h-16 bg-neutral-700/50 rounded-sm"></div>
                  <div className="h-16 bg-neutral-700/50 rounded-sm"></div>
                  <div className="h-16 bg-neutral-700/50 rounded-sm"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-500/20 rounded-sm p-1 mr-2">
                    <Shield className="h-3 w-3 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-[10px] text-neutral-400">Current Focus</div>
                    <div className="text-xs text-white">Man-to-Man Pressure</div>
                  </div>
                </div>
                <div className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-sm">
                  In Progress
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
            <div className="border-b border-neutral-700 p-2">
              <h3 className="text-xs uppercase font-semibold text-neutral-200">Training Recommendations</h3>
            </div>
            <div className="p-2 space-y-2">
              <div className="bg-neutral-750 border border-neutral-700 rounded-sm p-2 flex items-center">
                <div className="bg-orange-500/20 rounded-full p-1 mr-2 flex-shrink-0">
                  <Flame className="h-4 w-4 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-200 truncate">Ball Handling Drills</div>
                  <div className="text-[10px] text-neutral-400 flex items-center">
                    <span>High Intensity</span>
                    <span className="mx-1 text-neutral-600">|</span>
                    <span>30 min</span>
                  </div>
                </div>
                <div className="ml-auto pl-2">
                  <Button size="sm" variant="ghost" className="h-7 px-2 py-0 text-[10px] text-neutral-400 hover:text-white">
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="bg-neutral-750 border border-neutral-700 rounded-sm p-2 flex items-center">
                <div className="bg-blue-500/20 rounded-full p-1 mr-2 flex-shrink-0">
                  <Shield className="h-4 w-4 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-200 truncate">Defensive Footwork</div>
                  <div className="text-[10px] text-neutral-400 flex items-center">
                    <span>Medium Intensity</span>
                    <span className="mx-1 text-neutral-600">|</span>
                    <span>45 min</span>
                  </div>
                </div>
                <div className="ml-auto pl-2">
                  <Button size="sm" variant="ghost" className="h-7 px-2 py-0 text-[10px] text-neutral-400 hover:text-white">
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="bg-neutral-750 border border-neutral-700 rounded-sm p-2 flex items-center">
                <div className="bg-green-500/20 rounded-full p-1 mr-2 flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-neutral-200 truncate">Shooting Efficiency</div>
                  <div className="text-[10px] text-neutral-400 flex items-center">
                    <span>High Intensity</span>
                    <span className="mx-1 text-neutral-600">|</span>
                    <span>60 min</span>
                  </div>
                </div>
                <div className="ml-auto pl-2">
                  <Button size="sm" variant="ghost" className="h-7 px-2 py-0 text-[10px] text-neutral-400 hover:text-white">
                    <PlusCircle className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Best Training Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
          <div className="border-b border-neutral-700 p-2">
            <h3 className="text-xs uppercase font-semibold text-neutral-200">Best Training Performance (Last 7 Days)</h3>
          </div>
          <div className="p-3">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold">
                12
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-semibold text-white">D. Jordan Smith</div>
                  <div className="text-green-400 text-xs font-bold">9.8/10</div>
                </div>
                <div className="text-xs text-neutral-400">Physical condition: excellent</div>
                <div className="mt-1 flex items-center gap-1">
                  <div className="text-[10px] text-yellow-500 px-1.5 py-0.5 bg-yellow-500/10 rounded">
                    Speed
                  </div>
                  <div className="text-[10px] text-blue-500 px-1.5 py-0.5 bg-blue-500/10 rounded">
                    Handling
                  </div>
                  <div className="text-[10px] text-purple-500 px-1.5 py-0.5 bg-purple-500/10 rounded">
                    Leadership
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-neutral-800 border border-neutral-700 rounded-sm overflow-hidden">
          <div className="border-b border-neutral-700 p-2">
            <h3 className="text-xs uppercase font-semibold text-neutral-200">Worst Training Performance (Last 7 Days)</h3>
          </div>
          <div className="p-3">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black font-bold">
                5
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-semibold text-white">C. Max Floyd</div>
                  <div className="text-red-400 text-xs font-bold">4.9/10</div>
                </div>
                <div className="text-xs text-neutral-400">Physical condition: recovering from injury</div>
                <div className="mt-1 flex items-center gap-1">
                  <div className="text-[10px] text-red-500 px-1.5 py-0.5 bg-red-500/10 rounded">
                    Fatigue
                  </div>
                  <div className="text-[10px] text-amber-500 px-1.5 py-0.5 bg-amber-500/10 rounded">
                    Motivation
                  </div>
                  <div className="text-[10px] text-blue-500 px-1.5 py-0.5 bg-blue-500/10 rounded">
                    Recovery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
