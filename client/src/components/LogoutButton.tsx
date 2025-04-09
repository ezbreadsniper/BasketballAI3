import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  variant?: "button" | "link";
  showIcon?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function LogoutButton({ 
  variant = "button", 
  showIcon = true,
  className,
  ...props 
}: LogoutButtonProps) {
  const { logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth");
      }
    });
  };

  if (variant === "link") {
    return (
      <button
        onClick={handleLogout}
        className={cn("flex items-center text-neutral-400 hover:text-white transition-colors", className)}
        disabled={logoutMutation.isPending || props.disabled}
      >
        {showIcon && <LogOut className="h-4 w-4 mr-2" />}
        {logoutMutation.isPending ? "Logging out..." : "Log out"}
      </button>
    );
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={logoutMutation.isPending || props.disabled}
      className={cn(className)}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {logoutMutation.isPending ? "Logging out..." : "Log out"}
    </Button>
  );
}