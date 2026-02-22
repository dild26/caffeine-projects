import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Zap, Database } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-12">
          <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[550px]">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                  Welcome Back
                </h2>
                <p className="text-lg text-muted-foreground">
                  Enterprise Cloud Storage on Internet Computer
                </p>
              </div>
            </div>

            <Card className="border-border/50 shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Sign In</CardTitle>
                <CardDescription className="text-center">
                  Sign in with Internet Identity to access your storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={login}
                  disabled={isLoggingIn}
                  className="w-full h-12 text-base bg-gradient-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90"
                >
                  {isLoggingIn ? 'Connecting...' : 'Sign In with Internet Identity'}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <Shield className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Secure</h3>
                  <p className="text-xs text-muted-foreground">End-to-end encryption</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <Zap className="mx-auto h-8 w-8 text-cyan-500 mb-2" />
                  <h3 className="font-semibold mb-1">Fast</h3>
                  <p className="text-xs text-muted-foreground">Lightning-quick access</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6 text-center">
                  <Database className="mx-auto h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Scalable</h3>
                  <p className="text-xs text-muted-foreground">Unlimited storage</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
