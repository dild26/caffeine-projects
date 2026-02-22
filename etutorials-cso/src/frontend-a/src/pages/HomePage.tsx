import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Upload, Search, Calendar, TrendingUp, Shield, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 py-12">
      {/* Hero Section */}
      <section className="container">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Educational Resource Management Made Simple
            </h1>
            <p className="text-xl text-muted-foreground">
              Upload CSV files, manage resources and instructors, search with hashtags, and book appointments seamlessly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/explore">Explore Resources</Link>
              </Button>
            </div>
          </div>
          <div>
            <img
              src="/assets/generated/hero-banner.dim_1200x400.png"
              alt="E-Tutorial Platform"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Platform Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage educational resources, instructors, and learner progress in one place.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>CSV Data Management</CardTitle>
              <CardDescription>
                Upload and parse CSV files for resources, instructors, learners, and appointments with automatic fee conversion.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Hashtag Search</CardTitle>
              <CardDescription>
                Powerful search functionality with hashtag support to find resources and instructors quickly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Booking</CardTitle>
              <CardDescription>
                Book appointments with instructors using optimized scheduling with Merkle root nonce mechanism.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor learner progress by topic, pace, language, and difficulty level with detailed analytics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Verification</CardTitle>
              <CardDescription>
                Resource approval workflow with admin verification to ensure quality educational content.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Real-time Sync</CardTitle>
              <CardDescription>
                Automatic synchronization between learners, instructors, and schedules with external content integration.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join our platform today and experience seamless educational resource management with powerful features.
            </p>
            <Button asChild size="lg">
              <Link to="/dashboard">Access Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
