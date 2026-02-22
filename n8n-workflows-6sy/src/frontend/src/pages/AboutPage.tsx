import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Lightbulb, CheckCircle2 } from 'lucide-react';
import { useGetCompanyInfo } from '@/hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AboutPage() {
  const { data: companyInfo } = useGetCompanyInfo();

  const company = companyInfo || {
    name: 'SECOINFI',
    ceo: 'Saurabh Chaturvedi',
  };

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 border-b-4 border-primary">
        <div className="container py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                About {company.name}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering businesses through intelligent workflow automation
            </p>
            <Alert className="border-2 border-primary/50 bg-primary/5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm font-medium">
                Real company information displayed - {company.name} led by CEO {company.ceo}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
                <Badge variant="default">{company.name}</Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                We believe that automation should be accessible to everyone. Our marketplace connects workflow creators with businesses looking to streamline their operations, saving time and reducing manual work.
              </p>
              <p className="text-lg text-muted-foreground">
                Built on the Internet Computer, we provide a secure, decentralized platform where you can discover, purchase, and deploy powerful n8n workflows with confidence.
              </p>
              <div className="pt-4">
                <p className="text-sm font-semibold text-muted-foreground">Leadership</p>
                <p className="text-lg font-bold">{company.ceo}</p>
                <p className="text-sm text-muted-foreground">Chief Executive Officer</p>
              </div>
            </div>
            <div>
              <img
                src="/assets/generated/about-team.dim_400x300.png"
                alt="Our Team"
                className="rounded-lg shadow-xl border-4 border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Our Values</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Community First</CardTitle>
                <CardDescription>
                  We prioritize our community of creators and users, fostering collaboration and knowledge sharing.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-accent/10 w-fit mb-4">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <CardTitle>Quality & Reliability</CardTitle>
                <CardDescription>
                  Every workflow is reviewed and tested to ensure it meets our high standards for performance and security.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="p-3 rounded-full bg-primary/10 w-fit mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  We continuously explore new technologies and approaches to make automation more powerful and accessible.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
