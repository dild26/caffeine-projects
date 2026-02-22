import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useGetAllTopics } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, User, Award, Briefcase, GraduationCap, Edit2, Save, X, Eye, EyeOff, Lock } from 'lucide-react';

export default function ProfilePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();
  const { data: allTopics = [] } = useGetAllTopics();
  const saveProfile = useSaveCallerUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [experiences, setExperiences] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [specializations, setSpecializations] = useState('');
  const [pros, setPros] = useState('');
  const [usps, setUsps] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [visibleTopics, setVisibleTopics] = useState<string[]>([]);

  const isAuthenticated = !!identity;

  // Filter topics created by current user
  const myTopics = allTopics.filter(topic => 
    topic.creator.toString() === identity?.getPrincipal().toString()
  );

  const handleEdit = () => {
    if (userProfile) {
      setName(userProfile.name);
      setSkills(userProfile.skills.join(', '));
      setExperiences(userProfile.experiences.join(', '));
      setQualifications(userProfile.qualifications.join(', '));
      setSpecializations(userProfile.specializations.join(', '));
      setPros(userProfile.pros.join(', '));
      setUsps(userProfile.usps.join(', '));
      setIsPublic(userProfile.isPublic);
      setVisibleTopics(userProfile.visibleTopics);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      await saveProfile.mutateAsync({
        ...userProfile,
        name: name.trim(),
        skills: skills.split(',').map(s => s.trim()).filter(Boolean),
        experiences: experiences.split(',').map(e => e.trim()).filter(Boolean),
        qualifications: qualifications.split(',').map(q => q.trim()).filter(Boolean),
        specializations: specializations.split(',').map(s => s.trim()).filter(Boolean),
        pros: pros.split(',').map(p => p.trim()).filter(Boolean),
        usps: usps.split(',').map(u => u.trim()).filter(Boolean),
        isPublic,
        visibleTopics,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleTopicVisibilityToggle = (topicId: string) => {
    setVisibleTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <p className="text-lg text-muted-foreground mb-8">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20">
        <div className="container text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Profile</h1>
          <p className="text-lg text-muted-foreground mb-8">Profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Profile</h1>
          {!isEditing ? (
            <Button onClick={handleEdit} className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saveProfile.isPending} className="gap-2">
                {saveProfile.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" className="gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {isEditing && (
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your profile and topics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
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

                {isPublic && myTopics.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <Label className="text-base">Topic Visibility</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select which topics are visible to others. Leave all unchecked to show all topics.
                      </p>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {myTopics.map((topic) => (
                        <div key={topic.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                          <Checkbox
                            id={topic.id}
                            checked={visibleTopics.length === 0 || visibleTopics.includes(topic.id)}
                            onCheckedChange={() => handleTopicVisibilityToggle(topic.id)}
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={topic.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {topic.content}
                            </Label>
                            <p className="text-xs text-muted-foreground mt-1">
                              {topic.description.slice(0, 80)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isPublic && (
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Your profile is private. Only you can see your information and topics.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Basic Information
                {!isEditing && (
                  <Badge variant={userProfile.isPublic ? "default" : "secondary"} className="ml-2">
                    {userProfile.isPublic ? <><Eye className="h-3 w-3 mr-1" />Public</> : <><EyeOff className="h-3 w-3 mr-1" />Private</>}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Referral ID</Label>
                    <Input value={userProfile.referralId} disabled />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Name</p>
                    <p className="text-lg font-semibold">{userProfile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Referral ID</p>
                    <p className="font-mono text-sm">{userProfile.referralId}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Total Votes</p>
                      <p className="text-2xl font-bold text-primary">{Number(userProfile.totalVotes)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Referral Earnings</p>
                      <p className="text-2xl font-bold text-primary">${Number(userProfile.referralEarnings) / 100}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Textarea
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows={3}
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userProfile.skills.length > 0 ? (
                    userProfile.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Experience
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="experiences">Experiences (comma-separated)</Label>
                  <Textarea
                    id="experiences"
                    value={experiences}
                    onChange={(e) => setExperiences(e.target.value)}
                    rows={3}
                  />
                </div>
              ) : (
                <ul className="space-y-2">
                  {userProfile.experiences.length > 0 ? (
                    userProfile.experiences.map((exp, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        • {exp}
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No experiences added yet</p>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="qualifications">Qualifications (comma-separated)</Label>
                  <Textarea
                    id="qualifications"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    rows={3}
                  />
                </div>
              ) : (
                <ul className="space-y-2">
                  {userProfile.qualifications.length > 0 ? (
                    userProfile.qualifications.map((qual, idx) => (
                      <li key={idx} className="text-muted-foreground">
                        • {qual}
                      </li>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No qualifications added yet</p>
                  )}
                </ul>
              )}
            </CardContent>
          </Card>

          {isEditing && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Specializations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                    <Textarea
                      id="specializations"
                      value={specializations}
                      onChange={(e) => setSpecializations(e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Professional Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="pros">Pros (comma-separated)</Label>
                    <Textarea
                      id="pros"
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Unique Selling Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="usps">USPs (comma-separated)</Label>
                    <Textarea
                      id="usps"
                      value={usps}
                      onChange={(e) => setUsps(e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
