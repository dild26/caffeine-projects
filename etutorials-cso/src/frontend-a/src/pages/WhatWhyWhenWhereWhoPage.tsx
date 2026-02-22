import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { HelpCircle, Target, Clock, MapPin, Users } from 'lucide-react';

export default function WhatWhyWhenWhereWhoPage() {
  return (
    <div className="container py-12 space-y-12">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <HelpCircle className="h-12 w-12 text-primary mx-auto" />
        <h1 className="text-4xl font-bold">The 5W Framework</h1>
        <p className="text-xl text-muted-foreground">
          Understanding the E-Tutorial platform through What, Why, When, Where, and Who.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>What is E-Tutorial?</CardTitle>
                <CardDescription>Platform definition and purpose</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              E-Tutorial is a comprehensive educational resource management platform built on the Internet Computer blockchain. 
              It provides tools for managing learning resources, connecting with instructors, booking appointments, and tracking 
              learner progress.
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">Resource management with CSV upload support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">Instructor directory and availability tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">Smart appointment booking system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">Hashtag-based search and discovery</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Why E-Tutorial?</CardTitle>
                <CardDescription>The problem we solve</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Traditional educational platforms lack integration, security, and decentralization. E-Tutorial addresses these 
              challenges by providing:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>Decentralized Security:</strong> Built on blockchain for data integrity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>Unified Platform:</strong> All educational tools in one place</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>Smart Automation:</strong> Automated scheduling and resource management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>Global Access:</strong> Available worldwide without restrictions</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>When to Use E-Tutorial?</CardTitle>
                <CardDescription>Use cases and scenarios</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              E-Tutorial is designed for various educational scenarios:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">When you need to organize and manage educational resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">When searching for qualified instructors in specific topics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">When booking and managing learning appointments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">When tracking learner progress and performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm">When you need secure, decentralized educational data management</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Where is E-Tutorial Available?</CardTitle>
                <CardDescription>Platform accessibility</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              E-Tutorial is globally accessible through the Internet Computer blockchain:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>Web Access:</strong> Available through any modern web browser</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>Global Reach:</strong> Accessible from any country with internet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>Decentralized Hosting:</strong> Distributed across IC nodes worldwide</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-sm"><strong>24/7 Availability:</strong> Always online with no downtime</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Who Uses E-Tutorial?</CardTitle>
                <CardDescription>Target users and stakeholders</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              E-Tutorial serves multiple user groups in the educational ecosystem:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold">Learners</h4>
                <p className="text-sm text-muted-foreground">
                  Students and individuals seeking educational resources, booking sessions with instructors, 
                  and tracking their learning progress.
                </p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold">Instructors</h4>
                <p className="text-sm text-muted-foreground">
                  Teachers and tutors offering their expertise, managing availability, and connecting with learners.
                </p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold">Administrators</h4>
                <p className="text-sm text-muted-foreground">
                  Platform managers verifying resources, managing content, and ensuring quality standards.
                </p>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <h4 className="font-semibold">Institutions</h4>
                <p className="text-sm text-muted-foreground">
                  Educational organizations using the platform for resource management and learner coordination.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
