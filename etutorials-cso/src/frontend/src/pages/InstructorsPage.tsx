import { useState, useMemo } from 'react';
import { useGetInstructors } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Clock,
  Search,
  Star,
  Calendar,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function InstructorsPage() {
  const { data: instructors = [], isLoading } = useGetInstructors();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter instructors
  const filteredInstructors = useMemo(() => {
    return instructors.filter(instructor => {
      const query = searchQuery.toLowerCase();
      return (
        instructor.name.toLowerCase().includes(query) ||
        instructor.topics.some(t => t.toLowerCase().includes(query)) ||
        instructor.hashtags.some(h => h.toLowerCase().includes(query))
      );
    });
  }, [instructors, searchQuery]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container py-8 space-y-12 min-h-screen">

      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm mb-4">
            <Sparkles className="mr-2 h-4 w-4" />
            <span>World-Class Mentors</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50 leading-tight">
            Master Skills with <br />
            <span className="text-primary">Expert Instructors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with top-tier professionals. Book specialized sessions and accelerate your learning journey with personalized guidance.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl opacity-50 rounded-full" />
          <div className="relative bg-background/50 backdrop-blur-xl border border-primary/20 rounded-full shadow-lg flex items-center p-2">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, skill, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent focus-visible:ring-0 shadow-none text-lg h-10 px-4 placeholder:text-muted-foreground/50"
            />
          </div>
        </motion.div>
      </div>

      {/* Instructors Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="bg-card/50 border-border/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="text-center py-20">
          <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="text-xl font-bold mb-2">No instructors found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms.</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence>
            {filteredInstructors.map((instructor) => (
              <motion.div key={instructor.id} variants={item}>
                <Card className="h-full bg-gradient-to-b from-card to-card/50 border-white/5 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden flex flex-col">
                  {/* Decorative gradient blob */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />

                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <Avatar className="h-20 w-20 border-2 border-background shadow-xl">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${instructor.id}`} alt={instructor.name} />
                        <AvatarFallback>{instructor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        <Star className="h-3 w-3 mr-1 fill-current" /> Top Rated
                      </Badge>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors flex items-center gap-2">
                      {instructor.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-mono">ID: {instructor.id.substring(0, 8)}...</p>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-6 relative z-10">
                    {/* Specializations */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Expertise</p>
                      <div className="flex flex-wrap gap-1.5">
                        {instructor.topics.slice(0, 4).map((topic, idx) => (
                          <Badge key={idx} variant="outline" className="bg-background/50 hover:bg-primary/10 transition-colors">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Availability Preview */}
                    {instructor.availability.length > 0 && (
                      <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Next Available Slots</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {instructor.availability.slice(0, 2).map((slot, idx) => (
                            <div key={idx} className="text-xs bg-background/80 px-2 py-1 rounded shadow-sm">
                              {slot}
                            </div>
                          ))}
                          {instructor.availability.length > 2 && (
                            <div className="text-xs text-muted-foreground px-2 py-1">
                              +{instructor.availability.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="pt-4 border-t border-border/50 bg-muted/10 relative z-10">
                    <Button className="w-full rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-all shadow-lg hover:shadow-primary/25">
                      <Calendar className="mr-2 h-4 w-4" /> Book Session
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Join CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground mb-4">Are you an expert in your field?</p>
        <Button variant="outline" size="lg" className="rounded-full">
          Apply to Teach <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>

    </div>
  );
}
