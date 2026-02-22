import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Layers, Code, Zap, Shield, Workflow, Box, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden py-20 md:py-32">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-bg.png"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-transparent"></div>
        </div>

        <div className="container relative z-10 mx-auto px-4 eth-glow">
          <div className="max-w-4xl mx-auto text-center space-y-8 glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <h1 className="text-5xl md:text-8xl font-black eth-title animate-in fade-in slide-in-from-top-10 duration-1000">
              Ethereum Visual Sandbox
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
              Interactive drag-and-drop visual programming environment for Ethereum blockchain concepts with GPU-accelerated 3D visualization.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-in fade-in zoom-in duration-1000 delay-500">
              <Link to="/workspace">
                <Button size="lg" className="text-lg px-10 h-14 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1">
                  <Sparkles className="w-5 h-5 mr-3" />
                  Launch Workspace
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="text-lg px-10 h-14 rounded-full backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 transition-all hover:-translate-y-1">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>WebGL/OpenGL Rendering</CardTitle>
                <CardDescription>
                  GPU-accelerated 3D visualization with real-time data flow and enhanced shader effects
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-secondary/10 w-fit mb-2">
                  <Layers className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>Modular Block System</CardTitle>
                <CardDescription>
                  50+ blockchain function blocks with unlimited extensibility and custom block creation
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-accent/10 w-fit mb-2">
                  <Code className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Visual Programming</CardTitle>
                <CardDescription>
                  Intuitive drag-and-drop interface for creating complex Ethereum workflows
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-success/10 w-fit mb-2">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Real-Time Execution</CardTitle>
                <CardDescription>
                  Live cryptographic operations with visual feedback and animated execution traces
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-warning/10 w-fit mb-2">
                  <Shield className="w-6 h-6 text-warning" />
                </div>
                <CardTitle>Secure Authentication</CardTitle>
                <CardDescription>
                  Internet Identity integration for privacy-preserving, secure workspace management
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-destructive/10 w-fit mb-2">
                  <Workflow className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>CAD-Style Interface</CardTitle>
                <CardDescription>
                  Professional 3D viewer with multiple viewports, camera controls, and workspace management
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20">
            <CardContent className="p-12 text-center space-y-6">
              <Box className="w-16 h-16 mx-auto text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Build?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start creating visual blockchain workflows with our powerful drag-and-drop environment
              </p>
              <Link to="/workspace">
                <Button size="lg" className="text-lg px-8">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
