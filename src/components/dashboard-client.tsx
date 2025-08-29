'use client';

import type { Group, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { createGroup, joinGroup } from '@/lib/firebase-service';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

interface DashboardClientProps {
  recommendedGroups: Group[];
  allGroups: Group[];
  loading: boolean;
  onGroupJoined: () => void;
  user: User | null;
}

export function DashboardClient({
  recommendedGroups,
  allGroups,
  loading,
  onGroupJoined,
  user,
}: DashboardClientProps) {
  const { toast } = useToast();
  const router = useRouter();

  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateGroup = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You must be logged in to create a group.' });
      return;
    }
    if (!groupName || !subject || !description) {
      toast({ variant: 'destructive', title: 'Please fill out all fields.' });
      return;
    }

    setIsCreating(true);
    try {
      const newGroupId = await createGroup({
        name: groupName,
        subject,
        description,
        ownerId: user.id,
        memberIds: [user.id],
      });
      toast({ title: 'Group created successfully!' });
      // Reset form
      setGroupName('');
      setSubject('');
      setDescription('');
      setIsDialogOpen(false);
      onGroupJoined();
      // Route to the new group page
      router.push(`/groups/${newGroupId}`);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to create group.' });
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };


  return (
    <div className="space-y-12">
      {/* Create Group Section - Floating Card */}
      <div className="flex justify-end">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-red-400 neo-border-thick transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="relative neo-border-thick neo-shadow-lg bg-white p-6 transform group-hover:-rotate-2 transition-transform duration-300 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="neo-border bg-black p-3">
                    <PlusCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl uppercase text-black">CREATE NEW GROUP</h3>
                    <p className="font-bold text-sm text-gray-600">START YOUR STUDY JOURNEY</p>
                  </div>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] neo-border-thick bg-white">
              <DialogHeader>
                <div className="neo-border bg-purple-400 p-3 mb-4">
                  <DialogTitle className="font-black uppercase text-white">CREATE NEW STUDY GROUP</DialogTitle>
                </div>
                <DialogDescription className="font-bold text-black">
                  Fill in the details below to start a new group.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-black uppercase text-black">Group Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Final Exam Prep" 
                    className="neo-border font-bold"
                    value={groupName} 
                    onChange={(e) => setGroupName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="font-black uppercase text-black">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="e.g., Computer Science" 
                    className="neo-border font-bold"
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="font-black uppercase text-black">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="A brief description of your group's goals." 
                    className="neo-border font-bold"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                  />
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="neo-border font-black">
                  CANCEL
                </Button>
                <Button onClick={handleCreateGroup} disabled={isCreating} className="neo-border bg-green-400 hover:bg-green-500 text-black font-black">
                  {isCreating ? 'CREATING...' : 'CREATE GROUP'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Smart Recommendations - Diagonal Layout */}
      <section className="relative">
        <div className="relative mb-8">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-400 neo-border-thick transform -rotate-1"></div>
          <div className="relative neo-border-thick neo-shadow-lg bg-black p-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white neo-text-shadow flex items-center gap-4">
              <div className="neo-border bg-cyan-400 p-2">
                <span className="text-2xl">🧠</span>
              </div>
              SMART RECOMMENDATIONS
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="neo-border-thick bg-gray-200 h-64 animate-pulse transform rotate-1"></div>
            <div className="neo-border-thick bg-gray-200 h-64 animate-pulse transform -rotate-1"></div>
            <div className="neo-border-thick bg-gray-200 h-64 animate-pulse transform rotate-2"></div>
          </div>
        ) : recommendedGroups.length > 0 ? (
          <div className="space-y-8">
            {recommendedGroups.map((group, index) => (
              <div key={group.id} className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`w-full max-w-md transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:scale-105 transition-all duration-300`}>
                  <RecommendedGroupCard group={group} user={user} onGroupJoined={onGroupJoined} index={index} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-border-thick bg-yellow-400 p-8 transform rotate-1">
            <p className="font-black text-black text-center text-lg uppercase">
              NO RECOMMENDATIONS RIGHT NOW!<br />
              <span className="text-sm">Try updating your profile or creating a group!</span>
            </p>
          </div>
        )}
      </section>

      {/* Browse All Groups - Masonry Style */}
      <section className="relative">
        <div className="relative mb-8">
          <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-pink-400 neo-border-thick transform rotate-2"></div>
          <div className="relative neo-border-thick neo-shadow-lg bg-black p-6">
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white neo-text-shadow flex items-center gap-4">
              <div className="neo-border bg-purple-400 p-2">
                <span className="text-2xl">🌍</span>
              </div>
              BROWSE ALL GROUPS
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`neo-border-thick bg-gray-200 animate-pulse transform ${i % 3 === 0 ? 'rotate-1' : i % 3 === 1 ? '-rotate-1' : 'rotate-2'}`} style={{ height: `${200 + Math.random() * 100}px` }}></div>
            ))}
          </div>
        ) : allGroups.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {allGroups.map((group, index) => (
              <div key={group.id} className="break-inside-avoid">
                <BrowseGroupCard group={group} user={user} onGroupJoined={onGroupJoined} index={index} />
              </div>
            ))}
          </div>
        ) : (
          <div className="neo-border-thick bg-green-400 p-8 transform -rotate-1">
            <p className="font-black text-black text-center text-lg uppercase">
              NO GROUPS CREATED YET!<br />
              <span className="text-sm">Be the first to start a study group!</span>
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function RecommendedGroupCard({ group, user, onGroupJoined, index }: { group: Group, user: User | null, onGroupJoined: () => void, index: number }) {
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  if (!user) return null;

  const isMember = group.memberIds.includes(user.id);
  const colors = ['bg-green-400', 'bg-cyan-400', 'bg-yellow-400', 'bg-purple-400', 'bg-pink-400'];
  const bgColor = colors[index % colors.length];

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinGroup(group.id, user.id);
      toast({ title: 'Successfully joined group!' });
      onGroupJoined();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to join group.' });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="relative group">
      <div className={`absolute -inset-2 ${bgColor} neo-border-thick transform rotate-2 group-hover:rotate-6 transition-transform duration-300`}></div>
      <div className="relative neo-border-thick neo-shadow-lg bg-white p-6 transform group-hover:-rotate-1 transition-transform duration-300">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="neo-border bg-black p-2">
              <span className="text-xl">⭐</span>
            </div>
            <div className={`neo-border ${bgColor} px-3 py-1`}>
              <span className="font-black text-sm text-black uppercase">AI PICK</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-black text-xl text-black uppercase mb-2">{group.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-4 w-4 text-black" />
              <span className="font-bold text-black">{group.subject}</span>
            </div>
          </div>
          
          <div className="neo-border bg-black p-3">
            <p className="text-white font-bold text-sm">{group.description}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-black" />
              <span className="font-black text-black">{group.memberIds.length} MEMBERS</span>
            </div>
            {isMember ? (
              <Button asChild className="neo-border bg-green-400 hover:bg-green-500 text-black font-black">
                <Link href={`/groups/${group.id}`}>VIEW GROUP</Link>
              </Button>
            ) : (
              <Button onClick={handleJoin} disabled={isJoining} className="neo-border bg-cyan-400 hover:bg-cyan-500 text-black font-black">
                {isJoining ? 'JOINING...' : 'JOIN NOW'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrowseGroupCard({ group, user, onGroupJoined, index }: { group: Group, user: User | null, onGroupJoined: () => void, index: number }) {
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  if (!user) return null;

  const isMember = group.memberIds.includes(user.id);
  const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-0'];
  const colors = ['bg-orange-400', 'bg-teal-400', 'bg-rose-400', 'bg-indigo-400', 'bg-lime-400'];
  const rotation = rotations[index % rotations.length];
  const bgColor = colors[index % colors.length];

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinGroup(group.id, user.id);
      toast({ title: 'Successfully joined group!' });
      onGroupJoined();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to join group.' });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className={`mb-6 transform ${rotation} hover:scale-105 hover:rotate-0 transition-all duration-300 group`}>
      <div className="relative">
        <div className={`absolute -inset-1 ${bgColor} neo-border transform rotate-3 group-hover:rotate-6 transition-transform duration-300`}></div>
        <Card className="relative neo-border-thick bg-white">
          <CardHeader className="space-y-3">
            <div className="flex items-center justify-between">
              <div className={`neo-border ${bgColor} p-2`}>
                <BookOpen className="h-5 w-5 text-black" />
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-black" />
                <span className="font-black text-xs text-black">{group.memberIds.length}</span>
              </div>
            </div>
            <CardTitle className="font-black uppercase text-black text-lg">{group.name}</CardTitle>
            <CardDescription className="font-bold text-black">
              {group.subject}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="neo-border bg-gray-100 p-3">
              <p className="text-sm font-bold text-black line-clamp-3">
                {group.description}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            {isMember ? (
              <Button asChild className="w-full neo-border bg-green-400 hover:bg-green-500 text-black font-black">
                <Link href={`/groups/${group.id}`}>VIEW</Link>
              </Button>
            ) : (
              <Button onClick={handleJoin} disabled={isJoining} className="w-full neo-border bg-purple-400 hover:bg-purple-500 text-black font-black">
                {isJoining ? 'JOINING...' : 'JOIN'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function GroupCard({ group, user, onGroupJoined }: { group: Group, user: User | null, onGroupJoined: () => void }) {
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  if (!user) return null;

  const isMember = group.memberIds.includes(user.id);

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      await joinGroup(group.id, user.id);
      toast({ title: 'Successfully joined group!' });
      onGroupJoined();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to join group.' });
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="truncate">{group.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {group.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 h-[40px]">
            {group.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''}
        </div>
        {isMember ? (
            <Button asChild>
                <Link href={`/groups/${group.id}`}>View</Link>
            </Button>
        ) : (
            <Button onClick={handleJoin} disabled={isJoining}>
                {isJoining ? 'Joining...' : 'Join'}
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
