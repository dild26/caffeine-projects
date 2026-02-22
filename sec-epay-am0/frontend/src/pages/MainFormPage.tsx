import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  useGetAdminSettings, 
  useUpdateAdminSettings, 
  useGetContactInfo, 
  useUpdateContactInfo, 
  useIsCallerAdmin,
  usePublishTermsVersion,
  useCreateAdminNotice,
  useGetAllTermsVersions,
  useGetAllUserTermsAcceptances
} from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Shield, Settings, Mail, Users, FileText, Bell, History } from 'lucide-react';
import type { ContactInfo, TermsVersion, AdminNotice } from '../backend';
import { Variant_info_legal_critical } from '../backend';

export default function MainFormPage() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: adminSettings, isLoading: settingsLoading } = useGetAdminSettings();
  const { data: contactInfo, isLoading: contactLoading } = useGetContactInfo();
  const { data: allTermsVersions } = useGetAllTermsVersions();
  const { data: allAcceptances } = useGetAllUserTermsAcceptances();
  const updateSettings = useUpdateAdminSettings();
  const updateContact = useUpdateContactInfo();
  const publishTerms = usePublishTermsVersion();
  const createNotice = useCreateAdminNotice();

  // Main configuration state
  const [conversionRate, setConversionRate] = useState('90');
  const [subscriptionFee, setSubscriptionFee] = useState('1000');
  const [rotationCycle, setRotationCycle] = useState('3600');

  // Contact info state
  const [contactForm, setContactForm] = useState<ContactInfo>({
    ceo: '',
    email: '',
    phone: '',
    website: '',
    whatsapp: '',
    address: '',
    paypal: '',
    upiId: '',
    ethId: '',
    facebook: '',
    linkedin: '',
    telegram: '',
    discord: '',
    blog: '',
    instagram: '',
    twitter: '',
    youtube: '',
    mapLink: '',
    googleMapsLink: '',
  });

  // Terms management state
  const [termsForm, setTermsForm] = useState({
    slug: '',
    title: '',
    content: '',
    changelog: '',
    criticalUpdate: false,
  });

  // Admin notice state
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    body: '',
    noticeType: Variant_info_legal_critical.info,
    requiresAcceptance: false,
    linkedTermsVersionId: '',
  });

  useEffect(() => {
    if (adminSettings) {
      setConversionRate(adminSettings.conversionRate.toString());
      setSubscriptionFee(adminSettings.subscriptionFee.toString());
      setRotationCycle(adminSettings.rotationCycle.toString());
    }
  }, [adminSettings]);

  useEffect(() => {
    if (contactInfo) {
      setContactForm(contactInfo);
    }
  }, [contactInfo]);

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to access the main configuration form.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (adminLoading || settingsLoading || contactLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="mr-2 h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>You do not have administrator privileges to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleMainConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings.mutateAsync({
        conversionRate: BigInt(conversionRate),
        subscriptionFee: BigInt(subscriptionFee),
        rotationCycle: BigInt(rotationCycle),
      });
      toast.success('Main configuration updated successfully');
    } catch (error) {
      toast.error('Failed to update main configuration');
      console.error(error);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateContact.mutateAsync(contactForm);
      toast.success('Contact information updated successfully');
    } catch (error) {
      toast.error('Failed to update contact information');
      console.error(error);
    }
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePublishTerms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) return;

    try {
      const nextVersion = allTermsVersions ? allTermsVersions.length + 1 : 1;
      
      const newTerms: TermsVersion = {
        id: BigInt(0), // Will be set by backend
        slug: termsForm.slug,
        version: BigInt(nextVersion),
        title: termsForm.title,
        effectiveDate: BigInt(Date.now() * 1_000_000),
        content: termsForm.content,
        changelog: termsForm.changelog,
        isPublic: true,
        criticalUpdate: termsForm.criticalUpdate,
        createdByAdmin: identity.getPrincipal(),
      };

      await publishTerms.mutateAsync(newTerms);
      toast.success('Terms published successfully');
      
      // Reset form
      setTermsForm({
        slug: '',
        title: '',
        content: '',
        changelog: '',
        criticalUpdate: false,
      });
    } catch (error) {
      toast.error('Failed to publish terms');
      console.error(error);
    }
  };

  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newNotice: AdminNotice = {
        id: BigInt(0), // Will be set by backend
        title: noticeForm.title,
        body: noticeForm.body,
        noticeType: noticeForm.noticeType,
        effectiveDate: BigInt(Date.now() * 1_000_000),
        requiresAcceptance: noticeForm.requiresAcceptance,
        linkedTermsVersionId: noticeForm.linkedTermsVersionId ? BigInt(noticeForm.linkedTermsVersionId) : undefined,
      };

      await createNotice.mutateAsync(newNotice);
      toast.success('Admin notice created successfully');
      
      // Reset form
      setNoticeForm({
        title: '',
        body: '',
        noticeType: Variant_info_legal_critical.info,
        requiresAcceptance: false,
        linkedTermsVersionId: '',
      });
    } catch (error) {
      toast.error('Failed to create admin notice');
      console.error(error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Settings className="mr-3 h-8 w-8 text-primary" />
            Main Configuration Form
          </h1>
          <p className="text-muted-foreground">Update system variables and configuration settings</p>
        </div>

        <Tabs defaultValue="main" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="main" className="flex items-center text-xs">
              <Settings className="mr-1 h-3 w-3" />
              Main
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center text-xs">
              <Mail className="mr-1 h-3 w-3" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center text-xs">
              <Users className="mr-1 h-3 w-3" />
              Access
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center text-xs">
              <FileText className="mr-1 h-3 w-3" />
              Terms
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center text-xs">
              <History className="mr-1 h-3 w-3" />
              Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <Card>
              <CardHeader>
                <CardTitle>Main Configuration (main.mo)</CardTitle>
                <CardDescription>Configure core system parameters and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMainConfigSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="conversionRate">USD to INR Conversion Rate</Label>
                    <Input
                      id="conversionRate"
                      type="number"
                      value={conversionRate}
                      onChange={(e) => setConversionRate(e.target.value)}
                      placeholder="90"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Exchange rate for currency conversion (1 USD = {conversionRate} INR)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriptionFee">Subscription Fee (INR)</Label>
                    <Input
                      id="subscriptionFee"
                      type="number"
                      value={subscriptionFee}
                      onChange={(e) => setSubscriptionFee(e.target.value)}
                      placeholder="1000"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Default subscription fee for leaderboard broadcasting (₹{Number(subscriptionFee).toLocaleString()})
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rotationCycle">Leaderboard Rotation Cycle (seconds)</Label>
                    <Input
                      id="rotationCycle"
                      type="number"
                      value={rotationCycle}
                      onChange={(e) => setRotationCycle(e.target.value)}
                      placeholder="3600"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Time interval for leaderboard rotation ({Math.floor(Number(rotationCycle) / 3600)} hour{Math.floor(Number(rotationCycle) / 3600) !== 1 ? 's' : ''})
                    </p>
                  </div>

                  <Button type="submit" disabled={updateSettings.isPending}>
                    {updateSettings.isPending ? 'Updating...' : 'Update Main Configuration'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update company contact details and social media links</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ceo">CEO & Founder</Label>
                      <Input
                        id="ceo"
                        value={contactForm.ceo}
                        onChange={(e) => handleContactChange('ceo', e.target.value)}
                        placeholder="CEO Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Primary Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                        placeholder="email@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Business Phone</Label>
                      <Input
                        id="phone"
                        value={contactForm.phone}
                        onChange={(e) => handleContactChange('phone', e.target.value)}
                        placeholder="+91-XXX-XXX-XXXX"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={contactForm.whatsapp}
                        onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                        placeholder="+91-XXX-XXX-XXXX"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={contactForm.website}
                        onChange={(e) => handleContactChange('website', e.target.value)}
                        placeholder="www.example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Business Address</Label>
                      <Textarea
                        id="address"
                        value={contactForm.address}
                        onChange={(e) => handleContactChange('address', e.target.value)}
                        placeholder="Full business address"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paypal">PayPal Email</Label>
                      <Input
                        id="paypal"
                        type="email"
                        value={contactForm.paypal}
                        onChange={(e) => handleContactChange('paypal', e.target.value)}
                        placeholder="paypal@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={contactForm.upiId}
                        onChange={(e) => handleContactChange('upiId', e.target.value)}
                        placeholder="username@bank"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="ethId">ETH ID</Label>
                      <Input
                        id="ethId"
                        value={contactForm.ethId}
                        onChange={(e) => handleContactChange('ethId', e.target.value)}
                        placeholder="0x..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook URL</Label>
                      <Input
                        id="facebook"
                        value={contactForm.facebook}
                        onChange={(e) => handleContactChange('facebook', e.target.value)}
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn URL</Label>
                      <Input
                        id="linkedin"
                        value={contactForm.linkedin}
                        onChange={(e) => handleContactChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telegram">Telegram URL</Label>
                      <Input
                        id="telegram"
                        value={contactForm.telegram}
                        onChange={(e) => handleContactChange('telegram', e.target.value)}
                        placeholder="https://t.me/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discord">Discord URL</Label>
                      <Input
                        id="discord"
                        value={contactForm.discord}
                        onChange={(e) => handleContactChange('discord', e.target.value)}
                        placeholder="https://discord.com/users/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="blog">Blog URL</Label>
                      <Input
                        id="blog"
                        value={contactForm.blog}
                        onChange={(e) => handleContactChange('blog', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input
                        id="instagram"
                        value={contactForm.instagram}
                        onChange={(e) => handleContactChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter">X/Twitter URL</Label>
                      <Input
                        id="twitter"
                        value={contactForm.twitter}
                        onChange={(e) => handleContactChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="youtube">YouTube URL</Label>
                      <Input
                        id="youtube"
                        value={contactForm.youtube}
                        onChange={(e) => handleContactChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="mapLink">Map Link</Label>
                      <Input
                        id="mapLink"
                        value={contactForm.mapLink}
                        onChange={(e) => handleContactChange('mapLink', e.target.value)}
                        placeholder="https://maps.google.com/?q=..."
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="googleMapsLink">Google Maps Directions Link</Label>
                      <Input
                        id="googleMapsLink"
                        value={contactForm.googleMapsLink}
                        onChange={(e) => handleContactChange('googleMapsLink', e.target.value)}
                        placeholder="https://www.google.com/maps/dir/?api=1&destination=..."
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={updateContact.isPending}>
                    {updateContact.isPending ? 'Updating...' : 'Update Contact Information'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <Card>
              <CardHeader>
                <CardTitle>Access Control & User Approval</CardTitle>
                <CardDescription>
                  Configuration for authorization/access-control.mo and user-approval/approval.mo modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-2">Authorization Module</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      The access control system manages user roles (admin, user, guest) and permissions.
                      The first user to initialize the system automatically becomes an admin.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Role assignments and permission checks are handled through the backend.
                      Use the Admin Dashboard to manage user roles and approvals.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-2">User Approval Module</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      The approval system tracks user approval status (pending, approved, rejected).
                      New users must request approval before accessing protected features.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Manage user approvals through the Admin Dashboard → Approvals tab.
                    </p>
                  </div>

                  <div className="flex items-center justify-center py-8">
                    <Button variant="outline" onClick={() => window.location.href = '/admin'}>
                      Go to Admin Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Publish New Terms Version
                  </CardTitle>
                  <CardDescription>Create and publish a new version of Terms of Service</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePublishTerms} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="termsSlug">Slug (URL-friendly identifier)</Label>
                      <Input
                        id="termsSlug"
                        value={termsForm.slug}
                        onChange={(e) => setTermsForm(prev => ({ ...prev, slug: e.target.value }))}
                        placeholder="terms-of-service-2025"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="termsTitle">Title</Label>
                      <Input
                        id="termsTitle"
                        value={termsForm.title}
                        onChange={(e) => setTermsForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Secoinfi ePay Terms of Service"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="termsContent">Content</Label>
                      <Textarea
                        id="termsContent"
                        value={termsForm.content}
                        onChange={(e) => setTermsForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter the full terms of service content..."
                        rows={12}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="termsChangelog">Changelog (What's Changed)</Label>
                      <Textarea
                        id="termsChangelog"
                        value={termsForm.changelog}
                        onChange={(e) => setTermsForm(prev => ({ ...prev, changelog: e.target.value }))}
                        placeholder="Describe what changed in this version..."
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="criticalUpdate"
                        checked={termsForm.criticalUpdate}
                        onCheckedChange={(checked) => setTermsForm(prev => ({ ...prev, criticalUpdate: checked === true }))}
                      />
                      <label htmlFor="criticalUpdate" className="text-sm font-medium cursor-pointer">
                        Mark as Critical Update (requires user re-acceptance)
                      </label>
                    </div>

                    <Button type="submit" disabled={publishTerms.isPending}>
                      {publishTerms.isPending ? 'Publishing...' : 'Publish Terms Version'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="mr-2 h-5 w-5" />
                    Create Admin Notice
                  </CardTitle>
                  <CardDescription>Post important notices for users</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateNotice} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="noticeTitle">Notice Title</Label>
                      <Input
                        id="noticeTitle"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Important Update"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="noticeBody">Notice Body</Label>
                      <Textarea
                        id="noticeBody"
                        value={noticeForm.body}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, body: e.target.value }))}
                        placeholder="Enter the notice content..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="noticeType">Notice Type</Label>
                      <select
                        id="noticeType"
                        value={noticeForm.noticeType}
                        onChange={(e) => setNoticeForm(prev => ({ ...prev, noticeType: e.target.value as Variant_info_legal_critical }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background"
                      >
                        <option value={Variant_info_legal_critical.info}>Info</option>
                        <option value={Variant_info_legal_critical.critical}>Critical</option>
                        <option value={Variant_info_legal_critical.legal}>Legal</option>
                      </select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requiresAcceptance"
                        checked={noticeForm.requiresAcceptance}
                        onCheckedChange={(checked) => setNoticeForm(prev => ({ ...prev, requiresAcceptance: checked === true }))}
                      />
                      <label htmlFor="requiresAcceptance" className="text-sm font-medium cursor-pointer">
                        Requires User Acceptance
                      </label>
                    </div>

                    <Button type="submit" disabled={createNotice.isPending}>
                      {createNotice.isPending ? 'Creating...' : 'Create Admin Notice'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="mr-2 h-5 w-5" />
                    Terms Publication History
                  </CardTitle>
                  <CardDescription>All published terms versions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    {allTermsVersions && allTermsVersions.length > 0 ? (
                      <div className="space-y-4">
                        {allTermsVersions
                          .sort((a, b) => Number(b.version) - Number(a.version))
                          .map((version) => (
                            <div key={Number(version.id)} className="border border-border rounded-lg p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold">{version.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Version {Number(version.version)} • {formatDate(version.effectiveDate)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  {version.criticalUpdate && (
                                    <Badge variant="destructive">Critical</Badge>
                                  )}
                                  <Badge variant="outline">v{Number(version.version)}</Badge>
                                </div>
                              </div>
                              {version.changelog && (
                                <p className="text-sm text-muted-foreground mt-2">{version.changelog}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No terms published yet</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Acceptance Records</CardTitle>
                  <CardDescription>Track user acceptance of terms</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {allAcceptances && allAcceptances.length > 0 ? (
                      <div className="space-y-2">
                        {allAcceptances
                          .sort((a, b) => Number(b.acceptedAt) - Number(a.acceptedAt))
                          .map((acceptance, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg text-sm">
                              <div>
                                <p className="font-mono text-xs">{acceptance.userPrincipal.toString().slice(0, 20)}...</p>
                                <p className="text-muted-foreground text-xs">Version {Number(acceptance.termsVersionId)}</p>
                              </div>
                              <p className="text-muted-foreground text-xs">{formatDate(acceptance.acceptedAt)}</p>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No acceptance records yet</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
