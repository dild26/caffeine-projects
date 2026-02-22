import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Database, Box, Users, Calendar, FileText } from 'lucide-react';
import { Badge } from '../components/ui/badge';

export default function ObjectsPage() {
  const dataObjects = [
    {
      name: 'Resource',
      icon: FileText,
      description: 'Educational materials and content',
      fields: [
        { name: 'id', type: 'Text', description: 'Unique identifier' },
        { name: 'title', type: 'Text', description: 'Resource title' },
        { name: 'category', type: 'Text', description: 'Category classification' },
        { name: 'feeRs', type: 'Float', description: 'Fee in Rupees' },
        { name: 'feeUsd', type: 'Float', description: 'Fee in USD (auto-converted)' },
        { name: 'verified', type: 'Bool', description: 'Admin verification status' },
        { name: 'hashtags', type: '[Text]', description: 'Search hashtags' },
        { name: 'topics', type: '[Text]', description: 'Covered topics' },
      ],
    },
    {
      name: 'Instructor',
      icon: Users,
      description: 'Teaching professionals and experts',
      fields: [
        { name: 'id', type: 'Text', description: 'Unique identifier' },
        { name: 'name', type: 'Text', description: 'Instructor name' },
        { name: 'availability', type: '[Text]', description: 'Available time slots' },
        { name: 'topics', type: '[Text]', description: 'Teaching specializations' },
        { name: 'hashtags', type: '[Text]', description: 'Search hashtags' },
      ],
    },
    {
      name: 'Learner',
      icon: Users,
      description: 'Platform users and students',
      fields: [
        { name: 'id', type: 'Text', description: 'Unique identifier' },
        { name: 'name', type: 'Text', description: 'Learner name' },
        { name: 'progress', type: '[Text]', description: 'Learning progress data' },
        { name: 'preferences', type: '[Text]', description: 'Learning preferences' },
        { name: 'owner', type: 'Principal', description: 'User principal ID' },
      ],
    },
    {
      name: 'Appointment',
      icon: Calendar,
      description: 'Scheduled learning sessions',
      fields: [
        { name: 'id', type: 'Text', description: 'Unique identifier' },
        { name: 'learnerId', type: 'Text', description: 'Associated learner' },
        { name: 'instructorId', type: 'Text', description: 'Associated instructor' },
        { name: 'resourceId', type: 'Text', description: 'Associated resource' },
        { name: 'timeSlot', type: 'Text', description: 'Scheduled time' },
        { name: 'status', type: 'Text', description: 'Appointment status' },
        { name: 'owner', type: 'Principal', description: 'User principal ID' },
      ],
    },
    {
      name: 'UserProfile',
      icon: Users,
      description: 'User account information',
      fields: [
        { name: 'name', type: 'Text', description: 'User display name' },
        { name: 'email', type: 'Text', description: 'Contact email' },
        { name: 'role', type: 'UserRole', description: 'Access level (admin/user/guest)' },
      ],
    },
    {
      name: 'ContactDetails',
      icon: FileText,
      description: 'Contact information with sync tracking',
      fields: [
        { name: 'name', type: 'Text', description: 'Contact name' },
        { name: 'email', type: 'Text', description: 'Contact email' },
        { name: 'phone', type: 'Text', description: 'Phone number' },
        { name: 'address', type: 'Text', description: 'Physical address' },
        { name: 'lastVerified', type: 'Time', description: 'Last verification timestamp' },
        { name: 'source', type: 'Text', description: 'Data source' },
      ],
    },
  ];

  return (
    <div className="container py-12 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Database className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">Data Objects</h1>
        <p className="text-xl text-muted-foreground">
          Understanding the data structures and objects used throughout the platform.
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="h-5 w-5 text-primary" />
              Platform Data Model
            </CardTitle>
            <CardDescription>
              Core data structures that power the E-Tutorial platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              The platform uses a structured data model built on the Internet Computer blockchain. All data objects 
              are stored securely in the backend canister with proper access control and validation.
            </p>
          </CardContent>
        </Card>

        {dataObjects.map((obj) => {
          const Icon = obj.icon;
          return (
            <Card key={obj.name}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{obj.name}</CardTitle>
                      <CardDescription>{obj.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">Object</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {obj.fields.map((field) => (
                    <div key={field.name} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono font-semibold">{field.name}</code>
                          <Badge variant="secondary" className="text-xs">{field.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card>
          <CardHeader>
            <CardTitle>Data Relationships</CardTitle>
            <CardDescription>
              How different objects connect and interact
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The platform's data objects are interconnected to provide a comprehensive learning management system:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Appointments</strong> link Learners with Instructors and Resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Resources</strong> are categorized and tagged with hashtags for discovery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Instructors</strong> specify topics and availability for matching with learners</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>Learners</strong> track progress and preferences across multiple resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span><strong>UserProfiles</strong> are linked to Principal IDs for authentication</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Access Control</CardTitle>
            <CardDescription>
              Security and privacy considerations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All data objects implement role-based access control to ensure privacy and security:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">User Access</h4>
                <p className="text-sm text-muted-foreground">
                  Users can view their own data and verified public resources. Personal data is private by default.
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Admin Access</h4>
                <p className="text-sm text-muted-foreground">
                  Administrators have full access to manage resources, verify content, and view system-wide data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
