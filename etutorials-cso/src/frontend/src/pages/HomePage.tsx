import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Search, Calendar, TrendingUp, Shield, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

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

export default function HomePage() {
  return (
    <div className="space-y-24 py-12 md:py-24 relative">

      {/* Hero Section */}
      <section className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Next-Gen Education Management</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
              Manage Resources <br />
              <span className="text-primary">Without Limits</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              A futuristic platform for educational resource management. Upload, analyze, and sync data with military-grade precision and beautiful design.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                <Link to="/dashboard">
                  Launch Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-primary/20 hover:bg-primary/5">
                <Link to="/explore">Explore Universe</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border border-white/10 group transform transition-transform duration-500 hover:scale-[1.02] hover:rotate-y-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none mix-blend-overlay" />
              <img
                src="/assets/generated/hero-banner.dim_1200x400.png"
                alt="E-Tutorial Platform"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* DecorElements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/30 rounded-full blur-[100px] -z-10 animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/30 rounded-full blur-[100px] -z-10 animate-pulse delay-700" />
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl font-bold">Platform Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Engineered for performance, designed for humans.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
        >
          {/* Large Card */}
          <motion.div variants={item} className="md:col-span-2 md:row-span-2">
            <Card className="h-full bg-gradient-to-br from-card to-card/50 border-primary/10 overflow-hidden group hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Upload className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">Create & Manage Content</CardTitle>
                <CardDescription className="text-base">
                  Upload and parse CSV files for resources, instructors, learners, and appointments with automatic fee conversion.
                  Our advanced parser handles millions of rows with ease.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative h-48 md:h-auto">
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-primary/5 to-transparent" />
                {/* Abstract UI representation */}
                <div className="border border-border/50 rounded-t-xl bg-background/50 p-4 mx-8 mt-4 shadow-xl backdrop-blur-sm">
                  <div className="space-y-2">
                    <div className="h-2 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-2 w-1/2 bg-muted rounded animate-pulse delay-75" />
                    <div className="h-2 w-full bg-muted rounded animate-pulse delay-150" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Standard Cards */}
          <motion.div variants={item}>
            <Card className="h-full hover:border-primary/30 transition-colors group">
              <CardHeader>
                <div className="h-10 w-10 circle bg-secondary/10 flex items-center justify-center mb-3 text-secondary group-hover:scale-110 transition-transform">
                  <Search className="h-5 w-5" />
                </div>
                <CardTitle>Hashtag Search</CardTitle>
                <CardDescription>
                  Instant search with hashtag support. Navigate your data universe at lightspeed.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full hover:border-primary/30 transition-colors group">
              <CardHeader>
                <div className="h-10 w-10 circle bg-accent/10 flex items-center justify-center mb-3 text-accent group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <CardTitle>Smart Booking</CardTitle>
                <CardDescription>
                  Optimized scheduling with Merkle root nonce mechanism for verifiable appointments.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={item} className="md:col-span-3 lg:col-span-1">
            <Card className="h-full bg-primary text-primary-foreground border-none">
              <CardHeader>
                <Zap className="h-8 w-8 mb-2" />
                <CardTitle>Real-time Sync</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Automatic synchronization between learners, instructors, and schedules.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div variants={item} className="md:col-span-2">
            <Card className="h-full hover:border-primary/30 transition-colors flex flex-col md:flex-row items-center overflow-hidden">
              <div className="flex-1 p-6">
                <CardTitle className="mb-2">Progress Analytics</CardTitle>
                <CardDescription className="mb-4">
                  Monitor learner progress by topic, pace, language, and difficulty level with detailed analytics.
                </CardDescription>
                <div className="flex gap-2">
                  <div className="bg-background/50 px-2 py-1 rounded text-xs font-mono border">Analytics</div>
                  <div className="bg-background/50 px-2 py-1 rounded text-xs font-mono border">Reports</div>
                </div>
              </div>
              <div className="w-full md:w-1/3 h-32 md:h-full bg-secondary/5 flex items-center justify-center relative">
                <TrendingUp className="h-16 w-16 text-secondary/20 absolute" />
              </div>
            </Card>
          </motion.div>

        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container pb-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/20 p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">
              Ready to launch?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our platform today and experience seamless educational resource management with powerful, futuristic features.
            </p>
            <Button asChild size="lg" className="rounded-full px-12 h-14 text-lg shadow-[0_0_40px_rgba(var(--primary),0.3)] hover:shadow-[0_0_60px_rgba(var(--primary),0.5)] transition-shadow duration-500">
              <Link to="/dashboard">Get Started Now</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
