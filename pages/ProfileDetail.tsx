import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Star, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { SwapRequestModal } from "@/components/SwapRequestModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

// Mock user data - in a real app, this would be fetched from API
const mockUserData: Record<string, any> = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b566?w=300&h=300&fit=crop&crop=face",
    location: "New York, NY",
    skillsOffered: ["React", "TypeScript", "Node.js", "GraphQL", "MongoDB"],
    skillsWanted: ["Python", "Data Science", "Machine Learning", "TensorFlow"],
    rating: 4.8,
    availability: "Weekends and weekday evenings after 6 PM",
    bio: "Frontend developer with 5 years of experience. Passionate about creating beautiful, accessible user interfaces. Looking to expand into data science and machine learning.",
    totalSwaps: 12,
    joinedDate: "2023-03-15"
  },
  "2": {
    id: "2", 
    name: "Michael Rodriguez",
    location: "San Francisco, CA",
    skillsOffered: ["Python", "Django", "PostgreSQL", "AWS", "Docker"],
    skillsWanted: ["React", "Frontend Design", "UX/UI", "Figma"],
    rating: 4.5,
    availability: "Evenings weekdays, flexible weekends",
    bio: "Backend engineer passionate about scalable systems. Currently transitioning to full-stack development and learning modern frontend technologies.",
    totalSwaps: 8,
    joinedDate: "2023-05-20"
  }
};

const currentUser = {
  id: "current",
  name: "Alex Johnson",
  skillsOffered: ["JavaScript", "React", "CSS", "HTML", "Git"]
};

export default function ProfileDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const user = userId ? mockUserData[userId] : null;

  const handleSubmitRequest = (request: any) => {
    toast({
      title: "Request Sent!",
      description: `Your skill swap request has been sent to ${user?.name}.`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          user={currentUser}
          onProfileClick={() => navigate("/profile")}
          onRequestsClick={() => navigate("/requests")}
        />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">User Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={currentUser}
        onProfileClick={() => navigate("/profile")}
        onRequestsClick={() => navigate("/requests")}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {user.name}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-muted-foreground mb-4">
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{user.location}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span className="text-sm font-medium">{user.rating}/5</span>
                        <span className="text-sm">({user.totalSwaps} swaps)</span>
                      </div>
                    </div>

                    {user.bio && (
                      <p className="text-foreground mb-4">
                        {user.bio}
                      </p>
                    )}

                    <Button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      Request Skill Swap
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills Wanted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                  <p className="text-sm text-foreground">{user.availability}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Swaps</span>
                  <span className="text-sm font-medium">{user.totalSwaps}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rating</span>
                  <span className="text-sm font-medium">{user.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm font-medium">
                    {new Date(user.joinedDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Swap Request Modal */}
      <SwapRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetUser={{
          id: user.id,
          name: user.name,
          skillsWanted: user.skillsWanted
        }}
        currentUserSkills={currentUser.skillsOffered}
        onSubmit={handleSubmitRequest}
      />
    </div>
  );
}