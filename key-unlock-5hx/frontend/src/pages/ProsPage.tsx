import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetPros } from '../hooks/useAppQueries';
import { useNavigate } from '@tanstack/react-router';
import { Loader2, ArrowRight } from 'lucide-react';

export default function ProsPage() {
  const { data: pros = [], isLoading } = useGetPros();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading pros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Pros of Key-Unlock App</h1>
          <p className="text-xl text-muted-foreground">
            Discover the advantages of our authentication system
          </p>
        </div>

        <div className="space-y-6">
          {pros.map((pro, index) => (
            <Card
              key={pro?.id?.toString() || index}
              className={`border-2 hover:shadow-lg transition-all cursor-pointer ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                }`}
              onClick={() => navigate({ to: pro.link })}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl hover:text-primary transition-colors">
                    {pro.title}
                  </CardTitle>
                  <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">{pro.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
