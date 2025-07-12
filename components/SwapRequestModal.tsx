import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: {
    id: string;
    name: string;
    skillsWanted: string[];
  };
  currentUserSkills: string[];
  onSubmit: (request: {
    targetUserId: string;
    offeredSkill: string;
    requestedSkill: string;
    message: string;
  }) => void;
}

export function SwapRequestModal({
  isOpen,
  onClose,
  targetUser,
  currentUserSkills,
  onSubmit
}: SwapRequestModalProps) {
  const [offeredSkill, setOfferedSkill] = useState("");
  const [requestedSkill, setRequestedSkill] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!offeredSkill || !requestedSkill) return;

    onSubmit({
      targetUserId: targetUser.id,
      offeredSkill,
      requestedSkill,
      message
    });

    // Reset form
    setOfferedSkill("");
    setRequestedSkill("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Skill Swap with {targetUser.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="offered-skill">Your Skill to Offer</Label>
            <Select value={offeredSkill} onValueChange={setOfferedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Choose one of your skills" />
              </SelectTrigger>
              <SelectContent>
                {currentUserSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="requested-skill">Skill You Want to Learn</Label>
            <Select value={requestedSkill} onValueChange={setRequestedSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Choose from their skills" />
              </SelectTrigger>
              <SelectContent>
                {targetUser.skillsWanted.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!offeredSkill || !requestedSkill}
          >
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}