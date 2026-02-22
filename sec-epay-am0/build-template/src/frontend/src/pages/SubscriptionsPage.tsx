import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetSubscription, useCreateSubscription, useGetAdminSettings } from '../hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Clock, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { formatUnitValue } from '../lib/unitConversion';

export default function SubscriptionsPage() {
  const { identity } = useInternetIdentity();
  const { data: subscription, isLoading } = useGetSubscription();
  const { data: adminSettings } = useGetAdminSettings();
  const createSubscription = useCreateSubscription();

  const [qrc, setQrc] = useState('');
  const [durationType, setDurationType] = useState<'minutes' | 'hours' | 'days' | 'weeks'>('days');
  const [durationValue, setDurationValue] = useState('7');

  if (!identity) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please login to manage subscriptions.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!qrc) {
      toast.error('Please enter your QRC code');
      return;
    }

    const multipliers = {
      minutes: 60,
      hours: 3600,
      days: 86400,
      weeks: 604800,
    };

    const durationInSeconds = Number(durationValue) * multipliers[durationType];

    try {
      await createSubscription.mutateAsync({
        qrc,
        duration: BigInt(durationInSeconds),
      });
      toast.success('Subscription created successfully!');
      setQrc('');
    } catch (error) {
      toast.error('Failed to create subscription');
      console.error(error);
    }
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const formatDuration = (start: bigint, end: bigint) => {
    const durationMs = Number(end - start) / 1_000_000;
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscriptions</h1>
        <p className="text-muted-foreground">Subscribe to broadcast your QRC on the rotating leaderboard.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Subscribe to Leaderboard
            </CardTitle>
            <CardDescription>
              Broadcast your QRC code to potential customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscription && 'active' in subscription.status ? (
              <div className="text-center py-8">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Active Subscription</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You already have an active subscription
                </p>
                <Badge variant="default" className="mb-4">Active</Badge>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="qrc">QRC Code / UPI ID</Label>
                  <Input
                    id="qrc"
                    value={qrc}
                    onChange={(e) => setQrc(e.target.value)}
                    placeholder="yourname@upi or QRC code"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subscription Duration</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={durationValue}
                      onChange={(e) => setDurationValue(e.target.value)}
                      placeholder="Duration"
                      required
                    />
                    <Select value={durationType} onValueChange={(v) => setDurationType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {adminSettings && (
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <p className="text-sm font-medium mb-1">Subscription Fee</p>
                    <p className="text-2xl font-bold">{formatUnitValue(adminSettings.subscriptionFee)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Average global price set by admin
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={createSubscription.isPending}>
                  {createSubscription.isPending ? 'Processing...' : 'Subscribe Now'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Your subscription details and status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading subscription...</div>
            ) : subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={'active' in subscription.status ? 'default' : 'paused' in subscription.status ? 'secondary' : 'outline'}>
                    {Object.keys(subscription.status)[0]}
                  </Badge>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg">
                  <p className="text-sm font-medium mb-2 flex items-center">
                    <Award className="mr-2 h-4 w-4" />
                    QRC Code
                  </p>
                  <p className="text-xs break-all font-mono bg-background p-2 rounded">{subscription.qrc}</p>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                  <span className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Fee Paid
                  </span>
                  <span className="font-semibold">{formatUnitValue(subscription.fee)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Start Time
                    </span>
                    <span className="text-xs">{formatTimestamp(subscription.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <span className="text-sm font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      End Time
                    </span>
                    <span className="text-xs">{formatTimestamp(subscription.endTime)}</span>
                  </div>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-1">Duration</p>
                  <p className="text-lg font-bold">{formatDuration(subscription.startTime, subscription.endTime)}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No subscription found</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Subscribe to get featured on the leaderboard
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
