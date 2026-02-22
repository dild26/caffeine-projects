import { useState, useEffect } from 'react';
import {
  useGetContactInfo,
  useUpdateContactInfo,
  useGetContactInfoHistory,
} from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, History, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { ContactInfo } from '../backend';

interface ContactInfoManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactInfoManager({ open, onOpenChange }: ContactInfoManagerProps) {
  const { data: contactInfo, isLoading } = useGetContactInfo();
  const { data: history = [] } = useGetContactInfoHistory();
  const updateContactInfo = useUpdateContactInfo();

  const [formData, setFormData] = useState({
    companyName: 'SECOINFI',
    ceoName: 'DILEEP KUMAR D',
    primaryEmail: 'dild26@gmail.com',
    phone: '+91-962-005-8644',
    website: 'www.seco.in.net',
    whatsapp: '+91-962-005-8644',
    businessAddress:
      'Sudha Enterprises, No.157, V R Vihar, Varadaraj Nagar, Vidyaranyapur PO, Bangalore-560097',
    paypal: 'newgoldenjewel@gmail.com',
    upiId: 'secoin@uboi',
    ethId: '0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7',
    mapLink: 'https://maps.google.com',
    logoText: 'SECOINFI',
    logoImageUrl: '',
  });

  const [socialLinks, setSocialLinks] = useState<Array<[string, string]>>([
    ['Facebook', 'https://facebook.com/dild26'],
    ['LinkedIn', 'https://www.linkedin.com/in/dild26'],
    ['Telegram', 'https://t.me/dilee'],
    ['Discord', 'https://discord.com/users/dild26'],
    ['Blogspot', 'https://dildiva.blogspot.com'],
    ['Instagram', 'https://instagram.com/newgoldenjewel'],
    ['X', 'https://twitter.com/dil_sec'],
    ['YouTube', 'https://m.youtube.com/@dileepkumard4484/videos'],
  ]);

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        companyName: contactInfo.companyName,
        ceoName: contactInfo.ceoName,
        primaryEmail: contactInfo.primaryEmail,
        phone: contactInfo.phone,
        website: contactInfo.website,
        whatsapp: contactInfo.whatsapp,
        businessAddress: contactInfo.businessAddress,
        paypal: contactInfo.paypal,
        upiId: contactInfo.upiId,
        ethId: contactInfo.ethId,
        mapLink: contactInfo.mapLink,
        logoText: contactInfo.logoText,
        logoImageUrl: contactInfo.logoImageUrl,
      });
      setSocialLinks(contactInfo.socialLinks);
    }
  }, [contactInfo]);

  const handleSubmit = async () => {
    try {
      const updatedInfo: ContactInfo = {
        ...formData,
        socialLinks,
        createdAt: contactInfo?.createdAt || BigInt(Date.now() * 1000000),
        updatedAt: BigInt(Date.now() * 1000000),
        version: contactInfo ? contactInfo.version + BigInt(1) : BigInt(1),
      };
      await updateContactInfo.mutateAsync(updatedInfo);
      toast.success('Contact information updated successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update contact information');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Contact Information</DialogTitle>
          <DialogDescription>Update company contact details and view version history</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ceoName">CEO Name</Label>
                <Input
                  id="ceoName"
                  value={formData.ceoName}
                  onChange={(e) => setFormData({ ...formData, ceoName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="primaryEmail">Primary Email</Label>
                <Input
                  id="primaryEmail"
                  type="email"
                  value={formData.primaryEmail}
                  onChange={(e) => setFormData({ ...formData, primaryEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="businessAddress">Business Address</Label>
              <Textarea
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="paypal">PayPal</Label>
                <Input
                  id="paypal"
                  value={formData.paypal}
                  onChange={(e) => setFormData({ ...formData, paypal: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="ethId">ETH ID</Label>
                <Input
                  id="ethId"
                  value={formData.ethId}
                  onChange={(e) => setFormData({ ...formData, ethId: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mapLink">Map Link</Label>
              <Input
                id="mapLink"
                value={formData.mapLink}
                onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={updateContactInfo.isPending}>
                {updateContactInfo.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {history.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No version history available</div>
            ) : (
              <div className="space-y-2">
                {history.map((version) => (
                  <Card key={version.version.toString()}>
                    <CardHeader>
                      <CardTitle className="text-base">Version {version.version.toString()}</CardTitle>
                      <CardDescription>
                        Updated: {new Date(Number(version.updatedAt) / 1000000).toLocaleString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Company: {version.contactInfo.companyName}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
