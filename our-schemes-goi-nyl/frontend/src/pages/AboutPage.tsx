import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, SearchIcon, BookmarkIcon, ExternalLinkIcon } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold">About ourSchemes</h1>

        <Alert className="mb-6 border-warning/30 bg-warning/5">
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> ourSchemes is NOT an official government application. 
            We are an independent platform that helps citizens discover government schemes. 
            All scheme information and links direct to official government portals.
          </AlertDescription>
        </Alert>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
              <CardDescription>Making government schemes accessible to everyone</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                ourSchemes is designed to help Indian citizens easily discover and access government schemes 
                that they may be eligible for. We aggregate information from official government sources 
                and present it in a searchable, user-friendly format.
              </p>
              <p>
                Our goal is to bridge the information gap and ensure that citizens can find the support 
                and benefits they are entitled to from various government programs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <SearchIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Search & Filter</h3>
                    <p className="text-sm text-muted-foreground">
                      Use our search bar and filters to find schemes by keywords, ministry, category, or tags.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BookmarkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Pin Your Favorites</h3>
                    <p className="text-sm text-muted-foreground">
                      Save schemes to your personal list for easy access later. Your list is stored locally on your device.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <ExternalLinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Official Sites</h3>
                    <p className="text-sm text-muted-foreground">
                      Click through to official government portals to learn more and apply for schemes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p>
                All scheme information is sourced from official government websites and portals, including:
              </p>
              <ul>
                <li>myscheme.gov.in - National Portal for Government Schemes</li>
                <li>Various ministry and department websites</li>
                <li>State government portals</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We do not create, modify, or host any government scheme data. We simply provide a search 
                interface to help you discover relevant schemes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none dark:prose-invert">
              <p className="font-medium">
                ourSchemes is an independent, non-governmental platform. We are not affiliated with, 
                endorsed by, or connected to any government entity or official portal.
              </p>
              <p>
                While we strive to provide accurate and up-to-date information, we recommend that you:
              </p>
              <ul>
                <li>Always verify scheme details on official government websites</li>
                <li>Check eligibility criteria directly with the relevant ministry or department</li>
                <li>Apply for schemes only through official government portals</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                We are not responsible for the accuracy, completeness, or timeliness of the information 
                displayed. All scheme applications and inquiries should be directed to the official 
                government channels.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
