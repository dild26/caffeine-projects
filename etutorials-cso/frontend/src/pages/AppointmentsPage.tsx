import { useState } from 'react';
import { useGetAppointments, useBookAppointment, useGetInstructors, useGetResources } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Calendar, Clock, Plus, Users, BookOpen } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { Toaster } from '../components/ui/sonner';

export default function AppointmentsPage() {
  const { identity } = useInternetIdentity();
  const { data: appointments = [], isLoading } = useGetAppointments();
  const { data: instructors = [] } = useGetInstructors();
  const { data: resources = [] } = useGetResources();
  const bookAppointment = useBookAppointment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    learnerId: '',
    instructorId: '',
    resourceId: '',
    timeSlot: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!identity) {
      toast.error('You must be logged in to book appointments');
      return;
    }

    try {
      await bookAppointment.mutateAsync({
        id: `apt-${Date.now()}`,
        learnerId: formData.learnerId,
        instructorId: formData.instructorId,
        resourceId: formData.resourceId,
        timeSlot: formData.timeSlot,
        status: 'pending',
        owner: identity.getPrincipal(),
      });
      
      toast.success('Appointment booked successfully!');
      setDialogOpen(false);
      setFormData({ learnerId: '', instructorId: '', resourceId: '', timeSlot: '' });
    } catch (error) {
      toast.error('Failed to book appointment');
      console.error(error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="container py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Appointments</h1>
            <p className="text-muted-foreground">
              Manage your scheduled sessions with instructors.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a session with an instructor for a specific resource.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="learnerId">Learner ID</Label>
                  <Input
                    id="learnerId"
                    value={formData.learnerId}
                    onChange={(e) => setFormData({ ...formData, learnerId: e.target.value })}
                    placeholder="Enter learner ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructorId">Instructor</Label>
                  <Select
                    value={formData.instructorId}
                    onValueChange={(value) => setFormData({ ...formData, instructorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      {instructors.map((instructor) => (
                        <SelectItem key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resourceId">Resource</Label>
                  <Select
                    value={formData.resourceId}
                    onValueChange={(value) => setFormData({ ...formData, resourceId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select resource" />
                    </SelectTrigger>
                    <SelectContent>
                      {resources.filter(r => r.verified).map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeSlot">Time Slot</Label>
                  <Input
                    id="timeSlot"
                    type="datetime-local"
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={bookAppointment.isPending}>
                  {bookAppointment.isPending ? 'Booking...' : 'Book Appointment'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <img src="/assets/generated/appointment-icon-transparent.dim_48x48.png" alt="No appointments" className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">No appointments yet. Book your first session!</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">Appointment #{appointment.id.slice(-8)}</CardTitle>
                    <Badge variant={
                      appointment.status === 'confirmed' ? 'default' :
                      appointment.status === 'pending' ? 'secondary' :
                      'outline'
                    }>
                      {appointment.status}
                    </Badge>
                  </div>
                  <CardDescription>Learner: {appointment.learnerId}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Instructor:</span>
                    <span className="font-medium">{appointment.instructorId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Resource:</span>
                    <span className="font-medium">{appointment.resourceId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{appointment.timeSlot}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
