import { User, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  } | null;
  onProfileClick?: () => void;
  onRequestsClick?: () => void;
}

export function Header({ user, onProfileClick, onRequestsClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
            >
              Skill Swap Platform
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {location.pathname !== "/" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}

            {user && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRequestsClick}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Requests
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onProfileClick}
                  className="flex items-center gap-2"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  Profile
                </Button>
              </>
            )}

            {!user && (
              <Button
                onClick={() => navigate("/login")}
                size="sm"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}