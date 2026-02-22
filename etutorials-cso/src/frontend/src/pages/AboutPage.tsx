import { Card, CardContent } from '../components/ui/card';
import { BookOpen, Target, Users, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">About E-Tutorial Platform</h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive educational resource management system designed to streamline learning, teaching, and administrative workflows.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Our Mission</h3>
            <p className="text-muted-foreground">
              To provide an intuitive platform that connects learners with quality educational resources and expert instructors, making education accessible and organized.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Our Vision</h3>
            <p className="text-muted-foreground">
              To revolutionize educational resource management through innovative technology, smart automation, and seamless user experiences.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold">Resource Management</h4>
            <p className="text-sm text-muted-foreground">
              Upload, organize, and manage educational resources with CSV support and automatic fee conversion.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold">Instructor Directory</h4>
            <p className="text-sm text-muted-foreground">
              Browse qualified instructors, view their availability, and book sessions seamlessly.
            </p>
          </div>
          <div className="text-center space-y-3">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h4 className="font-semibold">Smart Booking</h4>
            <p className="text-sm text-muted-foreground">
              Optimized appointment scheduling with Merkle root nonce mechanism for efficient booking.
            </p>
          </div>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-2xl font-bold">Technology Stack</h2>
          <p className="text-muted-foreground">
            Built on the Internet Computer blockchain with Internet Identity authentication, our platform ensures security, decentralization, and data integrity. We use modern web technologies including React, TypeScript, and Motoko for a seamless user experience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
