import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { useProsData } from '../hooks/useProsData';

interface ProsPageProps {
  project: string;
}

export default function ProsPage({ project }: ProsPageProps) {
  const { data: prosData, isLoading } = useProsData(project);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading pros data...</p>
        </div>
      </div>
    );
  }

  if (!prosData) {
    return (
      <Card className="card-3d card-3d-hover border-4 border-primary/30">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gradient">Pros of {project.toUpperCase()}</CardTitle>
          <CardDescription>Content coming soon...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="card-3d card-3d-hover border-4 border-primary/30">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto mb-4">
            <Award className="w-16 h-16 text-primary mx-auto animate-pulse-glow" />
          </div>
          <CardTitle className="text-4xl font-bold text-gradient mb-4">{prosData.title}</CardTitle>
          <CardDescription className="text-lg">{prosData.description}</CardDescription>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="outline" className="text-sm">
              {prosData.project}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Last Updated: {new Date(Number(prosData.lastUpdated)).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {prosData.advantages.length > 0 && (
        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Key Advantages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {prosData.advantages.map((advantage, index) => (
                <div key={index} className="card-3d p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                    <p className="text-sm">{advantage}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {prosData.benefits.length > 0 && (
        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {prosData.benefits.map((benefit, index) => (
                <div key={index} className="card-3d p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                    <p className="text-sm">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {prosData.uniqueSellingPoints.length > 0 && (
        <Card className="card-3d card-3d-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-secondary" />
              Unique Selling Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {prosData.uniqueSellingPoints.map((usp, index) => (
                <div key={index} className="card-3d p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                    <p className="text-sm font-medium">{usp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
