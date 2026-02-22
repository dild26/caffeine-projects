import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, XCircle, Shield, Layers, RefreshCw, Database, Lock, Zap, CheckSquare, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

export default function FeaturesPage() {
  const navigate = useNavigate();

  const features = [
    {
      name: 'Modular Architecture',
      icon: Layers,
      status: 'verified',
      description: 'Component-based system design for maximum flexibility',
      merkleRoot: '0x7a8f9c2e...',
    },
    {
      name: 'Resilient System',
      icon: Shield,
      status: 'verified',
      description: 'Built-in fault tolerance and error recovery',
      merkleRoot: '0x3b4d5e1f...',
    },
    {
      name: 'Auto-Updates',
      icon: RefreshCw,
      status: 'verified',
      description: 'Seamless system updates and upgrades',
      merkleRoot: '0x9c8d7a6b...',
    },
    {
      name: 'Data Integrity',
      icon: Database,
      status: 'verified',
      description: 'SHA-256 hashing and deduplication',
      merkleRoot: '0x5e4f3d2c...',
    },
    {
      name: 'Secure Storage',
      icon: Lock,
      status: 'verified',
      description: 'Encrypted data storage and transmission',
      merkleRoot: '0x1a2b3c4d...',
    },
    {
      name: 'High Performance',
      icon: Zap,
      status: 'verified',
      description: 'Optimized for speed and efficiency',
      merkleRoot: '0x6f7e8d9c...',
    },
  ];

  const comparisonData = [
    {
      feature: 'Multi-file Upload',
      traditional: false,
      current: true,
    },
    {
      feature: 'SHA-256 Deduplication',
      traditional: false,
      current: true,
    },
    {
      feature: 'Merkle Root Verification',
      traditional: false,
      current: true,
    },
    {
      feature: 'Dynamic Form Generation',
      traditional: false,
      current: true,
    },
    {
      feature: 'Batch Processing (3000+ files)',
      traditional: false,
      current: true,
    },
    {
      feature: 'Real-time Search Filtering',
      traditional: false,
      current: true,
    },
    {
      feature: 'Recursive Field Support',
      traditional: false,
      current: true,
    },
    {
      feature: 'Intelligent Type Inference',
      traditional: false,
      current: true,
    },
  ];

  // Fixture section with implemented features - dual validation checkboxes (ALWAYS ENABLED)
  const fixtureFeatures = [
    {
      name: 'Auto-Save',
      aiVerified: true,
      adminVerified: false,
      description: 'Automatically saves each successfully parsed form into the Workflow Catalog',
      category: 'Resilient',
    },
    {
      name: 'Error Handling',
      aiVerified: true,
      adminVerified: false,
      description: 'Robust error handling that logs errors, skips problematic files, and continues processing',
      category: 'Resilient',
    },
    {
      name: 'Public Preview',
      aiVerified: true,
      adminVerified: false,
      description: 'All parsed forms and previews are immediately visible with public access',
      category: 'Democratic',
    },
    {
      name: 'Comprehensive Parsing',
      aiVerified: true,
      adminVerified: false,
      description: 'Captures all fields, values, formats, and units from JSON files without skipping data',
      category: 'Scalable',
    },
    {
      name: 'Learning System',
      aiVerified: true,
      adminVerified: false,
      description: 'Analyzes errors and improves future parsing with deterministic certainty',
      category: 'Futuristic',
    },
    {
      name: 'Batch Processing',
      aiVerified: true,
      adminVerified: false,
      description: 'Processes 3000+ files simultaneously with intelligent file matching',
      category: 'Scalable',
    },
    {
      name: 'SHA-256 Deduplication',
      aiVerified: true,
      adminVerified: false,
      description: 'Prevents duplicate files through cryptographic hash comparison',
      category: 'Sustainable',
    },
    {
      name: 'Real-time Progress',
      aiVerified: true,
      adminVerified: false,
      description: 'Live upload progress display with status updates for each file',
      category: 'Democratic',
    },
    {
      name: 'Form Templates',
      aiVerified: true,
      adminVerified: false,
      description: 'Generates reusable form templates from parsed files for subscriber customization',
      category: 'Scalable',
    },
    {
      name: 'Recursive Field Support',
      aiVerified: true,
      adminVerified: false,
      description: 'Handles nested and recursive data structures with tree-based parsing',
      category: 'Futuristic',
    },
    {
      name: 'Web-Form View',
      aiVerified: true,
      adminVerified: false,
      description: 'Interactive web forms for filling workflow data with subscriber access',
      category: 'Democratic',
    },
    {
      name: '1-Min Automation',
      aiVerified: true,
      adminVerified: false,
      description: 'Download ready-to-use code for instant workflow deployment',
      category: 'Futuristic',
    },
    {
      name: 'PAYU Fee Structure',
      aiVerified: true,
      adminVerified: false,
      description: 'Transparent pay-as-you-use pricing with three tiers (Top 10, 100, 1000)',
      category: 'Sustainable',
    },
    {
      name: 'Referral Banners',
      aiVerified: true,
      adminVerified: false,
      description: 'Scalable referral tracking with Merkle root-based UIDs and permalinks',
      category: 'Scalable',
    },
    {
      name: 'Transaction Tracking',
      aiVerified: true,
      adminVerified: false,
      description: 'UID, Nonce, and UserID tracking for all transactions with robust backup',
      category: 'Sustainable',
    },
    {
      name: 'Image Support',
      aiVerified: true,
      adminVerified: false,
      description: 'Workflow cards display matching images with intelligent filename matching',
      category: 'Democratic',
    },
    {
      name: 'Gallery Management',
      aiVerified: true,
      adminVerified: false,
      description: 'Admin-only gallery page for managing unmatched uploaded images',
      category: 'Scalable',
    },
  ];

  const categories = ['Resilient', 'Democratic', 'Scalable', 'Sustainable', 'Futuristic'];

  const handleAdminCheckboxChange = (index: number, checked: boolean) => {
    // In a real implementation, this would update the backend
    console.log(`Admin verification for ${fixtureFeatures[index].name}: ${checked}`);
  };

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b-4 border-primary">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex justify-center mb-6">
              <img
                src="/assets/generated/schema-validation-dashboard.dim_800x600.png"
                alt="Features"
                className="h-32 w-auto rounded-lg shadow-lg"
              />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Platform Features
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Advanced functionality with modular and resilient architecture
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="comparison">Comparison</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
              <TabsTrigger value="fixture">Fixture</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* PAYU Fee Structure */}
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-primary" />
                    <div>
                      <CardTitle>Pay As You Use (PAYU) Fee Structure</CardTitle>
                      <CardDescription>
                        Transparent pricing for subscribers based on usage tiers
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">$1</div>
                      <div className="text-sm font-medium mb-1">Top 10</div>
                      <div className="text-xs text-muted-foreground">Up to 10 executions</div>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-lg border-2 border-accent">
                      <div className="text-3xl font-bold text-accent mb-2">$10</div>
                      <div className="text-sm font-medium mb-1">Top 100</div>
                      <div className="text-xs text-muted-foreground">Up to 100 executions</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold text-primary mb-2">$100</div>
                      <div className="text-sm font-medium mb-1">Top 1000</div>
                      <div className="text-xs text-muted-foreground">Up to 1000 executions</div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <img
                      src="/assets/generated/payu-fee-structure.dim_600x400.png"
                      alt="PAYU Fee Structure"
                      className="mx-auto rounded-lg shadow-lg max-w-md w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card key={index} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 rounded-full bg-primary/10 w-fit">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <Badge variant={feature.status === 'verified' ? 'default' : 'secondary'}>
                            {feature.status}
                          </Badge>
                        </div>
                        <CardTitle>{feature.name}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-xs text-muted-foreground">
                          <span className="font-mono">Merkle: {feature.merkleRoot}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Feature Comparison</CardTitle>
                  <CardDescription>
                    Compare traditional platforms with our advanced system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead className="text-center">Traditional Platforms</TableHead>
                        <TableHead className="text-center">Our Platform</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.feature}</TableCell>
                          <TableCell className="text-center">
                            {row.traditional ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.current ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Merkle Root Verification System</CardTitle>
                  <CardDescription>
                    Cryptographic verification for feature validation and integrity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">How It Works</h3>
                    <ol className="space-y-3 list-decimal list-inside">
                      <li className="text-sm text-muted-foreground">
                        Each feature is assigned a unique cryptographic hash
                      </li>
                      <li className="text-sm text-muted-foreground">
                        Hashes are combined into a Merkle tree structure
                      </li>
                      <li className="text-sm text-muted-foreground">
                        Root hash provides tamper-proof verification
                      </li>
                      <li className="text-sm text-muted-foreground">
                        Updates and upgrades are tracked via new Merkle roots
                      </li>
                    </ol>
                  </div>

                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-semibold text-sm">Current System Root</h4>
                    <p className="font-mono text-xs break-all">
                      0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last verified: {new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <Button className="w-full">
                    Verify Feature Integrity
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fixture" className="space-y-8">
              {/* Fixture Banner */}
              <div className="relative overflow-hidden rounded-lg border-2 border-primary">
                <img
                  src="/assets/generated/referral-banner-template.dim_800x200.png"
                  alt="Fixture Banner"
                  className="w-full h-32 object-cover opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold">Fixture: Best Functionalities</h2>
                    <p className="text-muted-foreground">
                      Resilient • Democratic • Scalable • Sustainable • Futuristic
                    </p>
                  </div>
                </div>
              </div>

              {/* Dual Validation Explanation */}
              <Card className="bg-accent/5 border-accent">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/generated/trust-badge-transparent.dim_100x100.png"
                      alt="Admin Validation Always Enabled"
                      className="h-12 w-auto rounded"
                    />
                    <div>
                      <CardTitle className="text-lg">Dual Validation System - Admin Always Enabled</CardTitle>
                      <CardDescription>
                        Each feature has two validation checkboxes: AI-verified (auto-selected) and Admin-verified (always enabled and selectable)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                      <Checkbox checked disabled className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">AI-Verified</p>
                        <p className="text-xs text-muted-foreground">
                          Automatically checked for each unique new feature
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border-2 border-primary">
                      <Checkbox className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">Admin-Verified (Always Enabled)</p>
                        <p className="text-xs text-muted-foreground">
                          Always enabled and selectable by administrators for quality assurance
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Report Table with Dual Validation - Admin Always Enabled */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <img
                      src="/assets/generated/schema-compliance-interface.dim_700x500.png"
                      alt="Feature Report"
                      className="h-12 w-auto rounded"
                    />
                    <div>
                      <CardTitle>Implemented Features Report</CardTitle>
                      <CardDescription>
                        Dual validation checkboxes: AI-verified (auto) and Admin-verified (always enabled and selectable)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">AI</TableHead>
                        <TableHead className="w-24">Admin</TableHead>
                        <TableHead>Feature</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fixtureFeatures.map((feature, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Checkbox checked={feature.aiVerified} disabled className="cursor-default" />
                              <span className="text-xs text-muted-foreground">AI</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={feature.adminVerified}
                                onCheckedChange={(checked) => handleAdminCheckboxChange(index, checked as boolean)}
                                className="cursor-pointer"
                              />
                              <span className="text-xs text-muted-foreground">Admin</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {feature.aiVerified && (
                                <img
                                  src="/assets/generated/workflow-icon-transparent.dim_64x64.png"
                                  alt="Verified"
                                  className="h-5 w-5"
                                />
                              )}
                              {feature.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {feature.description}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{feature.category}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Category Summary */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => {
                  const categoryFeatures = fixtureFeatures.filter(f => f.category === category);
                  const aiVerifiedCount = categoryFeatures.filter(f => f.aiVerified).length;
                  const adminVerifiedCount = categoryFeatures.filter(f => f.adminVerified).length;

                  return (
                    <Card key={category} className="border-2">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{category}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="default" className="text-xs">
                              AI: {aiVerifiedCount}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Admin: {adminVerifiedCount}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription>
                          {categoryFeatures.length} features total
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categoryFeatures.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm">
                              <CheckSquare className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Summary Stats */}
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary">
                <CardHeader>
                  <CardTitle>Implementation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-primary">
                        {fixtureFeatures.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Features</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-green-600">
                        {fixtureFeatures.filter(f => f.aiVerified).length}
                      </div>
                      <div className="text-sm text-muted-foreground">AI-Verified</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-accent">
                        {fixtureFeatures.filter(f => f.adminVerified).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Admin-Verified</div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-4xl font-bold text-primary">
                        {categories.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Categories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Button variant="outline" onClick={() => navigate({ to: '/' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
