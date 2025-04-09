import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@shared/schema";

export default function UserProfile() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user/current'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center mb-8 p-3 bg-neutral-100 rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="ml-3 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center mb-8 p-3 bg-neutral-100 rounded-lg">
      {user?.profileImage ? (
        <img 
          src={user.profileImage} 
          alt={user.name} 
          className="h-10 w-10 rounded-full object-cover mr-3" 
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {user?.name?.charAt(0) || "U"}
        </div>
      )}
      <div>
        <h3 className="font-semibold text-sm">{user?.name || "User"}</h3>
        <p className="text-xs text-neutral-500">{user?.role || "Player"}</p>
      </div>
      <button className="ml-auto text-neutral-400 hover:text-neutral-900">
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}
