import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { X, Plus, User, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Fetch profile from backend
    fetch('/api/profile', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(err => console.error(err));
  }, []);

  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");

  const handleAddSkillOffered = () => {
    if (newSkillOffered.trim() && !profile.skillsOffered.includes(newSkillOffered.trim())) {
      setProfile(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered("");
    }
  };

  const handleAddSkillWanted = () => {
    if (newSkillWanted.trim() && !profile.skillsWanted.includes(newSkillWanted.trim())) {
      setProfile(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted("");
    }
  };

  const handleRemoveSkillOffered = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const handleRemoveSkillWanted = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const handleSave = () => {
    toast({
      title: "Profile Saved",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleDiscard = () => {
    // Reset to original values - in a real app, this would fetch from API
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded.",
    });
  };

  const currentUser = {
    id: "current",
    name: profile.name,
    avatar: profile.avatar
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={currentUser}
        onProfileClick={() => navigate("/profile")}
        onRequestsClick={() => navigate("/requests")}
      />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Profile</CardTitle>
            <p className="text-muted-foreground">
              Update your information and manage your skills
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Profile Photo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <p className="font-medium">Profile Photo</p>
                <p className="text-sm text-muted-foreground">
                  Click the camera icon to upload a new photo
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>

            {/* Skills Offered */}
            <div>
              <Label>Skills Offered</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {profile.skillsOffered.map((skill) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveSkillOffered(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill you can teach"
                  value={newSkillOffered}
                  onChange={(e) => setNewSkillOffered(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkillOffered()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkillOffered}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <Label>Skills Wanted</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {profile.skillsWanted.map((skill) => (
                  <Badge key={skill} variant="outline" className="flex items-center gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveSkillWanted(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill you want to learn"
                  value={newSkillWanted}
                  onChange={(e) => setNewSkillWanted(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkillWanted()}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkillWanted}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Textarea
                id="availability"
                placeholder="When are you available for skill swaps?"
                value={profile.availability}
                onChange={(e) => setProfile(prev => ({ ...prev, availability: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Profile Visibility</Label>
                <p className="text-sm text-muted-foreground">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch
                checked={profile.isPublic}
                onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isPublic: checked }))}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleDiscard} className="flex-1">
                Discard Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}