import { useState, useEffect } from 'react';
import { useGetPlatformConfig } from '../hooks/usePlatformConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings } from 'lucide-react';
import type { PlatformConfig } from '../types';

interface PlatformConfigurationProps {
  isAdmin: boolean;
}

export default function PlatformConfiguration({ isAdmin }: PlatformConfigurationProps) {
  const { data: config, isLoading } = useGetPlatformConfig();

  const [formData, setFormData] = useState<PlatformConfig>({
    architecture: '',
    security: '',
    privacy: '',
    monetization: '',
    performance: '',
    seo: '',
    roadmap: '',
  });

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  if (isLoading) {
    return (
      <Card className="card-3d">
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-3d">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Settings className="w-6 h-6 text-primary" />
              Platform Configuration
            </CardTitle>
            <CardDescription className="text-base mt-2">
              View platform-wide settings and configurations (Read-only)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="architecture" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="monetization">Monetization</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="architecture" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="architecture">Architecture Configuration</Label>
              <Textarea
                id="architecture"
                value={formData.architecture}
                readOnly
                rows={12}
                className="bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="security">Security Configuration</Label>
              <Textarea
                id="security"
                value={formData.security}
                readOnly
                rows={12}
                className="bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="privacy">Privacy Configuration</Label>
              <Textarea
                id="privacy"
                value={formData.privacy}
                readOnly
                rows={12}
                className="bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="monetization" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monetization">Monetization Strategy</Label>
              <Textarea
                id="monetization"
                value={formData.monetization}
                readOnly
                rows={12}
                className="bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="performance">Performance Targets</Label>
              <Textarea
                id="performance"
                value={formData.performance}
                readOnly
                rows={12}
                className="bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seo">SEO Strategy</Label>
              <Textarea
                id="seo"
                value={formData.seo}
                readOnly
                rows={12}
                className="bg-muted"
              />
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roadmap">Development Roadmap</Label>
              <Textarea
                id="roadmap"
                value={formData.roadmap}
                readOnly
                rows={12}
                className="bg-muted"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
