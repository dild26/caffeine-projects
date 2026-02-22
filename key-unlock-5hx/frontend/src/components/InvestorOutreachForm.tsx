import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, Send, Users, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface InvestorOutreachFormProps {
  type: 'join' | 'demo' | 'meet';
  onClose: () => void;
}

export function InvestorOutreachForm({ type, onClose }: InvestorOutreachFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    investmentRange: '',
    interest: '',
    message: '',
  });

  const formConfig = {
    join: {
      title: 'Join as an Investor',
      description: 'Become part of the MOAP investment opportunity',
      icon: UserPlus,
      submitText: 'Submit Application',
    },
    demo: {
      title: 'Request a Demo',
      description: 'Schedule a personalized platform demonstration',
      icon: Send,
      submitText: 'Request Demo',
    },
    meet: {
      title: 'Meet the Founders',
      description: 'Connect with the SECOINFI founding team',
      icon: Users,
      submitText: 'Schedule Meeting',
    },
  };

  const config = formConfig[type];
  const Icon = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate email trigger and form submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Log the submission (in production, this would trigger backend email automation)
      console.log('Investor Outreach Submission:', {
        type,
        formData,
        timestamp: new Date().toISOString(),
      });

      setIsSuccess(true);
      toast.success(`${config.title} request submitted successfully!`);

      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gradient">Request Submitted!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for your interest in MOAP. Our team will review your request and get back to you within 24-48 hours.
        </p>
        <Badge variant="outline" className="text-sm">
          Confirmation email sent to {formData.email}
        </Badge>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-lg bg-primary/10 neon-glow">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">{config.title}</h3>
          <p className="text-sm text-muted-foreground">{config.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company / Fund Name</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="Acme Ventures"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Your Role *</Label>
          <Select value={formData.role} onValueChange={(value) => handleChange('role', value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="angel">Angel Investor</SelectItem>
              <SelectItem value="vc-partner">VC Partner</SelectItem>
              <SelectItem value="vc-associate">VC Associate</SelectItem>
              <SelectItem value="family-office">Family Office</SelectItem>
              <SelectItem value="corporate">Corporate Investor</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {type === 'join' && (
        <div className="space-y-2">
          <Label htmlFor="investmentRange">Investment Range</Label>
          <Select value={formData.investmentRange} onValueChange={(value) => handleChange('investmentRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select investment range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="50k-100k">$50K - $100K</SelectItem>
              <SelectItem value="100k-250k">$100K - $250K</SelectItem>
              <SelectItem value="250k-500k">$250K - $500K</SelectItem>
              <SelectItem value="500k-1m">$500K - $1M</SelectItem>
              <SelectItem value="1m-plus">$1M+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="interest">Primary Interest *</Label>
        <Select value={formData.interest} onValueChange={(value) => handleChange('interest', value)} required>
          <SelectTrigger>
            <SelectValue placeholder="What interests you most?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="platform-vision">Platform Vision & Strategy</SelectItem>
            <SelectItem value="market-opportunity">Market Opportunity</SelectItem>
            <SelectItem value="technology">Technology & Architecture</SelectItem>
            <SelectItem value="team">Team & Execution</SelectItem>
            <SelectItem value="financials">Financials & Projections</SelectItem>
            <SelectItem value="exit-strategy">Exit Strategy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Tell us more about your interest in MOAP..."
          className="h-32"
        />
      </div>

      <Alert>
        <AlertDescription className="text-xs">
          By submitting this form, you agree to receive communications from SECOINFI regarding investment opportunities. 
          Your information will be kept confidential and used solely for investor relations purposes.
        </AlertDescription>
      </Alert>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="neon-glow">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              {config.submitText}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export function InvestorOutreachDialog({ 
  type, 
  isOpen, 
  onClose 
}: { 
  type: 'join' | 'demo' | 'meet'; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-3d max-w-3xl max-h-[90vh] overflow-y-auto">
        <InvestorOutreachForm type={type} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
