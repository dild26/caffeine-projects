import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Clock, Calendar, TrendingUp, Database } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TimestampPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Clock className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Timestamp & Time Tracking</h1>
        <p className="text-xl text-muted-foreground">
          Understanding how time is tracked and managed across the platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Time</CardTitle>
            <CardDescription>
              Real-time clock display
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-5xl font-bold mb-2">{currentTime.toLocaleTimeString()}</div>
              <div className="text-xl text-muted-foreground">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Timestamp System
            </CardTitle>
            <CardDescription>
              How timestamps are used throughout the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The E-Tutorial platform uses timestamps extensively to track events, synchronization, and user activities. 
              All timestamps are stored in nanoseconds since the Unix epoch for precision and consistency.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Appointment Scheduling</h4>
                <p className="text-sm text-muted-foreground">
                  Timestamps ensure accurate booking times across different time zones.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Progress Tracking</h4>
                <p className="text-sm text-muted-foreground">
                  Track when learners complete topics and achieve milestones.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Sync Operations</h4>
                <p className="text-sm text-muted-foreground">
                  Record when external content was last synchronized.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Audit Logs</h4>
                <p className="text-sm text-muted-foreground">
                  Maintain detailed logs of system events with precise timestamps.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Time-Based Features
            </CardTitle>
            <CardDescription>
              Platform features that rely on time tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Appointment Booking:</strong> Schedule learning sessions with instructors at specific times.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Availability Windows:</strong> Instructors define their available time slots for bookings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Progress Timestamps:</strong> Track when learners complete topics and resources.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Sync Verification:</strong> Monitor when contact data was last verified against external sources.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Session Management:</strong> Track user login times and session duration.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Time-Based Analytics
            </CardTitle>
            <CardDescription>
              Insights derived from temporal data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Timestamp data enables powerful analytics and insights about learning patterns and platform usage:
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Learning Pace Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze how quickly learners progress through topics by comparing timestamps of completed milestones.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Peak Usage Times</h4>
                <p className="text-sm text-muted-foreground">
                  Identify when the platform is most active to optimize instructor availability and resource allocation.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Retention Metrics</h4>
                <p className="text-sm text-muted-foreground">
                  Track user engagement over time to understand retention patterns and improve the platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Zone Handling</CardTitle>
            <CardDescription>
              Supporting users across the globe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              The platform handles time zones intelligently to ensure accurate scheduling and display:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>All timestamps stored in UTC for consistency</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Automatic conversion to user's local time zone for display</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Instructor availability specified in their local time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>Appointment times shown in both instructor and learner time zones</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
