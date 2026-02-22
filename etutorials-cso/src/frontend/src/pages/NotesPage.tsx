import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { FileText, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export default function NotesPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <FileText className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Important Notes</h1>
        <p className="text-xl text-muted-foreground">
          Key information and guidelines for using the E-Tutorial platform effectively.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please read these notes carefully to ensure optimal use of the platform and avoid common issues.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Getting Started
            </CardTitle>
            <CardDescription>
              Essential steps for new users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Complete Your Profile</p>
                  <p className="text-sm text-muted-foreground">
                    After logging in with Internet Identity, set up your profile with your name and email for personalized experience.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Explore Resources</p>
                  <p className="text-sm text-muted-foreground">
                    Browse the resource catalog to find educational materials that match your learning goals.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Connect with Instructors</p>
                  <p className="text-sm text-muted-foreground">
                    Find instructors specializing in your areas of interest and check their availability.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">4</span>
                </div>
                <div>
                  <p className="font-medium text-sm">Book Appointments</p>
                  <p className="text-sm text-muted-foreground">
                    Schedule learning sessions with instructors at times that work for you.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Important Reminders
            </CardTitle>
            <CardDescription>
              Key points to remember while using the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Authentication Required:</strong> All platform features require Internet Identity authentication for security and personalization.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Resource Verification:</strong> Only admin-verified resources are visible to regular users. Admins can see all resources including pending verification.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Data Privacy:</strong> Your learner progress and appointment data are private and only visible to you and platform administrators.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Fee Conversion:</strong> All fees are automatically converted from Rs to USD using a fixed rate (Rs / 90 = USD) for consistency.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Hashtag Search:</strong> Use hashtags (e.g., #programming, #beginner) to quickly find relevant resources and instructors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>External Sync:</strong> The contact page syncs with external sources. Check sync status for data freshness.</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Data Management</CardTitle>
            <CardDescription>
              Guidelines for uploading and managing CSV files
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The platform supports CSV file uploads for bulk data management. Ensure your CSV files follow the correct format:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
              <li><strong>resources.csv:</strong> Include columns for id, title, category, feeRs, hashtags, and topics</li>
              <li><strong>instructors.csv:</strong> Include columns for id, name, availability, topics, and hashtags</li>
              <li><strong>learners.csv:</strong> Include columns for id, name, progress, and preferences</li>
              <li><strong>appointments.csv:</strong> Include columns for id, learnerId, instructorId, resourceId, timeSlot, and status</li>
            </ul>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                CSV uploads require admin privileges. Contact an administrator if you need to upload bulk data.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best Practices</CardTitle>
            <CardDescription>
              Tips for optimal platform usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Keep your profile information up to date for better communication</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use specific hashtags when searching to get more relevant results</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Check instructor availability before booking appointments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Regularly review your progress dashboard to track learning goals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Explore different resource categories to discover new learning opportunities</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
