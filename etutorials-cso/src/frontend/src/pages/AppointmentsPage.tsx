import { useState, useMemo } from 'react';
import { useGetAppointments, useBookAppointment, useGetInstructors, useGetResources } from '@/hooks/useQueries';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, Plus, Users, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  parseISO,
  isToday
} from 'date-fns';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
  const { identity } = useInternetIdentity();
  const { data: appointments = [], isLoading } = useGetAppointments();
  const { data: instructors = [] } = useGetInstructors();
  const { data: resources = [] } = useGetResources();
  const bookAppointment = useBookAppointment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [formData, setFormData] = useState({
    learnerId: '',
    instructorId: '',
    resourceId: '',
    timeSlot: '', // HH:mm
  });

  // Calendar Logic
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const onDateClick = (day: Date) => setSelectedDate(day);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  // Filter appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    if (!selectedDate) return [];
    return appointments.filter(apt => {
      try {
        const aptDate = parseISO(apt.timeSlot); // assuming ISO string
        return isSameDay(aptDate, selectedDate);
      } catch {
        return false;
      }
    });
  }, [appointments, selectedDate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('You must be logged in to book appointments');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }

    // Combine date and time
    const [hours, minutes] = formData.timeSlot.split(':');
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));


    try {
      await bookAppointment.mutateAsync({
        id: `apt-${Date.now()}`,
        learnerId: formData.learnerId,
        instructorId: formData.instructorId,
        resourceId: formData.resourceId,
        timeSlot: appointmentDateTime.toISOString(),
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
    <div className="container py-8 space-y-8 min-h-screen">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-bold">Schedule & Bookings</h1>
          <p className="text-muted-foreground">Manage your educational journey.</p>
        </motion.div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="rounded-full shadow-lg hover:shadow-primary/25 transition-all">
              <Plus className="h-4 w-4 mr-2" /> Book Session
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-xl border-primary/20">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>
                Schedule a session for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'a specific date'}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Fields (Simplified for brevity, similar to original but styled) */}
              <div className="space-y-2">
                <Label>Instructor</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, instructorId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Instructor" /></SelectTrigger>
                  <SelectContent>
                    {instructors.map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Resource</Label>
                <Select onValueChange={(v) => setFormData({ ...formData, resourceId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Resource" /></SelectTrigger>
                  <SelectContent>
                    {resources.filter(r => r.verified).map(r => <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Learner ID</Label>
                  <Input placeholder="ID" value={formData.learnerId} onChange={e => setFormData({ ...formData, learnerId: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input type="time" value={formData.timeSlot} onChange={e => setFormData({ ...formData, timeSlot: e.target.value })} required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={bookAppointment.isPending}>
                {bookAppointment.isPending ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Interactive Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <CardTitle className="text-xl font-medium">
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 text-center mb-4 text-sm text-muted-foreground font-medium">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, dayIdx) => {
                  // Check for appointments
                  const hasApt = appointments.some(apt => {
                    try { return isSameDay(parseISO(apt.timeSlot), day); } catch { return false; }
                  });

                  return (
                    <motion.div
                      key={day.toString()}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => onDateClick(day)}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-xl cursor-pointer transition-colors relative overflow-hidden text-sm",
                        !isSameMonth(day, monthStart) && "text-muted-foreground/30",
                        isSameDay(day, selectedDate!) && "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20",
                        !isSameDay(day, selectedDate!) && hasApt && "bg-secondary/20 font-semibold border border-secondary/30",
                        !isSameDay(day, selectedDate!) && !hasApt && "hover:bg-muted/50",
                        isToday(day) && !isSameDay(day, selectedDate!) && "border border-primary text-primary"
                      )}
                    >
                      {format(day, 'd')}
                      {hasApt && (
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full mt-1",
                          isSameDay(day, selectedDate!) ? "bg-white" : "bg-primary"
                        )} />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Selected Date Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="h-full border-border/50 bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>{selectedDate ? format(selectedDate, 'EEEE, MMM do') : 'Select a date'}</CardTitle>
              <CardDescription>
                {selectedDateAppointments.length} sessions scheduled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : selectedDateAppointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>No slots booked for this day.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {selectedDateAppointments.map((apt) => (
                    <motion.div
                      key={apt.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-4 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                          {apt.status}
                        </Badge>
                        <span className="text-sm font-mono font-medium">
                          {format(parseISO(apt.timeSlot), 'HH:mm')}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-3 w-3 text-primary" />
                          <span>{apt.instructorId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span className="truncate">{apt.resourceId}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Booking
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}
