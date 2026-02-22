import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, Users, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About Ethereum Visual Sandbox
          </h1>
          <p className="text-xl text-muted-foreground">
            An educational platform for learning blockchain concepts through visual programming
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The Ethereum Visual Sandbox is designed to make blockchain technology accessible and understandable 
                through interactive visual programming. We believe that complex cryptographic and blockchain concepts 
                can be learned more effectively through hands-on experimentation and visual feedback.
              </p>
              <p>
                Our platform combines cutting-edge GPU-accelerated 3D visualization with an intuitive drag-and-drop 
                interface, allowing users to build, test, and understand Ethereum workflows without writing code.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Security First</CardTitle>
                <CardDescription>
                  Built on the Internet Computer with Internet Identity for secure, privacy-preserving authentication
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-secondary/10 w-fit mb-2">
                  <Zap className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle>High Performance</CardTitle>
                <CardDescription>
                  GPU-accelerated WebGL rendering for smooth, real-time visualization of complex blockchain operations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-accent/10 w-fit mb-2">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Educational Focus</CardTitle>
                <CardDescription>
                  Designed for learners, educators, and developers to explore Ethereum concepts interactively
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="p-2 rounded-lg bg-success/10 w-fit mb-2">
                  <Heart className="w-6 h-6 text-success" />
                </div>
                <CardTitle>Open & Extensible</CardTitle>
                <CardDescription>
                  Create custom blocks, share workflows, and extend the platform with your own blockchain tools
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Frontend</h3>
                <p className="text-sm text-muted-foreground">
                  React, TypeScript, Three.js (React Three Fiber), TailwindCSS, shadcn/ui components
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Backend</h3>
                <p className="text-sm text-muted-foreground">
                  Internet Computer (Motoko), Internet Identity for authentication
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Rendering</h3>
                <p className="text-sm text-muted-foreground">
                  WebGL/OpenGL with GPU-accelerated shaders for real-time 3D visualization
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cryptography</h3>
                <p className="text-sm text-muted-foreground">
                  Browser-native Web Crypto API for secure cryptographic operations
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <Heart className="w-12 h-12 mx-auto text-destructive fill-destructive" />
              <p className="text-lg">
                Built with love using{' '}
                <a 
                  href="https://caffeine.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-semibold"
                >
                  caffeine.ai
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                © 2025 Ethereum Visual Sandbox. All rights reserved.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
