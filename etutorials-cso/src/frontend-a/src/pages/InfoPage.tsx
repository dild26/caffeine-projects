import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Info, BookOpen, Users, Calendar, TrendingUp } from 'lucide-react';

export default function InfoPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Info className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Platform Information</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive information about our educational tutorial platform and its capabilities.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Educational Resources
            </CardTitle>
            <CardDescription>
              Access a vast library of educational materials organized by category and topic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our platform hosts thousands of educational resources spanning multiple categories including hardware, software, 
              programming, design, and more. Each resource is carefully curated and verified by our admin team to ensure quality.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Categorized resource library with advanced filtering</li>
              <li>Automatic fee conversion from Rs to USD</li>
              <li>Hashtag-based search and discovery</li>
              <li>Topic mapping and resource relationships</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Instructor Network
            </CardTitle>
            <CardDescription>
              Connect with experienced instructors across various domains
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our instructor network consists of qualified professionals with expertise in diverse educational topics. 
              Each instructor maintains availability schedules and specialization areas to help learners find the perfect match.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Verified instructor profiles with specializations</li>
              <li>Real-time availability tracking</li>
              <li>Hashtag-based instructor discovery</li>
              <li>Topic expertise mapping</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Appointment System
            </CardTitle>
            <CardDescription>
              Smart booking system with optimization algorithms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Book appointments with instructors using our intelligent scheduling system. The platform uses Merkle root nonce 
              mechanism for booking optimization and ensures efficient time slot allocation.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Optimized scheduling with conflict detection</li>
              <li>Real-time availability updates</li>
              <li>Appointment status tracking</li>
              <li>Integration with learner progress</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Progress Tracking
            </CardTitle>
            <CardDescription>
              Monitor and analyze learner progress across multiple dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Track learner progress by topic, pace, language preference, and difficulty level. Our comprehensive tracking 
              system provides insights into learning patterns and helps optimize educational outcomes.
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li>Multi-dimensional progress tracking</li>
              <li>Topic-based progress visualization</li>
              <li>Pace and difficulty level monitoring</li>
              <li>Language preference support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
