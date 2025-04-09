import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  Settings, 
  ChevronRight, 
  Calendar, 
  Users, 
  Star, 
  Heart
} from "lucide-react";

export default function Team() {
  // Mock data for the team roster following Football Manager style
  const players = [
    { 
      id: 1, 
      number: 1, 
      name: "S. Angelo Garcia", 
      position: "PG", 
      age: 19, 
      height: "6'2\"",
      attributes: {
        technical: 16,
        mental: 15,
        physical: 14
      },
      personality: "Determined",
      condition: "Fit",
      value: "$45K",
      rating: 4.5
    },
    { 
      id: 2, 
      number: 5, 
      name: "J. Andy Smith", 
      position: "SG", 
      age: 20, 
      height: "6'4\"",
      attributes: {
        technical: 15,
        mental: 14,
        physical: 14
      },
      personality: "Model Professional",
      condition: "Fit",
      value: "$50K",
      rating: 4
    },
    { 
      id: 3, 
      number: 7, 
      name: "B. Ryan Harvey", 
      position: "SF", 
      age: 22, 
      height: "6'7\"",
      attributes: {
        technical: 13,
        mental: 12,
        physical: 16
      },
      personality: "Determined",
      condition: "Fit",
      value: "$60K",
      rating: 3.5
    },
    { 
      id: 4, 
      number: 14, 
      name: "R. Mike Miller", 
      position: "PF", 
      age: 23, 
      height: "6'8\"",
      attributes: {
        technical: 12,
        mental: 13,
        physical: 15
      },
      personality: "Team Player",
      condition: "Fit",
      value: "$55K",
      rating: 3
    },
    { 
      id: 5, 
      number: 21, 
      name: "C. Gabriel Grant", 
      position: "C", 
      age: 24, 
      height: "6'11\"",
      attributes: {
        technical: 13,
        mental: 12,
        physical: 16
      },
      personality: "Ambitious",
      condition: "Light Injury (3d)",
      value: "$65K",
      rating: 3.5
    },
    { 
      id: 6, 
      number: 8, 
      name: "G. Sean Tygart", 
      position: "PG", 
      age: 19, 
      height: "6'1\"",
      attributes: {
        technical: 13,
        mental: 14,
        physical: 12
      },
      personality: "Professional",
      condition: "Fit",
      value: "$35K",
      rating: 3
    },
    { 
      id: 7, 
      number: 11, 
      name: "B. Jeremy Long", 
      position: "SG", 
      age: 21, 
      height: "6'5\"",
      attributes: {
        technical: 12,
        mental: 14,
        physical: 13
      },
      personality: "Team Player",
      condition: "Fit",
      value: "$30K",
      rating: 3
    },
    { 
      id: 8, 
      number: 20, 
      name: "L. Denieroson", 
      position: "PF", 
      age: 20, 
      height: "6'9\"",
      attributes: {
        technical: 11,
        mental: 12,
        physical: 15
      },
      personality: "Low Determination",
      condition: "Fit",
      value: "$25K",
      rating: 2.5
    },
    { 
      id: 9, 
      number: 45, 
      name: "Q. Drew Duffy", 
      position: "SF", 
      age: 22, 
      height: "6'6\"",
      attributes: {
        technical: 11,
        mental: 13,
        physical: 13
      },
      personality: "Balanced",
      condition: "Fit",
      value: "$30K",
      rating: 2.5
    },
    { 
      id: 10, 
      number: 32, 
      name: "F. Iver Iverson", 
      position: "C", 
      age: 25, 
      height: "7'0\"",
      attributes: {
        technical: 10,
        mental: 11,
        physical: 14
      },
      personality: "Balanced",
      condition: "Fit",
      value: "$40K",
      rating: 2.5
    }
  ];

  // Football Manager style tactical positions
  const formations = {
    starting: [
      { id: 1, position: "PG", x: "50%", y: "85%", playerId: 1 },
      { id: 2, position: "SG", x: "25%", y: "70%", playerId: 2 },
      { id: 3, position: "SF", x: "75%", y: "70%", playerId: 3 },
      { id: 4, position: "PF", x: "35%", y: "35%", playerId: 4 },
      { id: 5, position: "C", x: "50%", y: "15%", playerId: 5 }
    ],
    bench: [
      { id: 6, position: "PG", playerId: 6 },
      { id: 7, position: "SG", playerId: 7 },
      { id: 8, position: "PF", playerId: 8 },
      { id: 9, position: "SF", playerId: 9 },
      { id: 10, position: "C", playerId: 10 }
    ]
  };

  const getPlayerById = (id: number) => {
    return players.find(player => player.id === id);
  };

  // Function to render stars based on rating
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        ))}
        {halfStar && <Star key="half" className="h-3 w-3 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-3 w-3 text-neutral-600" />
        ))}
      </div>
    );
  };

  // Function to get attribute color class based on value
  const getAttributeColor = (value: number) => {
    if (value >= 15) return "bg-green-600 text-white"; // Excellent
    if (value >= 12) return "bg-blue-600 text-white";  // Good
    if (value >= 9) return "bg-yellow-600 text-white"; // Average
    return "bg-red-600 text-white"; // Poor
  };

  // Function to get the condition indicator
  const getConditionIndicator = (condition: string) => {
    if (condition.includes("Injury")) {
      return <Heart className="h-3.5 w-3.5 text-red-500" />;
    }
    return <Heart className="h-3.5 w-3.5 text-green-500" />;
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
          <h1 className="text-lg font-bold text-neutral-100">Team Management</h1>
        </div>
      </div>

      {/* Football Manager style tabs */}
      <Tabs defaultValue="tactics" className="w-full">
        <TabsList className="bg-neutral-800 border-b border-neutral-700 p-0 h-auto mb-4">
          <TabsTrigger 
            value="overview" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="tactics" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Tactics
          </TabsTrigger>
          <TabsTrigger 
            value="squad" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Squad
          </TabsTrigger>
          <TabsTrigger 
            value="training" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Training
          </TabsTrigger>
          <TabsTrigger 
            value="schedule" 
            className="text-xs py-2 px-4 data-[state=active]:bg-neutral-700 data-[state=active]:text-white rounded-none border-none"
          >
            Schedule
          </TabsTrigger>
        </TabsList>

        {/* Tactics Tab (main one based on the screenshot) */}
        <TabsContent value="tactics" className="m-0">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left column - Tactical board */}
            <div className="lg:w-1/2 fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Lineup & Formation</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    Analysis
                  </Button>
                </div>
              </div>
              
              <div className="fm-card-body">
                {/* Tactical formation display */}
                <div className="relative h-96 bg-green-900 rounded-sm overflow-hidden mb-4">
                  {/* Court markings */}
                  <div className="absolute w-3/4 h-4/5 border-2 border-white border-opacity-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg"></div>
                  <div className="absolute w-24 h-24 border-2 border-white border-opacity-30 top-[15%] left-1/2 transform -translate-x-1/2 rounded-full"></div>
                  <div className="absolute w-24 h-24 border-2 border-white border-opacity-30 bottom-[15%] left-1/2 transform -translate-x-1/2 rounded-full"></div>
                  <div className="absolute w-px h-full bg-white bg-opacity-30 left-1/2 transform -translate-x-1/2"></div>
                  
                  {/* Player positions */}
                  {formations.starting.map((pos) => {
                    const player = getPlayerById(pos.playerId);
                    if (!player) return null;
                    
                    return (
                      <div 
                        key={pos.id}
                        className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2"
                        style={{ 
                          top: pos.y, 
                          left: pos.x 
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <div className="bg-yellow-400 w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-xs mb-1">
                            {player.number}
                          </div>
                          <div className="text-white text-xs font-bold bg-black bg-opacity-50 px-1 rounded">
                            {player.name.split(' ').pop()}
                          </div>
                          <div className="text-white text-[10px] bg-black bg-opacity-50 px-1 rounded">
                            {pos.position}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bench players */}
                <div className="mt-4">
                  <h3 className="text-xs font-medium text-neutral-300 mb-2">SUBSTITUTES</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {formations.bench.map((pos) => {
                      const player = getPlayerById(pos.playerId);
                      if (!player) return null;
                      
                      return (
                        <div key={pos.id} className="bg-neutral-750 border border-neutral-700 p-2 rounded-sm flex flex-col items-center">
                          <div className="bg-neutral-800 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs mb-1">
                            {player.number}
                          </div>
                          <div className="text-neutral-300 text-xs text-center font-medium">
                            {player.name.split(' ').pop()}
                          </div>
                          <div className="text-neutral-500 text-[10px]">{pos.position}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Formation analysis */}
                <div className="mt-4 bg-neutral-750 border border-neutral-700 rounded-sm p-3">
                  <h3 className="text-xs font-medium text-neutral-300 mb-2">FORMATION ANALYSIS</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-xs">
                      <span className="text-neutral-500">Offense:</span>
                      <span className="text-neutral-200 ml-2">Strong</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-neutral-500">Defense:</span>
                      <span className="text-neutral-200 ml-2">Average</span>
                    </div>
                    <div className="text-xs">
                      <span className="text-neutral-500">Balance:</span>
                      <span className="text-neutral-200 ml-2">Good</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Squad list */}
            <div className="lg:w-1/2 fm-card">
              <div className="fm-card-header">
                <div className="flex items-center">
                  <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                  <h2 className="fm-card-title">Squad</h2>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Filter className="h-3.5 w-3.5 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs bg-neutral-800 border-neutral-700 text-neutral-200 hover:bg-neutral-700">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="fm-card-body p-0">
                {/* Search and filter bar */}
                <div className="px-3 py-2 border-b border-neutral-700 flex items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
                    <Input 
                      placeholder="Search players..." 
                      className="h-8 pl-8 bg-neutral-800 border-neutral-700 text-neutral-200 text-xs focus-visible:ring-primary"
                    />
                  </div>
                  <div className="flex items-center ml-3 space-x-1">
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Name
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Position
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 px-2 text-[10px] bg-neutral-750 border-neutral-700 text-neutral-400 hover:bg-neutral-700">
                      Age
                    </Button>
                  </div>
                </div>
                
                {/* Table header */}
                <div className="grid grid-cols-12 bg-neutral-750 text-[10px] font-medium text-neutral-400 uppercase px-3 py-1.5">
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-1 text-center">Pos</div>
                  <div className="col-span-1 text-center">Age</div>
                  <div className="col-span-3 text-center">Attributes</div>
                  <div className="col-span-1 text-center">Value</div>
                  <div className="col-span-2 text-center">Rating</div>
                </div>
                
                {/* Players list */}
                <div className="overflow-y-auto max-h-[450px]">
                  {players.map((player, index) => (
                    <div 
                      key={player.id} 
                      className={`grid grid-cols-12 text-xs px-3 py-2 items-center ${
                        index % 2 === 0 ? 'bg-neutral-850' : 'bg-neutral-800'
                      } hover:bg-neutral-700 cursor-pointer`}
                    >
                      <div className="col-span-1 text-center font-medium text-neutral-300">{player.number}</div>
                      <div className="col-span-3 flex items-center">
                        <div className="mr-2">
                          {getConditionIndicator(player.condition)}
                        </div>
                        <div>
                          <div className="text-neutral-200 font-medium">{player.name}</div>
                          <div className="text-[10px] text-neutral-500">{player.personality}</div>
                        </div>
                      </div>
                      <div className="col-span-1 text-center font-medium text-neutral-300">{player.position}</div>
                      <div className="col-span-1 text-center text-neutral-400">{player.age}</div>
                      
                      {/* Technical, Mental, Physical attributes */}
                      <div className="col-span-3">
                        <div className="grid grid-cols-3 gap-1">
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.technical)}`}>
                              {player.attributes.technical}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.mental)}`}>
                              {player.attributes.mental}
                            </div>
                          </div>
                          <div className="flex justify-center">
                            <div className={`w-6 h-5 flex items-center justify-center rounded-sm text-[10px] font-medium ${getAttributeColor(player.attributes.physical)}`}>
                              {player.attributes.physical}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-1 text-center text-neutral-300">{player.value}</div>
                      <div className="col-span-2 flex justify-center">
                        {renderStarRating(player.rating)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Other tabs (simplified for now) */}
        <TabsContent value="overview" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Team Overview</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Team overview will be available after joining or creating a team.</p>
                <Button className="mt-4 text-xs bg-primary hover:bg-primary/90">Join or Create Team</Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="squad" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Users className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Squad Management</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Detailed squad management will be available soon.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="training" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Training Schedule</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Team training schedule will be available soon.</p>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule" className="m-0">
          <div className="fm-card">
            <div className="fm-card-header">
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 text-neutral-400 mr-2" />
                <h2 className="fm-card-title">Season Schedule</h2>
              </div>
            </div>
            <div className="fm-card-body">
              <div className="p-4 text-center">
                <p className="text-xs text-neutral-400">Season schedule will be available once games are scheduled.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
