import { Star, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserCardProps {
  user: {
    id: string;
    name: string;
    avatar?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    rating: number;
    availability?: string;
  };
  isLoggedIn: boolean;
  onRequestClick: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

export function UserCard({ user, isLoggedIn, onRequestClick, onViewProfile }: UserCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 
                className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer"
                onClick={() => onViewProfile(user.id)}
              >
                {user.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-current text-yellow-500" />
                <span>{user.rating.toFixed(1)}/5</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Skills Offered →</p>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full border border-green-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Skills Wanted →</p>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {user.availability && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Availability</p>
                  <p className="text-sm text-foreground">{user.availability}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                onClick={() => onRequestClick(user.id)}
                disabled={!isLoggedIn}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isLoggedIn ? 'Request' : 'Login to Request'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}