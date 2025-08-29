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
    <>
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Study Group</DialogTitle>
              <DialogDescription>
                Fill in the details below to start a new group.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Group Name
                </Label>
                <Input id="name" placeholder="e.g., Final Exam Prep" className="col-span-3" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">
                  Subject
                </Label>
                <Input id="subject" placeholder="e.g., Computer Science" className="col-span-3" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
               <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" placeholder="A brief description of your group's goals." className="col-span-3" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" onClick={handleCreateGroup} disabled={isCreating}>
                  {isCreating ? 'Creating...' : 'Create Group'}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight font-headline mb-4">
          Smart Recommendations
        </h2>
        {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>
        ) : recommendedGroups.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedGroups.map(group => (
                <GroupCard key={group.id} group={group} user={user} onGroupJoined={onGroupJoined} />
            ))}
            </div>
        ) : (
            <p className="text-muted-foreground">No recommendations for you right now. Try updating your profile or creating a group!</p>
        )}
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold tracking-tight font-headline mb-4">
          Browse All Groups
        </h2>
        {loading ? (
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
            </div>
        ) : allGroups.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allGroups.map(group => (
                <GroupCard key={group.id} group={group} user={user} onGroupJoined={onGroupJoined} />
            ))}
            </div>
        ) : (
            <p className="text-muted-foreground">No groups have been created yet. Be the first!</p>
        )}
      </section>
    </>
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
