import { useState } from "react";
import { Header } from "@/components/Header";
import { RequestCard } from "@/components/RequestCard";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SwapRequest {
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
}

// Mock data - in a real app, this would come from an API
const mockRequests: SwapRequest[] = [
  {
    id: "1",
    fromUser: {
      id: "2",
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b566?w=150&h=150&fit=crop&crop=face"
    },
    offeredSkill: "React",
    requestedSkill: "Python",
    message: "Hi! I'd love to learn Python from you. I have solid React experience and can help you with frontend development.",
    status: "pending" as const,
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    fromUser: {
      id: "3",
      name: "Michael Rodriguez"
    },
    offeredSkill: "Python",
    requestedSkill: "JavaScript",
    message: "I'm interested in learning modern JavaScript. I can teach you Python and Django in return!",
    status: "pending" as const,
    createdAt: "2024-01-14T14:20:00Z"
  },
  {
    id: "3",
    fromUser: {
      id: "4",
      name: "Emma Thompson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    offeredSkill: "Figma",
    requestedSkill: "CSS",
    status: "accepted" as const,
    createdAt: "2024-01-12T09:15:00Z"
  },
  {
    id: "4",
    fromUser: {
      id: "5",
      name: "David Kim"
    },
    offeredSkill: "Machine Learning",
    requestedSkill: "Web Development",
    message: "Looking to transition into web development. Happy to share my ML knowledge!",
    status: "rejected" as const,
    createdAt: "2024-01-10T16:45:00Z"
  }
];

export default function Requests() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch requests from backend API
    fetch('/api/requests', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error(err));
  }, []);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = statusFilter === "all" 
    ? requests 
    : requests.filter(request => request.status === statusFilter);

  const requestsPerPage = 5;
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const startIndex = (currentPage - 1) * requestsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + requestsPerPage);

  const handleAccept = (requestId: string) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: "accepted" as const }
          : request
      )
    );
    
    toast({
      title: "Request Accepted",
      description: "You have accepted the skill swap request.",
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: "rejected" as const }
          : request
      )
    );
    
    toast({
      title: "Request Rejected",
      description: "You have rejected the skill swap request.",
    });
  };

  const currentUser = {
    id: "current",
    name: "Alex Johnson"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={currentUser}
        onProfileClick={() => navigate("/profile")}
        onRequestsClick={() => navigate("/requests")}
      />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Incoming Swap Requests
          </h1>
          <p className="text-muted-foreground">
            Manage your skill swap requests and build connections
          </p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Requests</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4 mb-8">
          {currentRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {statusFilter === "all" 
                ? "No skill swap requests yet." 
                : `No ${statusFilter} requests found.`}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Browse Users
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="px-4 py-2 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}