import { useState, useEffect } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { UserCard } from "@/components/UserCard";
import { SwapRequestModal } from "@/components/SwapRequestModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";



export default function Home() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // TODO: Replace with real auth state
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch users from backend API
    fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));

    // Fetch current user profile
    fetch('/api/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error(err));
  }, []);

  const usersPerPage = 6;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  useEffect(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.skillsWanted.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply availability filter
    if (availabilityFilter !== "all") {
      filtered = filtered.filter(user =>
        user.availability?.toLowerCase().includes(availabilityFilter.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, availabilityFilter, users]);

  const handleRequestClick = (userId: string) => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleSubmitRequest = (request: any) => {
    toast({
      title: "Request Sent!",
      description: `Your skill swap request has been sent to ${selectedUser?.name}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={isLoggedIn ? currentUser : null}
        onProfileClick={() => navigate("/profile")}
        onRequestsClick={() => navigate("/requests")}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Find Your Perfect Skill Swap Partner
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by skill or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="sm:w-48">
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="evenings">Evenings</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isLoggedIn={isLoggedIn}
              onRequestClick={handleRequestClick}
              onViewProfile={handleViewProfile}
            />
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No users found matching your criteria.
            </p>
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

      {/* Swap Request Modal */}
      {selectedUser && (
        <SwapRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          targetUser={selectedUser}
          currentUserSkills={currentUser.skillsOffered}
          onSubmit={handleSubmitRequest}
        />
      )}
    </div>
  );
}