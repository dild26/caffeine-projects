import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Award } from 'lucide-react';

export default function About() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're passionate about making workflow automation accessible to everyone
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <Users className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To empower businesses and individuals with high-quality, ready-to-use workflow templates that save time
              and increase productivity.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Target className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To become the leading marketplace for n8n workflow templates, trusted by thousands of users worldwide.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Award className="h-12 w-12 mb-4 text-primary" />
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Quality, reliability, and customer satisfaction are at the core of everything we do.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">About SECOINFI</h2>
        <p className="text-muted-foreground mb-4">
          SECOINFI is a technology company dedicated to building innovative solutions for workflow automation and
          business process optimization. Our team of experts has years of experience in automation, software
          development, and business consulting.
        </p>
        <p className="text-muted-foreground">
          Contact us at: <a href="mailto:contact@secoinfi.com" className="text-primary hover:underline">contact@secoinfi.com</a>
        </p>
      </div>
    </div>
  );
}
