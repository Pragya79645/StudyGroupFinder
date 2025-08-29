'use client';

import { GroupChat } from '@/components/group-chat';
import { GroupCalendar } from '@/components/group-calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGroupSnapshot, getUsersByIds, leaveGroup } from '@/lib/firebase-service';
import type { Group, User } from '@/lib/types';
import { Calendar, LogOut, MessageSquare, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function GroupPage({ params }: { params: { id: string } }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = getGroupSnapshot(params.id, async (groupData) => {
      setLoading(true);
      if (groupData) {
        setGroup(groupData);
        const memberData = await getUsersByIds(groupData.memberIds);
        setMembers(memberData);
      } else {
        setGroup(null);
        setMembers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [params.id]);

  const handleLeaveGroup = async () => {
    if (!user || !group) return;
    try {
      await leaveGroup(group.id, user.id);
      toast({ title: 'You have left the group.' });
      router.push('/dashboard/my-groups');
    } catch(e) {
      toast({ variant: 'destructive', title: 'Failed to leave group.' });
    }
  }
  
  const isMember = user && group?.memberIds.includes(user.id);

  if (loading) {
    return <div>Loading group...</div>;
  }

  if (!group) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-2xl font-bold">Group not found</h1>
            <p className="text-muted-foreground">The group you are looking for does not exist.</p>
            <Link href="/dashboard" className="mt-4 text-primary underline">Return to Dashboard</Link>
        </div>
    )
  }
  
  if (!isMember && !loading) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground max-w-md mx-auto mt-2">You are not a member of this group. Join the group to view its content and participate in the chat.</p>
            <Button asChild className="mt-6">
                <Link href="/dashboard">Find Groups to Join</Link>
            </Button>
        </div>
    )
  }


  return (
     <div className="flex flex-col h-[calc(100vh-4rem)]">
        <header className="flex items-center justify-between p-4 border-b">
            <div>
                <h1 className="text-xl font-bold">{group.name}</h1>
                <p className="text-sm text-muted-foreground">{group.subject}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center -space-x-2">
                    {members.slice(0, 5).map(member => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                            <AvatarImage src={member.avatarUrl} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                    ))}
                    {members.length > 5 && (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                            +{members.length - 5}
                        </div>
                    )}
                    <Users className="ml-4 h-5 w-5 text-muted-foreground" />
                    <span className="ml-1 text-sm text-muted-foreground">{members.length}</span>
                </div>
                {isMember && group.ownerId !== user.id && (
                    <Button variant="destructive" size="sm" onClick={handleLeaveGroup}>
                        <LogOut className="mr-2 h-4 w-4" /> Leave
                    </Button>
                )}
            </div>
        </header>

         <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <div className="px-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat"><MessageSquare className="mr-2 h-4 w-4"/>Chat</TabsTrigger>
                    <TabsTrigger value="calendar"><Calendar className="mr-2 h-4 w-4"/>Calendar</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="chat" className="flex-1 flex flex-col">
                <GroupChat
                    group={group}
                    members={members}
                />
            </TabsContent>
            <TabsContent value="calendar" className="flex-1 flex flex-col overflow-y-auto">
                 <GroupCalendar
                    group={group}
                    members={members}
                />
            </TabsContent>
        </Tabs>
    </div>
  );
}
