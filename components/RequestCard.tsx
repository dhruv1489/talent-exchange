import { User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RequestCardProps {
  request: {
    id: string;
    fromUser: {
      id: string;
      name: string;
      avatar?: string;
    };
    offeredSkill: string;
    requestedSkill: string;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
  };
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export function RequestCard({ request, onAccept, onReject }: RequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-success text-success-foreground';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {request.fromUser.avatar ? (
              <img
                src={request.fromUser.avatar}
                alt={request.fromUser.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {request.fromUser.name}
              </h3>
              <Badge className={getStatusColor(request.status)}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-sm">
                {request.offeredSkill}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline" className="text-sm">
                {request.requestedSkill}
              </Badge>
            </div>

            {request.message && (
              <div className="mb-3">
                <p className="text-sm text-muted-foreground mb-1">Message:</p>
                <p className="text-sm text-foreground bg-muted/50 rounded-md p-2">
                  {request.message}
                </p>
              </div>
            )}

            <p className="text-xs text-muted-foreground mb-3">
              Sent on {new Date(request.createdAt).toLocaleDateString()}
            </p>

            {request.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => onAccept(request.id)}
                  className="flex-1"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onReject(request.id)}
                  className="flex-1"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}