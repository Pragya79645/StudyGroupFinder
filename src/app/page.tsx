import { Button } from '@/components/ui/button';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, MessageSquare, BrainCircuit, Mail, Github, Twitter, Linkedin, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 lg:px-8 h-20 flex items-center neo-border-thick neo-bg-primary">
        <Link href="/" className="flex items-center justify-center">
         
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
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 relative overflow-hidden">
          {/* Simplified Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-32 h-32 neo-border-thick bg-green-400 transform rotate-12"></div>
            <div className="absolute bottom-20 right-10 w-28 h-28 neo-border-thick bg-cyan-400 transform -rotate-12"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 neo-border-thick bg-yellow-400 transform rotate-45"></div>
          </div>
          
          <div className="container px-6 md:px-8 max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column - Main Content */}
              <div className="space-y-10">
                {/* Clean Title Section */}
                <div className="space-y-6">
                  <h1 className="text-7xl md:text-8xl lg:text-9xl font-black uppercase leading-none">
                    <span className="block text-black neo-text-shadow">STUDY</span>
                    <span className="block text-white neo-text-shadow">LINK</span>
                  </h1>
                  
                  <div className="neo-border-thick neo-shadow-lg bg-black p-6 max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide">
                      <span className="text-yellow-400">STOP STUDYING ALONE.</span><br />
                      <span className="text-green-400">START WINNING TOGETHER.</span>
                    </h2>
                  </div>
                </div>
                
                {/* Clean Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <Button asChild size="lg" className="neo-border-thick bg-white text-black hover:bg-black hover:text-white text-lg px-8 py-4 font-black transform hover:scale-105 transition-all duration-300">
                    <Link href="/login">
                      FIND YOUR GROUP <ArrowRight className="ml-3 h-6 w-6" />
                    </Link>
                  </Button>
                  
                  <Button asChild size="lg" variant="outline" className="neo-border-thick bg-transparent text-black hover:bg-white hover:text-black text-lg px-8 py-4 font-black transform hover:scale-105 transition-all duration-300">
                    <Link href="/login">
                      CREATE GROUP
                    </Link>
                  </Button>
                </div>
              </div>
              
              {/* Right Column - Clean Description Card */}
              <div className="lg:justify-self-end">
                <div className="neo-border-thick neo-shadow-lg bg-white p-8 max-w-lg transform hover:scale-105 transition-transform duration-300">
                  <div className="space-y-6">
                    {/* AI Badge */}
                    <div className="flex items-center gap-4">
                      <div className="neo-border bg-black p-3">
                        <BrainCircuit className="h-8 w-8 text-white" />
                      </div>
                      <div className="neo-border bg-purple-400 px-4 py-2">
                        <span className="text-xl font-black uppercase text-white">AI POWERED</span>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="neo-border neo-shadow bg-black p-4">
                      <p className="text-lg font-bold text-white leading-relaxed">
                        STUDYLINK USES <span className="text-cyan-400">ARTIFICIAL INTELLIGENCE</span> TO CONNECT YOU WITH THE <span className="text-yellow-400">PERFECT STUDY PARTNERS</span> FOR YOUR COURSES.
                      </p>
                    </div>
                    
                    {/* Process Steps */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="neo-border bg-green-400 p-4 mb-3 transform hover:scale-110 transition-transform duration-300">
                          <span className="font-black text-2xl">📚</span>
                        </div>
                        <div className="neo-border bg-green-400 px-2 py-1">
                          <span className="text-sm font-black text-black">CREATE</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="neo-border bg-cyan-400 p-4 mb-3 transform hover:scale-110 transition-transform duration-300">
                          <span className="font-black text-2xl">🤝</span>
                        </div>
                        <div className="neo-border bg-cyan-400 px-2 py-1">
                          <span className="text-sm font-black text-black">COLLABORATE</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="neo-border bg-yellow-400 p-4 mb-3 transform hover:scale-110 transition-transform duration-300">
                          <span className="font-black text-2xl">🏆</span>
                        </div>
                        <div className="neo-border bg-yellow-400 px-2 py-1">
                          <span className="text-sm font-black text-black">CONQUER</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 neo-border-thick bg-yellow-400 transform rotate-12"></div>
                <div className="absolute top-40 right-20 w-24 h-24 neo-border-thick bg-cyan-400 transform -rotate-45"></div>
                <div className="absolute bottom-20 left-1/4 w-28 h-28 neo-border-thick bg-green-400 transform rotate-45"></div>
                <div className="absolute bottom-40 right-1/3 w-20 h-20 neo-border-thick bg-purple-400 transform -rotate-12"></div>
            </div>
            
            <div className="container px-6 md:px-8 max-w-7xl mx-auto relative z-10">
                {/* Enhanced Header */}
                <div className="text-center mb-20">
                    <div className="relative inline-block mb-8">
                        <div className="neo-border-thick neo-shadow-lg neo-bg-secondary p-8 transform hover:rotate-1 transition-transform duration-300">
                            <h2 className="text-5xl md:text-6xl font-black uppercase text-white neo-text-shadow">
                                WHY STUDYLINK?
                            </h2>
                        </div>
                        {/* Decorative elements around title */}
                        <div className="absolute -top-4 -left-4 w-8 h-8 neo-border bg-yellow-400 transform rotate-45"></div>
                        <div className="absolute -top-4 -right-4 w-8 h-8 neo-border bg-cyan-400 transform -rotate-45"></div>
                        <div className="absolute -bottom-4 -left-4 w-8 h-8 neo-border bg-green-400 transform -rotate-45"></div>
                        <div className="absolute -bottom-4 -right-4 w-8 h-8 neo-border bg-purple-400 transform rotate-45"></div>
                    </div>
                    
                    <div className="relative">
                        <div className="neo-border neo-shadow bg-black p-6 max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300">
                            <p className="text-xl md:text-2xl font-black uppercase text-white leading-relaxed">
                                WE'RE MORE THAN JUST GROUP FINDING.<br />
                                <span className="text-yellow-400">WE PROVIDE TOOLS TO MAKE YOUR STUDY SESSIONS ACTUALLY PRODUCTIVE.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Enhanced Feature Cards Grid */}
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Card 1 - AI Powered */}
                    <div className="group relative">
                        <div className="absolute inset-0 neo-border-thick bg-gradient-to-br from-green-400 to-green-500 transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                        <div className="relative neo-border-thick neo-shadow-lg bg-white p-8 transform group-hover:-rotate-2 transition-all duration-300 hover:scale-105">
                            <div className="text-center space-y-6">
                                {/* Animated Icon Container */}
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 neo-border bg-green-400 transform rotate-12 group-hover:rotate-45 transition-transform duration-500"></div>
                                    <div className="relative neo-border bg-white p-4 transform group-hover:scale-110 transition-transform duration-300">
                                        <BrainCircuit className="h-12 w-12 text-black mx-auto" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="font-black text-2xl uppercase tracking-wide text-black">
                                        AI-POWERED<br />MATCHING
                                    </h3>
                                    <div className="neo-border bg-green-400 p-3 transform group-hover:skew-x-3 transition-transform duration-300">
                                        <p className="text-black font-bold text-sm">
                                            SMART • PRECISE • EFFICIENT
                                        </p>
                                    </div>
                                    <p className="text-black font-bold text-base leading-relaxed">
                                        Our AI analyzes your subjects, skills, and availability to suggest the most compatible study groups.
                                    </p>
                                </div>
                                
                                {/* Progress Indicators */}
                                <div className="flex justify-center gap-2">
                                    <div className="w-3 h-3 neo-border bg-green-400"></div>
                                    <div className="w-3 h-3 neo-border bg-green-300"></div>
                                    <div className="w-3 h-3 neo-border bg-green-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 - Group Chat */}
                    <div className="group relative lg:mt-8">
                        <div className="absolute inset-0 neo-border-thick bg-gradient-to-br from-cyan-400 to-cyan-500 transform -rotate-2 group-hover:-rotate-6 transition-transform duration-300"></div>
                        <div className="relative neo-border-thick neo-shadow-lg bg-white p-8 transform group-hover:rotate-3 transition-all duration-300 hover:scale-105">
                            <div className="text-center space-y-6">
                                {/* Animated Icon Container */}
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 neo-border bg-cyan-400 transform -rotate-12 group-hover:-rotate-45 transition-transform duration-500"></div>
                                    <div className="relative neo-border bg-white p-4 transform group-hover:scale-110 transition-transform duration-300">
                                        <MessageSquare className="h-12 w-12 text-black mx-auto" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="font-black text-2xl uppercase tracking-wide text-black">
                                        INTEGRATED<br />GROUP CHAT
                                    </h3>
                                    <div className="neo-border bg-cyan-400 p-3 transform group-hover:-skew-x-3 transition-transform duration-300">
                                        <p className="text-black font-bold text-sm">
                                            CHAT • SHARE • COLLABORATE
                                        </p>
                                    </div>
                                    <p className="text-black font-bold text-base leading-relaxed">
                                        No more juggling apps. Chat, share files, and schedule meetings right within your group space.
                                    </p>
                                </div>
                                
                                {/* Progress Indicators */}
                                <div className="flex justify-center gap-2">
                                    <div className="w-3 h-3 neo-border bg-cyan-400"></div>
                                    <div className="w-3 h-3 neo-border bg-cyan-300"></div>
                                    <div className="w-3 h-3 neo-border bg-cyan-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 - Create & Join */}
                    <div className="group relative lg:mt-4">
                        <div className="absolute inset-0 neo-border-thick bg-gradient-to-br from-yellow-400 to-yellow-500 transform rotate-1 group-hover:rotate-4 transition-transform duration-300"></div>
                        <div className="relative neo-border-thick neo-shadow-lg bg-white p-8 transform group-hover:-rotate-1 transition-all duration-300 hover:scale-105">
                            <div className="text-center space-y-6">
                                {/* Animated Icon Container */}
                                <div className="relative mx-auto w-24 h-24">
                                    <div className="absolute inset-0 neo-border bg-yellow-400 transform rotate-6 group-hover:rotate-30 transition-transform duration-500"></div>
                                    <div className="relative neo-border bg-white p-4 transform group-hover:scale-110 transition-transform duration-300">
                                        <Users className="h-12 w-12 text-black mx-auto" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="font-black text-2xl uppercase tracking-wide text-black">
                                        CREATE & JOIN<br />EASILY
                                    </h3>
                                    <div className="neo-border bg-yellow-400 p-3 transform group-hover:skew-y-3 transition-transform duration-300">
                                        <p className="text-black font-bold text-sm">
                                            INSTANT • SIMPLE • EFFECTIVE
                                        </p>
                                    </div>
                                    <p className="text-black font-bold text-base leading-relaxed">
                                        Start a new group in seconds or join an existing one. Your next study session is just a click away.
                                    </p>
                                </div>
                                
                                {/* Progress Indicators */}
                                <div className="flex justify-center gap-2">
                                    <div className="w-3 h-3 neo-border bg-yellow-400"></div>
                                    <div className="w-3 h-3 neo-border bg-yellow-300"></div>
                                    <div className="w-3 h-3 neo-border bg-yellow-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Section */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-4 neo-border-thick neo-shadow-lg bg-black p-6 transform hover:scale-105 transition-transform duration-300">
                        <div className="flex gap-2">
                            <div className="w-4 h-4 neo-border bg-green-400 animate-pulse"></div>
                            <div className="w-4 h-4 neo-border bg-cyan-400 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-4 h-4 neo-border bg-yellow-400 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                        <p className="text-white font-black uppercase text-lg">
                            READY TO TRANSFORM YOUR STUDY EXPERIENCE?
                        </p>
                        <div className="flex gap-2">
                            <div className="w-4 h-4 neo-border bg-green-400 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                            <div className="w-4 h-4 neo-border bg-cyan-400 animate-pulse" style={{animationDelay: '0.8s'}}></div>
                            <div className="w-4 h-4 neo-border bg-yellow-400 animate-pulse" style={{animationDelay: '1s'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Image Grid Section */}
        <section className="w-full py-20 md:py-32 neo-bg-muted">
            <div className="container px-6 md:px-8 max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="space-y-6">
                            <div className="neo-border-thick neo-shadow-lg bg-black p-8">
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white neo-text-shadow">
                                    COLLABORATE LIKE<br />
                                    NEVER BEFORE
                                </h2>
                            </div>
                            
                            <div className="neo-border neo-shadow bg-white p-6">
                                <p className="text-xl md:text-2xl font-black uppercase text-black leading-relaxed">
                                    FROM LATE-NIGHT CRAM SESSIONS TO WEEKLY REVIEWS, STUDYLINK PROVIDES THE PLATFORM FOR SUCCESS.
                                </p>
                            </div>
                            
                            <div className="neo-border neo-shadow neo-bg-accent p-6">
                                <p className="text-lg font-bold text-black">
                                    SHARE KNOWLEDGE • SOLVE PROBLEMS • ACHIEVE YOUR ACADEMIC GOALS TOGETHER
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="neo-border-thick neo-shadow-lg transform hover:-rotate-2 transition-transform duration-300">
                                <Image
                                    src="https://picsum.photos/400/300?1"
                                    width="400"
                                    height="300"
                                    alt="Students studying"
                                    data-ai-hint="students collaborating"
                                    className="object-cover w-full aspect-[4/3]"
                                />
                            </div>
                            <div className="neo-border-thick neo-shadow-lg transform hover:rotate-2 transition-transform duration-300">
                                <Image
                                    src="https://picsum.photos/400/300?3"
                                    width="400"
                                    height="300"
                                    alt="Student on laptop"
                                    data-ai-hint="student laptop"
                                    className="object-cover w-full aspect-[4/3]"
                                />
                            </div>
                        </div>
                        <div className="space-y-6 mt-8">
                            <div className="neo-border-thick neo-shadow-lg transform hover:rotate-1 transition-transform duration-300">
                                <Image
                                    src="https://picsum.photos/400/300?2"
                                    width="400"
                                    height="300"
                                    alt="Close up on notes"
                                    data-ai-hint="notes textbook"
                                    className="object-cover w-full aspect-[4/3]"
                                />
                            </div>
                            <div className="neo-border-thick neo-shadow-lg transform hover:-rotate-1 transition-transform duration-300">
                                <Image
                                    src="https://picsum.photos/400/300?4"
                                    width="400"
                                    height="300"
                                    alt="Group discussion"
                                    data-ai-hint="group discussion"
                                    className="object-cover w-full aspect-[4/3]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      <footer className="w-full neo-bg-primary neo-border-thick border-t-8">
          <div className="container px-6 md:px-8 max-w-7xl mx-auto py-12">
            
            {/* Main Footer Content */}
            <div className="grid lg:grid-cols-3 gap-12 mb-8">
              
              {/* Brand Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Logo />
                </div>
                <div className="neo-border neo-shadow bg-black p-4">
                  <p className="text-white font-black uppercase text-base">
                    CONNECT • COLLABORATE • SUCCEED
                  </p>
                </div>
                <p className="font-bold text-black text-sm leading-relaxed">
                  StudyLink empowers students to form meaningful study partnerships and achieve academic excellence through collaborative learning.
                </p>
              </div>

              {/* Navigation Links */}
              <div className="space-y-4">
                <div className="neo-border neo-shadow neo-bg-accent p-3">
                  <h3 className="font-black text-lg uppercase text-black">PLATFORM</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard" className="font-bold text-black hover:text-white hover:bg-black p-3 neo-border transition-all duration-200 text-center">
                    Dashboard
                  </Link>
                  <Link href="/groups" className="font-bold text-black hover:text-white hover:bg-black p-3 neo-border transition-all duration-200 text-center">
                    Find Groups
                  </Link>
                  <Link href="/dashboard/my-groups" className="font-bold text-black hover:text-white hover:bg-black p-3 neo-border transition-all duration-200 text-center">
                    My Groups
                  </Link>
                  <Link href="/dashboard/settings" className="font-bold text-black hover:text-white hover:bg-black p-3 neo-border transition-all duration-200 text-center">
                    Settings
                  </Link>
                </div>
              </div>

              {/* Contact & Social */}
              <div className="space-y-4">
                <div className="neo-border neo-shadow neo-bg-secondary p-3">
                  <h3 className="font-black text-lg uppercase text-white">CONNECT</h3>
                </div>
                
                {/* Contact */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 neo-border bg-white">
                    <Mail className="h-4 w-4 text-black" />
                    <span className="font-bold text-black text-sm">support@studylink.com</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-3 gap-2">
                  <Link href="#" className="flex items-center justify-center p-3 neo-border bg-white hover:bg-black hover:text-white transition-all duration-200">
                    <Github className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="flex items-center justify-center p-3 neo-border bg-white hover:bg-black hover:text-white transition-all duration-200">
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link href="#" className="flex items-center justify-center p-3 neo-border bg-white hover:bg-black hover:text-white transition-all duration-200">
                    <Linkedin className="h-5 w-5" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Bottom Bar */}
            <div className="neo-border-thick border-t-4 pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <p className="font-black text-black">
                    © 2025 StudyLink. All Rights Reserved.
                  </p>
                  <div className="flex gap-3">
                    <Link href="#" className="font-bold text-black hover:text-white hover:bg-black px-3 py-1 neo-border transition-all duration-200 text-sm">
                      Terms
                    </Link>
                    <Link href="#" className="font-bold text-black hover:text-white hover:bg-black px-3 py-1 neo-border transition-all duration-200 text-sm">
                      Privacy
                    </Link>
                    <Link href="#" className="font-bold text-black hover:text-white hover:bg-black px-3 py-1 neo-border transition-all duration-200 text-sm">
                      Support
                    </Link>
                  </div>
                </div>

                <div className="neo-border neo-shadow bg-black px-4 py-2">
                  <p className="text-white font-black uppercase text-xs">
                    Built for Students
                  </p>
                </div>

              </div>
            </div>

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
