import { useQuery } from "@tanstack/react-query";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@shared/schema";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function UserProfile() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/user/current'],
  });

  if (isLoading) {
    return (
      <div className="flex items-center">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="ml-2 space-y-1">
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center px-2 py-1.5 rounded hover:bg-neutral-800 transition-colors cursor-pointer">
          {user?.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.name} 
              className="h-8 w-8 rounded object-cover border border-neutral-700" 
            />
          ) : (
            <div className="h-8 w-8 rounded bg-primary text-white flex items-center justify-center font-semibold text-xs border border-neutral-700">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="ml-2 text-left">
            <p className="text-xs font-medium text-white">{user?.name || "User"}</p>
            <p className="text-[10px] text-neutral-400">{user?.role || "Player"}</p>
          </div>
          <ChevronDown className="h-3 w-3 ml-2 text-neutral-400" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-neutral-800 border border-neutral-700 text-neutral-200">
        <DropdownMenuLabel className="text-xs font-normal text-neutral-400">My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-700" />
        <DropdownMenuItem className="text-xs cursor-pointer hover:bg-neutral-700 focus:bg-neutral-700">
          <UserIcon className="h-3.5 w-3.5 mr-2" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-xs cursor-pointer hover:bg-neutral-700 focus:bg-neutral-700">
          <LogOut className="h-3.5 w-3.5 mr-2" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
