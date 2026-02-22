import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cpu, Lock, Zap, Shield, Code, Layers, Workflow } from 'lucide-react';

export default function LoginScreen() {
  const { login, isAuthenticated } = useInternetIdentity();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setIsLoggingIn(true);
    try {
      await login();
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center relative overflow-hidden">
      {/* Hero Background Image */}
      <img src="/hero-bg.png" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="" />

      {/* Background Background Glow */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary/20 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="w-full max-w-7xl grid md:grid-cols-2 gap-0 items-stretch min-h-[600px] glass rounded-[3rem] overflow-hidden m-4 shadow-2xl border-white/5">
        {/* Left side - Branding and Features */}
        <div className="p-10 md:p-16 flex flex-col justify-center space-y-10 bg-gradient-to-br from-primary/10 to-transparent border-r border-white/5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest">
              Ethereum Visual Sandbox
            </div>
            <h2 className="text-4xl md:text-6xl font-black eth-title leading-tight">
              Build the Future <br /> of Web3 Visually.
            </h2>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Drag. Drop. Execute. The world's most advanced visual environment for Ethereum smart contracts and cryptographic workflows.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Cpu className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">WebGL/OpenGL Rendering</h3>
                <p className="text-sm text-muted-foreground">
                  Pro-grade 3D visualization with real-time data flow and shader-enhanced logic.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-secondary/10 border border-secondary/20">
                <Layers className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Modular Block System</h3>
                <p className="text-sm text-muted-foreground">
                  Access 50+ pre-built blocks or build your own with our custom SDK.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                <Workflow className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Visual Programming</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive drag-and-drop environment for blockchain workflow design.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-success/10 border border-success/20">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Real-Time Execution</h3>
                <p className="text-sm text-muted-foreground">
                  Live cryptographic operations and smart contract simulations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Card */}
        <div className="p-10 md:p-16 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          </div>

          <div className="w-full max-w-md space-y-8 relative z-10">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/30 shadow-lg shadow-primary/20">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold">Welcome Back</h3>
              <p className="text-muted-foreground">
                Authenticate with your Internet Identity to begin.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 text-destructive-foreground">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Verifying Identity...
                </>
              ) : (
                <>
                  <img src="https://cryptologos.cc/logos/internet-computer-icp-logo.png" className="w-6 h-6 mr-3 invert" alt="ICP" />
                  Internet Identity Login
                </>
              )}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-background text-muted-foreground">Developer Options</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={async () => {
                setIsLoggingIn(true);
                await login(); // useInternetIdentity mock login
                setIsLoggingIn(false);
              }}
              className="w-full border-white/10 hover:bg-white/5"
            >
              Enter as Guest (Dev Mode)
            </Button>

            <div className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Shield className="w-4 h-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Privacy-First Auth:</strong> your personal data is never shared.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-xs text-muted-foreground">
                  <strong>Persistent Session:</strong> your workspaces are always synced.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
