import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, MessageSquare, Users, BrainCircuit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
            <Link href="/login">Get Started with Google</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Unlock Your Learning Potential with{' '}
                    <span style={{ color: 'hsl(var(--accent))' }}>StudyVerse</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Find the perfect study group, collaborate seamlessly, and get AI-powered assistance to ace your exams.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                    <Link href="/login">Get Started with Google</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://picsum.photos/600/600"
                width="600"
                height="600"
                alt="Hero"
                data-ai-hint="happy students collaborating"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  StudyVerse combines smart technology with a collaborative environment to help you achieve your academic goals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-accent/10 p-3 flex items-center justify-center">
                    <Users className="h-6 w-6" style={{ color: 'hsl(var(--accent))' }}/>
                  </div>
                  <CardTitle className="font-headline">Smart Group Matching</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Our AI analyzes your profile—subjects, skills, and availability—to suggest the most compatible study groups.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-accent/10 p-3 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6" style={{ color: 'hsl(var(--accent))' }} />
                  </div>
                  <CardTitle className="font-headline">Collaborative Groups</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Join or create groups with real-time chat, shared resources, and seamless communication.
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-accent/10 p-3 flex items-center justify-center">
                     <BrainCircuit className="h-6 w-6" style={{ color: 'hsl(var(--accent))' }} />
                  </div>
                  <CardTitle className="font-headline">AI Study Assistant</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Get instant study tips, practice problems, and resource suggestions from our integrated AI assistant.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 StudyVerse. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
