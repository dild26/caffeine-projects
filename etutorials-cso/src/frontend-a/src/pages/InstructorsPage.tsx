import { useGetInstructors } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, Clock, Tag, BookOpen } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';

export default function InstructorsPage() {
  const { data: instructors = [], isLoading } = useGetInstructors();

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Instructors Directory</h1>
        <p className="text-muted-foreground">
          Browse available instructors, their specializations, and availability.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : instructors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No instructors available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{instructor.name}</CardTitle>
                    <CardDescription className="text-xs">ID: {instructor.id}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {instructor.topics.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>Specializations</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {instructor.topics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {instructor.availability.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Availability</span>
                    </div>
                    <div className="space-y-1">
                      {instructor.availability.map((slot, idx) => (
                        <div key={idx} className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                          {slot}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {instructor.hashtags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span>Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {instructor.hashtags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
