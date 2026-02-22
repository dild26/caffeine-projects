import { useGetCallerUserProfile, useIsCallerAdmin, useGetResources, useGetInstructors, useGetAppointments } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from '@tanstack/react-router';
import { BookOpen, Users, Calendar, Shield, TrendingUp, Upload } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: resources = [], isLoading: resourcesLoading } = useGetResources();
  const { data: instructors = [], isLoading: instructorsLoading } = useGetInstructors();
  const { data: appointments = [], isLoading: appointmentsLoading } = useGetAppointments();

  const verifiedResources = resources.filter((r) => r.verified);
  const pendingResources = resources.filter((r) => !r.verified);

  return (
    <div className="container py-8 space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {profileLoading ? <Skeleton className="inline-block h-8 w-32" /> : profile?.name}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your E-Tutorial platform activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {resourcesLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <>
                <div className="text-2xl font-bold">{verifiedResources.length}</div>
                <p className="text-xs text-muted-foreground">
                  {isAdmin && pendingResources.length > 0 && `${pendingResources.length} pending approval`}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instructors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {instructorsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{instructors.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{appointments.length}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Role</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {adminLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold capitalize">{isAdmin ? 'Admin' : 'User'}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <img src="/assets/generated/search-icon-transparent.dim_32x32.png" alt="Search" className="h-6 w-6" />
            </div>
            <CardTitle>Explore Resources</CardTitle>
            <CardDescription>
              Browse and search educational resources with hashtag filtering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/explore">Start Exploring</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
              <img src="/assets/generated/appointment-icon-transparent.dim_48x48.png" alt="Appointments" className="h-8 w-8" />
            </div>
            <CardTitle>Book Appointment</CardTitle>
            <CardDescription>
              Schedule sessions with instructors and manage your bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/appointments">View Appointments</Link>
            </Button>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <img src="/assets/generated/admin-icon-transparent.dim_48x48.png" alt="Admin" className="h-8 w-8" />
              </div>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>
                Manage resources, instructors, and approve pending items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/admin">Open Admin Panel</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Your latest scheduled sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No appointments yet. Book your first session!</p>
          ) : (
            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">Appointment #{appointment.id}</p>
                    <p className="text-sm text-muted-foreground">{appointment.timeSlot}</p>
                  </div>
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      appointment.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
