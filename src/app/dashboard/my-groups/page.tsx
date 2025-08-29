'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getGroups, leaveGroup } from '@/lib/firebase-service';
import type { Group } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Users, BookOpen, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function MyGroupsPage() {
    const { user } = useAuth();
    const [myGroups, setMyGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchGroups = useCallback(async () => {
        if (user) {
            setLoading(true);
            const allGroups = await getGroups();
            const userGroups = allGroups.filter(group => group.memberIds.includes(user.id));
            setMyGroups(userGroups);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    if (loading) {
        return <div>Loading your groups...</div>
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">My Groups</h1>
                <p className="text-muted-foreground">All the groups you are a member of.</p>
            </div>

            {myGroups.length > 0 ? (
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {myGroups.map(group => (
                        <GroupCard key={group.id} group={group} onGroupLeft={fetchGroups} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">You haven't joined any groups yet.</h3>
                    <p className="text-muted-foreground mt-2 mb-4">Find a group to join on your dashboard.</p>
                    <Button asChild>
                        <Link href="/dashboard">Browse Groups</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

function GroupCard({ group, onGroupLeft }: { group: Group, onGroupLeft: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);
  
  const handleLeaveGroup = async () => {
    if (!user) return;
    setIsLeaving(true);
    try {
        await leaveGroup(group.id, user.id);
        toast({ title: 'You have left the group.' });
        onGroupLeft();
    } catch(e) {
        toast({ variant: 'destructive', title: 'Failed to leave group.' });
    } finally {
        setIsLeaving(false);
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{group.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {group.subject}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 h-[40px]">
            {group.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {group.memberIds.length} member{group.memberIds.length > 1 ? 's' : ''}
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/groups/${group.id}`}>View</Link>
          </Button>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" disabled={isLeaving}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to leave this group?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will lose access to the group chat and its content. This action cannot be undone.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLeaveGroup} disabled={isLeaving}>
                        {isLeaving ? 'Leaving...' : 'Leave Group'}
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
