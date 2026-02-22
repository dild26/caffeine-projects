import { useGetCallerUserProfile, useIsCallerAdmin, useGetResources, useGetInstructors, useGetAppointments } from '@/hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import {
  BookOpen,
  Users,
  Calendar,
  Shield,
  Activity,
  ArrowUpRight,
  MoreHorizontal
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: resources = [], isLoading: resourcesLoading } = useGetResources();
  const { data: instructors = [], isLoading: instructorsLoading } = useGetInstructors();
  const { data: appointments = [], isLoading: appointmentsLoading } = useGetAppointments();

  const verifiedResources = resources.filter((r) => r.verified);
  const pendingResources = resources.filter((r) => !r.verified);

  // Data for Charts
  const categoryData = resources.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: curr.category, value: 1 });
    }
    return acc;
  }, []);



  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container py-8 space-y-8 min-h-screen">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-semibold text-primary">{profileLoading ? '...' : profile?.name || 'Guest'}</span>. Here's your daily overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Activity className="h-4 w-4" /> Activity Log
          </Button>
          {isAdmin && (
            <Button className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <Shield className="h-4 w-4" /> Admin Panel
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Stats Cards */}
        {[
          {
            title: "Total Resources",
            value: resourcesLoading ? "..." : verifiedResources.length,
            desc: `${pendingResources.length} pending approval`,
            icon: BookOpen,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
          },
          {
            title: "Instructors",
            value: instructorsLoading ? "..." : instructors.length,
            desc: "Active mentors",
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
          },
          {
            title: "Appointments",
            value: appointmentsLoading ? "..." : appointments.length,
            desc: "Scheduled sessions",
            icon: Calendar,
            color: "text-pink-500",
            bg: "bg-pink-500/10"
          },
          {
            title: "Account Status",
            value: adminLoading ? "..." : (isAdmin ? 'Admin' : 'User'),
            desc: "Current role",
            icon: Shield,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
          },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={cn("p-2 rounded-lg", stat.bg)}>
                  <stat.icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.desc}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Charts & Graphs */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-3">
          <Card className="h-[400px] bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Resource Distribution</CardTitle>
              <CardDescription>Breakdown of educational resources by category</CardDescription>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis
                    dataKey="name"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Appointments (Sidebar) */}
        <motion.div variants={item} className="md:col-span-2 lg:col-span-1">
          <Card className="h-[400px] flex flex-col bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>Upcoming appointments</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto pr-2 custom-scrollbar">
              {appointmentsLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : appointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Calendar className="h-10 w-10 text-muted-foreground/30 mb-2" />
                  <p className="text-sm text-muted-foreground">No sessions scheduled.</p>
                  <Button variant="link" size="sm" asChild>
                    <Link to="/appointments">Book now</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors group">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{apt.timeSlot}</p>
                        <p className="text-xs text-muted-foreground">ID: {apt.id.substring(0, 4)}...</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "flex h-2 w-2 rounded-full",
                          apt.status === 'confirmed' ? "bg-green-500" : "bg-yellow-500"
                        )} />
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t border-border/30 pt-4">
              <Button variant="outline" className="w-full" asChild>
                <Link to="/appointments">View All <ArrowUpRight className="ml-2 h-3 w-3" /></Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

    </div>
  );
}
