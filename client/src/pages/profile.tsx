import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@shared/schema";
import { 
  Calendar, 
  ChevronRight, 
  User as UserIcon, 
  Globe, 
  Clock, 
  Heart, 
  Activity, 
  Award, 
  Dumbbell, 
  Brain, 
  Eye, 
  Star 
} from "lucide-react";

export default function Profile() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user/current'],
  });

  // Mock data structure for Football Manager style player profile
  // This would normally come from an API
  const playerData = {
    name: "Marcus Johnson",
    position: "Point Guard",
    age: 19,
    dateOfBirth: "2006-03-14",
    height: "6'2\"",
    weight: "185 lbs",
    nationality: "United States",
    team: "LA Ballers",
    contract: {
      startDate: "2023-09-01",
      endDate: "2026-08-31",
      salary: "$85,000"
    },
    personalityTraits: ["Determined", "Team Player", "Ambitious"],
    technical: [
      { name: "Shooting", value: 14 },
      { name: "Ball Handling", value: 16 },
      { name: "Passing", value: 15 },
      { name: "Free Throws", value: 13 },
      { name: "Offensive Movement", value: 15 },
      { name: "Defensive Positioning", value: 11 },
      { name: "Blocking", value: 8 },
      { name: "Stealing", value: 12 },
      { name: "Court Vision", value: 15 }
    ],
    mental: [
      { name: "Basketball IQ", value: 15 },
      { name: "Anticipation", value: 13 },
      { name: "Decision Making", value: 14 },
      { name: "Concentration", value: 12 },
      { name: "Composure", value: 13 },
      { name: "Leadership", value: 11 },
      { name: "Teamwork", value: 16 },
      { name: "Work Rate", value: 15 }
    ],
    physical: [
      { name: "Speed", value: 16 },
      { name: "Acceleration", value: 15 },
      { name: "Agility", value: 14 },
      { name: "Jumping", value: 13 },
      { name: "Strength", value: 10 },
      { name: "Stamina", value: 12 },
      { name: "Balance", value: 13 }
    ],
    injuryHistory: [
      { type: "Ankle Sprain", date: "2023-12-10", duration: "2 weeks" }
    ],
    careerStats: {
      seasons: [
        { year: "2023-24", team: "LA Ballers", gamesPlayed: 28, pointsPerGame: 14.3, assistsPerGame: 6.2, reboundsPerGame: 3.1 }
      ]
    }
  };

  if (isLoading) {
    return (
      <div className="py-4 px-3 sm:px-4 lg:px-6 bg-neutral-900 text-neutral-100">
        <div className="mb-4">
          <Skeleton className="h-6 w-64 mb-2 bg-neutral-700" />
          <Skeleton className="h-4 w-96 bg-neutral-700" />
        </div>
        <Skeleton className="h-[800px] w-full bg-neutral-700" />
      </div>
    );
  }

  const getAttributeColor = (value: number) => {
    if (value >= 15) return "bg-green-600"; // Excellent
    if (value >= 12) return "bg-blue-600";  // Good
    if (value >= 9) return "bg-yellow-600"; // Average
    return "bg-red-600"; // Poor
  };

  const getStarRating = (value: number, maxStars = 5) => {
    // Convert value (e.g. 1-20) to star rating (e.g. 1-5)
    const normalizedValue = Math.max(1, Math.min(Math.ceil(value / 4), maxStars));
    
    return (
      <div className="flex">
        {[...Array(maxStars)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 ${i < normalizedValue ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-600'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="py-4 px-3 sm:px-4 lg:px-6 bg-neutral-900 text-neutral-100">
      {/* Football Manager style header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
            <span className="text-sm text-neutral-400">April 9, 2025</span>
          </div>
          <h1 className="text-lg font-bold text-neutral-100">Player Profile</h1>
        </div>
      </div>

      {/* Football Manager style tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-neutral-800 border-b border-neutral-700 p-0 h-auto mb-4">
          <TabsTrigger 
            value="overview" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="technical" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Technical
          </TabsTrigger>
          <TabsTrigger 
            value="physical" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Physical
          </TabsTrigger>
          <TabsTrigger 
            value="mental" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Mental
          </TabsTrigger>
          <TabsTrigger 
            value="stats" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Stats
          </TabsTrigger>
          <TabsTrigger 
            value="development" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Development
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="m-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left column */}
            <div className="lg:w-1/3">
              {/* Player Info Card */}
              <div className="fm-card mb-4">
                <div className="fm-card-header">
                  <div className="flex items-center">
                    <UserIcon className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                    <h2 className="fm-card-title">Player Info</h2>
                  </div>
                  <div className="flex">
                    {getStarRating(15)}
                  </div>
                </div>
                
                <div className="fm-card-body">
                  <div className="flex mb-4">
                    <div className="w-24 h-32 bg-neutral-750 border border-neutral-700 mr-4 flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-2xl">
                        MJ
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-100">{playerData.name}</h3>
                      <p className="text-xs text-neutral-400">{playerData.position}</p>
                      
                      <div className="mt-2 space-y-1">
                        <div className="flex text-xs">
                          <span className="w-16 text-neutral-500">Age:</span>
                          <span className="text-neutral-300">{playerData.age}</span>
                        </div>
                        <div className="flex text-xs">
                          <span className="w-16 text-neutral-500">Height:</span>
                          <span className="text-neutral-300">{playerData.height}</span>
                        </div>
                        <div className="flex text-xs">
                          <span className="w-16 text-neutral-500">Weight:</span>
                          <span className="text-neutral-300">{playerData.weight}</span>
                        </div>
                        <div className="flex text-xs">
                          <span className="w-16 text-neutral-500">DOB:</span>
                          <span className="text-neutral-300">{playerData.dateOfBirth}</span>
                        </div>
                        <div className="flex text-xs">
                          <span className="w-16 text-neutral-500">Nationality:</span>
                          <span className="text-neutral-300">{playerData.nationality}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Personality Traits */}
                  <div className="border-t border-neutral-700 pt-3">
                    <h4 className="text-xs font-medium text-neutral-400 mb-2">PERSONALITY TRAITS</h4>
                    <div className="space-y-1">
                      {playerData.personalityTraits.map((trait, index) => (
                        <div key={index} className="bg-neutral-750 px-2 py-1 text-xs text-neutral-300 rounded-sm">
                          {trait}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contract Card */}
              <div className="fm-card mb-4">
                <div className="fm-card-header">
                  <div className="flex items-center">
                    <Globe className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                    <h2 className="fm-card-title">Contract</h2>
                  </div>
                </div>
                
                <div className="fm-card-body">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Team:</span>
                      <span className="text-neutral-200 font-medium">{playerData.team}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Contract Start:</span>
                      <span className="text-neutral-200">{playerData.contract.startDate}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Contract End:</span>
                      <span className="text-neutral-200">{playerData.contract.endDate}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Salary:</span>
                      <span className="text-green-400">{playerData.contract.salary}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Injury History */}
              <div className="fm-card">
                <div className="fm-card-header">
                  <div className="flex items-center">
                    <Heart className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                    <h2 className="fm-card-title">Injury History</h2>
                  </div>
                </div>
                
                <div className="fm-card-body">
                  {playerData.injuryHistory.length > 0 ? (
                    <div className="space-y-2">
                      {playerData.injuryHistory.map((injury, index) => (
                        <div key={index} className="bg-neutral-750 p-2 rounded-sm">
                          <div className="flex justify-between text-xs">
                            <span className="text-red-400 font-medium">{injury.type}</span>
                            <span className="text-neutral-400">{injury.date}</span>
                          </div>
                          <div className="text-xs text-neutral-500 mt-1">
                            Out for {injury.duration}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-400 italic">No injury history</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right column - Attributes Overview */}
            <div className="lg:w-2/3">
              <div className="fm-card">
                <div className="fm-card-header">
                  <div className="flex items-center">
                    <Activity className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                    <h2 className="fm-card-title">Key Attributes</h2>
                  </div>
                </div>
                
                <div className="fm-card-body">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Technical Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Award className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
                        <h3 className="text-xs font-medium text-neutral-200">Technical</h3>
                      </div>
                      
                      <div className="space-y-2.5">
                        {playerData.technical.slice(0, 5).map((attr, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-neutral-400">{attr.name}</span>
                              <span className={`text-xs font-medium w-6 h-5 flex items-center justify-center ${getAttributeColor(attr.value)} rounded-sm`}>
                                {attr.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Physical Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Dumbbell className="h-3.5 w-3.5 text-green-400 mr-1.5" />
                        <h3 className="text-xs font-medium text-neutral-200">Physical</h3>
                      </div>
                      
                      <div className="space-y-2.5">
                        {playerData.physical.slice(0, 5).map((attr, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-neutral-400">{attr.name}</span>
                              <span className={`text-xs font-medium w-6 h-5 flex items-center justify-center ${getAttributeColor(attr.value)} rounded-sm`}>
                                {attr.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Mental Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Brain className="h-3.5 w-3.5 text-purple-400 mr-1.5" />
                        <h3 className="text-xs font-medium text-neutral-200">Mental</h3>
                      </div>
                      
                      <div className="space-y-2.5">
                        {playerData.mental.slice(0, 5).map((attr, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-neutral-400">{attr.name}</span>
                              <span className={`text-xs font-medium w-6 h-5 flex items-center justify-center ${getAttributeColor(attr.value)} rounded-sm`}>
                                {attr.value}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Career Stats */}
              <div className="fm-card mt-4">
                <div className="fm-card-header">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                    <h2 className="fm-card-title">Career Stats</h2>
                  </div>
                </div>
                
                <div className="fm-card-body overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-neutral-750">
                      <tr>
                        <th className="text-left py-2 px-2 font-medium text-neutral-400">Season</th>
                        <th className="text-left py-2 px-2 font-medium text-neutral-400">Team</th>
                        <th className="text-center py-2 px-2 font-medium text-neutral-400">GP</th>
                        <th className="text-center py-2 px-2 font-medium text-neutral-400">PPG</th>
                        <th className="text-center py-2 px-2 font-medium text-neutral-400">APG</th>
                        <th className="text-center py-2 px-2 font-medium text-neutral-400">RPG</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {playerData.careerStats.seasons.map((season, index) => (
                        <tr key={index} className={index % 2 === 0 ? '' : 'bg-neutral-850'}>
                          <td className="py-2 px-2 text-neutral-300">{season.year}</td>
                          <td className="py-2 px-2 text-neutral-300">{season.team}</td>
                          <td className="py-2 px-2 text-center text-neutral-300">{season.gamesPlayed}</td>
                          <td className="py-2 px-2 text-center text-neutral-300">{season.pointsPerGame}</td>
                          <td className="py-2 px-2 text-center text-neutral-300">{season.assistsPerGame}</td>
                          <td className="py-2 px-2 text-center text-neutral-300">{season.reboundsPerGame}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Technical Tab */}
        <TabsContent value="technical" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Award className="h-3.5 w-3.5 text-blue-400 mr-2" />
                <h2 className="fm-card-title">Technical Attributes</h2>
              </div>
            </div>
            
            <div className="fm-card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playerData.technical.map((attr, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                    <div className="flex items-center">
                      <span className="text-xs text-neutral-300">{attr.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 h-1.5 bg-neutral-700 mr-3 rounded-sm">
                        <div 
                          className={`h-1.5 ${getAttributeColor(attr.value)} rounded-sm`} 
                          style={{ width: `${(attr.value / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium w-6 h-5 flex items-center justify-center ${getAttributeColor(attr.value)} rounded-sm`}>
                        {attr.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Physical Tab */}
        <TabsContent value="physical" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Dumbbell className="h-3.5 w-3.5 text-green-400 mr-2" />
                <h2 className="fm-card-title">Physical Attributes</h2>
              </div>
            </div>
            
            <div className="fm-card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playerData.physical.map((attr, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                    <div className="flex items-center">
                      <span className="text-xs text-neutral-300">{attr.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 h-1.5 bg-neutral-700 mr-3 rounded-sm">
                        <div 
                          className={`h-1.5 ${getAttributeColor(attr.value)} rounded-sm`} 
                          style={{ width: `${(attr.value / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium w-6 h-5 flex items-center justify-center ${getAttributeColor(attr.value)} rounded-sm`}>
                        {attr.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Mental Tab */}
        <TabsContent value="mental" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Brain className="h-3.5 w-3.5 text-purple-400 mr-2" />
                <h2 className="fm-card-title">Mental Attributes</h2>
              </div>
            </div>
            
            <div className="fm-card-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {playerData.mental.map((attr, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                    <div className="flex items-center">
                      <span className="text-xs text-neutral-300">{attr.name}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 h-1.5 bg-neutral-700 mr-3 rounded-sm">
                        <div 
                          className={`h-1.5 ${getAttributeColor(attr.value)} rounded-sm`} 
                          style={{ width: `${(attr.value / 20) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium w-6 h-5 flex items-center justify-center ${getAttributeColor(attr.value)} rounded-sm`}>
                        {attr.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Stats Tab */}
        <TabsContent value="stats" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Activity className="h-3.5 w-3.5 text-yellow-400 mr-2" />
                <h2 className="fm-card-title">Game Statistics</h2>
              </div>
            </div>
            
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Detailed game statistics will be available after recording games and practices.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Development Tab */}
        <TabsContent value="development" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Eye className="h-3.5 w-3.5 text-blue-400 mr-2" />
                <h2 className="fm-card-title">Development Focus</h2>
              </div>
            </div>
            
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Development tracking and focus areas will be available after coaches' assessments.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
