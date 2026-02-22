import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Users, BookOpen, Award, Rocket } from 'lucide-react';

export default function JoinUsPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Join the E-Tutorial Community</h1>
        <p className="text-xl text-muted-foreground">
          Become part of our growing community of learners, instructors, and educational enthusiasts.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Join as a Learner</CardTitle>
            <CardDescription>
              Access quality educational resources, book sessions with expert instructors, and track your learning progress.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Browse verified educational resources
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Book appointments with instructors
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Track your learning progress
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Access personalized recommendations
              </li>
            </ul>
            <Button className="w-full">Get Started as Learner</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Join as an Instructor</CardTitle>
            <CardDescription>
              Share your expertise, manage your availability, and connect with eager learners on our platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Create your instructor profile
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Set your availability schedule
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Manage appointment bookings
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                Build your teaching portfolio
              </li>
            </ul>
            <Button className="w-full">Become an Instructor</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="pt-6 space-y-6">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Why Join E-Tutorial?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <Users className="h-8 w-8 text-primary mx-auto" />
              <h4 className="font-semibold">Growing Community</h4>
              <p className="text-sm text-muted-foreground">
                Join thousands of learners and instructors
              </p>
            </div>
            <div className="text-center space-y-2">
              <BookOpen className="h-8 w-8 text-primary mx-auto" />
              <h4 className="font-semibold">Quality Resources</h4>
              <p className="text-sm text-muted-foreground">
                Access verified educational content
              </p>
            </div>
            <div className="text-center space-y-2">
              <Award className="h-8 w-8 text-primary mx-auto" />
              <h4 className="font-semibold">Expert Instructors</h4>
              <p className="text-sm text-muted-foreground">
                Learn from qualified professionals
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
