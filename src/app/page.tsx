import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, MessageSquare, BrainCircuit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 lg:px-8 h-20 flex items-center neo-border-thick neo-bg-primary">
        <Link href="/" className="flex items-center justify-center">
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-4">
          <Button asChild variant="outline" size="lg">
            <Link href="/login">LOGIN</Link>
          </Button>
          <Button asChild variant="accent" size="lg">
            <Link href="/login">GET STARTED</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 neo-bg-cyan">
          <div className="container px-6 md:px-8 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - Main Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-none">
                    <span className="block text-black neo-text-shadow">STUDY</span>
                    <span className="block text-white neo-text-shadow">LINK</span>
                  </h1>
                  
                  <div className="neo-border neo-shadow bg-black p-6">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-white">
                      STOP STUDYING ALONE.<br />
                      START WINNING TOGETHER.
                    </h2>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" variant="default" className="text-lg px-8 py-4">
                    <Link href="/login">
                      FIND YOUR GROUP <ArrowRight className="ml-3 h-6 w-6" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8 py-4">
                    <Link href="/login">
                      CREATE GROUP
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Right Column - Description Card */}
              <div className="lg:justify-self-end">
                <div className="neo-border-thick neo-shadow-lg bg-white p-8 max-w-lg">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="neo-border bg-black p-3">
                        <BrainCircuit className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-2xl font-black uppercase">AI POWERED</span>
                    </div>
                    
                    <p className="text-lg font-bold text-black leading-relaxed">
                      STUDYLINK USES ARTIFICIAL INTELLIGENCE TO CONNECT YOU WITH THE PERFECT STUDY PARTNERS FOR YOUR COURSES.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="neo-border neo-bg-accent p-3 mb-2">
                          <span className="font-black text-xl">📚</span>
                        </div>
                        <span className="text-sm font-bold">CREATE</span>
                      </div>
                      <div className="text-center">
                        <div className="neo-border neo-bg-muted p-3 mb-2">
                          <span className="font-black text-xl">🤝</span>
                        </div>
                        <span className="text-sm font-bold">COLLABORATE</span>
                      </div>
                      <div className="text-center">
                        <div className="neo-border neo-bg-secondary p-3 mb-2">
                          <span className="font-black text-xl">🏆</span>
                        </div>
                        <span className="text-sm font-bold">CONQUER</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 bg-white">
            <div className="container px-6 md:px-8 max-w-7xl mx-auto">
                 <div className="text-center mb-16">
                    <div className="inline-block neo-border-thick neo-shadow-lg neo-bg-secondary p-8 mb-8">
                      <h2 className="text-5xl md:text-6xl font-black uppercase text-white">
                        WHY STUDYLINK?
                      </h2>
                    </div>
                    <p className="max-w-3xl mx-auto text-xl font-bold text-black">
                      WE'RE MORE THAN JUST GROUP FINDING. WE PROVIDE TOOLS TO MAKE YOUR STUDY SESSIONS ACTUALLY PRODUCTIVE.
                    </p>
                 </div>                <div className="grid lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<BrainCircuit className="h-16 w-16 text-black" />}
                        title="AI-POWERED MATCHING"
                        description="OUR AI ANALYZES YOUR SUBJECTS, SKILLS, AND AVAILABILITY TO SUGGEST THE MOST COMPATIBLE STUDY GROUPS."
                        bgColor="neo-bg-accent"
                    />
                     <FeatureCard
                        icon={<MessageSquare className="h-16 w-16 text-black" />}
                        title="INTEGRATED GROUP CHAT"
                        description="NO MORE JUGGLING APPS. CHAT, SHARE FILES, AND SCHEDULE MEETINGS RIGHT WITHIN YOUR GROUP SPACE."
                        bgColor="neo-bg-cyan"
                    />
                     <FeatureCard
                        icon={<Users className="h-16 w-16 text-black" />}
                        title="CREATE & JOIN EASILY"
                        description="START A NEW GROUP IN SECONDS OR JOIN AN EXISTING ONE. YOUR NEXT STUDY SESSION IS JUST A CLICK AWAY."
                        bgColor="neo-bg-muted"
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


function FeatureCard({ icon, title, description, bgColor }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  bgColor?: string 
}) {
    const cardBgColor = bgColor || 'neo-bg-accent';
    
    return (
        <Card className={`${cardBgColor} neo-border-thick transform hover:rotate-1 transition-transform duration-200`}>
            <CardHeader className="items-center text-center p-8">
                <div className="neo-border bg-white p-4">
                    {icon}
                </div>
                <CardTitle className="mt-6 font-black text-2xl uppercase tracking-wide text-black">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center p-8">
                <p className="text-black font-bold text-lg">{description}</p>
            </CardContent>
        </Card>
    )
}
