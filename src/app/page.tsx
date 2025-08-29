import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, MessageSquare, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b-2">
        <Link href="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 border-b-2">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                Stop Studying Alone. Start Winning Together.
              </h1>
              <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
                StudyLink uses AI to connect you with the perfect study partners for your courses. Create, collaborate, and conquer your exams.
              </p>
              <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center">
                <Button asChild size="lg">
                  <Link href="/login">
                    Find Your Group <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 bg-secondary/50 border-b-2">
            <div className="container px-4 md:px-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Why StudyLink?</h2>
                    <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                      We're more than just group finding. We provide tools to make your study sessions actually productive.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                        icon={<BrainCircuit className="h-10 w-10 text-primary" />}
                        title="AI-Powered Smart Matching"
                        description="Our AI analyzes your subjects, skills, and availability to suggest the most compatible study groups."
                    />
                     <FeatureCard
                        icon={<MessageSquare className="h-10 w-10 text-primary" />}
                        title="Integrated Group Chat"
                        description="No more juggling apps. Chat, share files, and schedule meetings right within your group space."
                    />
                     <FeatureCard
                        icon={<Users className="h-10 w-10 text-primary" />}
                        title="Create & Join Easily"
                        description="Start a new group in seconds or join an existing one. Your next study session is just a click away."
                    />
                </div>
            </div>
        </section>

        {/* Image Grid Section */}
        <section className="w-full py-20 md:py-32">
            <div className="container px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Collaborate Like Never Before</h2>
                        <p className="mt-4 text-lg text-muted-foreground">From late-night cram sessions to weekly reviews, StudyLink provides the platform for success. Share knowledge, solve problems, and achieve your academic goals together.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Image
                            src="https://picsum.photos/400/300?1"
                            width="400"
                            height="300"
                            alt="Students studying"
                            data-ai-hint="students collaborating"
                            className="rounded-lg object-cover w-full aspect-[4/3] border-2 shadow-neo-md"
                           />
                        <Image
                            src="https://picsum.photos/400/300?2"
                            width="400"
                            height="300"
                            alt="Close up on notes"
                            data-ai-hint="notes textbook"
                            className="rounded-lg object-cover w-full aspect-[4/3] border-2 shadow-neo-md"
                           />
                         <Image
                            src="https://picsum.photos/400/300?3"
                            width="400"
                            height="300"
                            alt="Student on laptop"
                            data-ai-hint="student laptop"
                            className="rounded-lg object-cover w-full aspect-[4/3] border-2 shadow-neo-md"
                           />
                         <Image
                            src="https://picsum.photos/400/300?4"
                            width="400"
                            height="300"
                            alt="Group discussion"
                            data-ai-hint="group discussion"
                            className="rounded-lg object-cover w-full aspect-[4/3] border-2 shadow-neo-md"
                           />
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="py-8 w-full shrink-0 border-t-2">
          <div className="container px-4 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">&copy; 2024 StudyLink. All rights reserved.</p>
            <nav className="flex gap-4 sm:gap-6">
              <Link href="#" className="text-sm hover:underline underline-offset-4">Terms</Link>
              <Link href="#" className="text-sm hover:underline underline-offset-4">Privacy</Link>
            </nav>
          </div>
      </footer>
    </div>
  );
}


function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card>
            <CardHeader className="items-center text-center">
                {icon}
                <CardTitle className="mt-4">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
