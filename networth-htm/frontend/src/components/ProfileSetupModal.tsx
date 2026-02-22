import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [experiences, setExperiences] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    setOpen(showProfileSetup);
  }, [showProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const referralId = identity?.getPrincipal().toString().slice(0, 8) || '';

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        experiences: experiences.split(',').map(e => e.trim()).filter(Boolean),
        qualifications: qualifications.split(',').map(q => q.trim()).filter(Boolean),
        specializations: [],
        pros: [],
        usps: [],
        referralId,
        totalVotes: BigInt(0),
        referralEarnings: BigInt(0),
        isPublic,
        visibleTopics: [],
      });

      toast.success('Profile created successfully!');
      setOpen(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to Your NetWorth!</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get started. This information will help others discover your expertise.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experiences">Experiences (comma-separated)</Label>
            <Textarea
              id="experiences"
              value={experiences}
              onChange={(e) => setExperiences(e.target.value)}
              placeholder="e.g., 5 years in web development, Led team of 10"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
            <Textarea
              id="qualifications"
              value={qualifications}
              onChange={(e) => setQualifications(e.target.value)}
              placeholder="e.g., BS Computer Science, AWS Certified"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile" className="text-base">Public Profile</Label>
              <p className="text-sm text-muted-foreground">
                Make your profile visible to all users
              </p>
            </div>
            <Switch
              id="public-profile"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
            {saveProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Create Profile'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
