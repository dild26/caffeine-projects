import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Lock, Check, X, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';

interface P2PShare {
  id: string;
  targetApp: string;
  dataType: string;
  status: 'pending' | 'approved' | 'revoked';
  createdAt: string;
  encryption: string;
}

export default function P2PSecurePage() {
  const { actor, isFetching: actorFetching } = useActor();
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [dataType, setDataType] = useState<string>('');

  const { data: secoinfiApps = [] } = useQuery({
    queryKey: ['secoinfiApps'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSecoinfiApps();
    },
    enabled: !!actor && !actorFetching,
  });

  const [shares] = useState<P2PShare[]>([
    {
      id: '1',
      targetApp: 'InfiTask',
      dataType: 'Project Data',
      status: 'approved',
      createdAt: '2025-01-15',
      encryption: 'AES-256-GCM',
    },
    {
      id: '2',
      targetApp: 'InfiChat',
      dataType: 'User Profile',
      status: 'pending',
      createdAt: '2025-01-16',
      encryption: 'AES-256-GCM + Split-Key',
    },
  ]);

  const handleCreateShare = () => {
    console.log('Creating share for:', selectedApp, dataType);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          P2P Data-Sharing Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Secure peer-to-peer data sharing with AES-256-GCM encryption and split-key management
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-6 w-6 text-primary" />
            Create New Share
          </CardTitle>
          <CardDescription>Share data securely with other SECOINFI applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetApp">Target Application</Label>
              <Select value={selectedApp} onValueChange={setSelectedApp}>
                <SelectTrigger id="targetApp">
                  <SelectValue placeholder="Select an app" />
                </SelectTrigger>
                <SelectContent>
                  {secoinfiApps.map((app) => (
                    <SelectItem key={app.name} value={app.name}>
                      {app.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataType">Data Type</Label>
              <Input
                id="dataType"
                placeholder="e.g., User Profile, Project Data"
                value={dataType}
                onChange={(e) => setDataType(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Lock className="h-4 w-4 text-primary" />
            <span className="text-sm">Encryption: AES-256-GCM + Split-Key</span>
          </div>
          <Button onClick={handleCreateShare} className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            Create Share
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Active Shares
          </CardTitle>
          <CardDescription>Manage your existing data shares</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shares.map((share) => (
              <Card key={share.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{share.targetApp}</h3>
                        <Badge
                          variant={
                            share.status === 'approved'
                              ? 'default'
                              : share.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {share.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{share.dataType}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="h-3 w-3" />
                        <span>{share.encryption}</span>
                        <span>•</span>
                        <span>Created: {share.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {share.status === 'pending' && (
                        <>
                          <Button size="sm" variant="default">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {share.status === 'approved' && (
                        <Button size="sm" variant="outline">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
