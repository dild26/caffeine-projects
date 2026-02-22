import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface AccessDeniedScreenProps {
  message?: string;
}

export default function AccessDeniedScreen({ message = "Please log in to access this page" }: AccessDeniedScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">{message}</p>
              <Link to="/">
                <Button className="w-full">Back to Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
