import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageDiscoveryDashboard from '../components/PageDiscoveryDashboard';
import FixtureVotingSystem from '../components/FixtureVotingSystem';
import MerkleTreeVisualization from '../components/MerkleTreeVisualization';
import SuperAdminPageManager from '../components/SuperAdminPageManager';
import SignedMessageBus from '../components/SignedMessageBus';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Shield, GitBranch, Crown, Send } from 'lucide-react';

export default function PageManagementDashboard() {
  const [activeTab, setActiveTab] = useState('discovery');

  return (
    <div className="space-y-6">
      <Card className="card-3d border-4 border-primary/30">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-gradient mb-2">
            Deterministic AI Discovery & Admin-Controlled Page Management
          </CardTitle>
          <CardDescription className="text-lg">
            Complete system for page discovery, fixture-based voting, Merkle verification, and cross-app management
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 gap-2">
          <TabsTrigger value="discovery" className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Discovery
          </TabsTrigger>
          <TabsTrigger value="voting" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Fixture Voting
          </TabsTrigger>
          <TabsTrigger value="merkle" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Merkle Tree
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Super-Admin
          </TabsTrigger>
          <TabsTrigger value="broadcast" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Message Bus
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discovery">
          <PageDiscoveryDashboard />
        </TabsContent>

        <TabsContent value="voting">
          <FixtureVotingSystem />
        </TabsContent>

        <TabsContent value="merkle">
          <MerkleTreeVisualization />
        </TabsContent>

        <TabsContent value="admin">
          <SuperAdminPageManager />
        </TabsContent>

        <TabsContent value="broadcast">
          <SignedMessageBus />
        </TabsContent>
      </Tabs>
    </div>
  );
}
