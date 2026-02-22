import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Layers, Code, Zap, Shield, Workflow, Box, Sparkles, Palette, Database, Lock, GitBranch } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Cpu,
      title: 'WebGL/OpenGL Rendering',
      description: 'GPU-accelerated 3D visualization with real-time data flow and enhanced shader effects for smooth, high-performance rendering.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Layers,
      title: 'Modular Block System',
      description: '50+ blockchain function blocks including input, logic, conversion, cryptographic, and Ethereum ecosystem tools with unlimited extensibility.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Code,
      title: 'Visual Programming',
      description: 'Intuitive drag-and-drop interface for creating complex Ethereum workflows without writing code.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Zap,
      title: 'Real-Time Execution',
      description: 'Live cryptographic operations with visual feedback, animated execution traces, and step-by-step debugging.',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Shield,
      title: 'Secure Authentication',
      description: 'Internet Identity integration for privacy-preserving, secure workspace management with cryptographic security.',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: Workflow,
      title: 'CAD-Style Interface',
      description: 'Professional 3D viewer with multiple viewports, camera controls, isometric/front/side/top views, and workspace management.',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      icon: Box,
      title: 'Custom Block Builder',
      description: 'Create your own blockchain function blocks with custom inputs, outputs, and logic for unlimited extensibility.',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Sparkles,
      title: 'Enhanced Visual Effects',
      description: 'GPU shader-based visual effects for hashing processes, data flow visualization, and cryptographic transformations.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Palette,
      title: 'VIBGYOR Theme System',
      description: 'Three theme modes (light, dark, rainbow) with persistent preferences and beautiful gradient color schemes.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Database,
      title: 'Workspace Management',
      description: 'Save, load, import, and export workspaces with version tracking, metadata, and conflict resolution.',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Lock,
      title: 'Cryptographic Tools',
      description: 'Complete suite of cryptographic blocks including hashing, key generation, signing, verification, and encryption.',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: GitBranch,
      title: 'Advanced Undo/Redo',
      description: 'Deep history stack with 200 states, intelligent diff-tracking, and persistent session restoration.',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Powerful Features
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to build, visualize, and understand Ethereum blockchain concepts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`p-3 rounded-lg ${feature.bgColor} w-fit mb-3`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Block Categories</CardTitle>
              <CardDescription>
                Comprehensive library of blockchain function blocks organized by category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Input Blocks</h3>
                <p className="text-sm text-muted-foreground">
                  Text input, number input, address input, private key input with real-time 3D visual feedback
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Logic Blocks</h3>
                <p className="text-sm text-muted-foreground">
                  If/else conditions, loops, mathematical operations, comparisons with GPU-rendered visual states
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Conversion Tools</h3>
                <p className="text-sm text-muted-foreground">
                  toHex, toHash, toBinary, toDecimal, toAscii, toBase64 with visual transformation effects
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Cryptographic Blocks</h3>
                <p className="text-sm text-muted-foreground">
                  Hash, Keypair, Sign, Verify, Encryption, Elliptic Curve, ZKP Visualization
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Ethereum Ecosystem Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Smart Contract Deployer, ABI Encoder/Decoder, Event Listener, Gas Fee Estimator, and more
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Blockchain Blocks</h3>
                <p className="text-sm text-muted-foreground">
                  Wallet connection, balance checker, transaction sender, smart contract caller, block explorer
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Display Blocks</h3>
                <p className="text-sm text-muted-foreground">
                  Text display, number display, transaction hash display, balance display with enhanced 3D rendering
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
