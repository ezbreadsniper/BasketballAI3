import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function UserProfile() {
  const { user, isLoading, logoutMutation } = useAuth();
  const [, navigate] = useLocation();

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
          {false ? (
            <img 
              src="" 
              alt={user?.fullName || user?.username} 
              className="h-8 w-8 rounded object-cover border border-neutral-700" 
            />
          ) : (
            <div className="h-8 w-8 rounded bg-primary text-white flex items-center justify-center font-semibold text-xs border border-neutral-700">
              {(user?.fullName || user?.username)?.charAt(0) || "U"}
            </div>
          )}
          <div className="ml-2 text-left">
            <p className="text-xs font-medium text-white">{user?.fullName || user?.username || "User"}</p>
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
        <DropdownMenuItem 
          className="text-xs cursor-pointer hover:bg-neutral-700 focus:bg-neutral-700"
          onClick={() => {
            logoutMutation.mutate(undefined, {
              onSuccess: () => {
                navigate("/auth");
              }
            });
          }}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-3.5 w-3.5 mr-2" />
          <span>{logoutMutation.isPending ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
