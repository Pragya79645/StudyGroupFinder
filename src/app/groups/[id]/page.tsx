'use client';

import { GroupChat } from '@/components/group-chat';
import { GroupCalendar } from '@/components/group-calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getGroupSnapshot, getUsersByIds, leaveGroup } from '@/lib/firebase-service';
import type { Group, User } from '@/lib/types';
import { Calendar, LogOut, MessageSquare, Users, Menu } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function GroupPage({ params }: { params: { id: string } }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'chat' | 'calendar'>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
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
     <div className="flex h-[calc(100vh-4rem)]">
        {/* Mobile Header */}
        <div className="md:hidden absolute top-0 left-0 right-0 z-50 bg-neo-yellow border-b-4 border-black p-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-black">{group.name}</h1>
            <p className="text-sm font-medium text-black/70">{group.subject}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="border-3 border-black bg-white hover:bg-neo-green"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar */}
        <div className={cn(
          "w-64 bg-neo-yellow border-r-4 border-black flex flex-col transition-transform duration-300 z-40",
          "md:relative md:translate-x-0",
          sidebarOpen ? "absolute inset-y-0 left-0 translate-x-0" : "absolute inset-y-0 left-0 -translate-x-full md:translate-x-0"
        )}>
          {/* Group Header */}
          <div className="p-6 border-b-4 border-black bg-neo-cyan mt-16 md:mt-0">
            <div className="md:block hidden">
              <h1 className="text-xl font-bold text-black">{group.name}</h1>
              <p className="text-sm font-medium text-black/70">{group.subject}</p>
            </div>
            
            {/* Members Section */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-black" />
                <span className="text-sm font-semibold text-black">{members.length} Members</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.slice(0, 8).map(member => (
                  <Avatar key={member.id} className="h-6 w-6 border-2 border-black">
                    <AvatarImage src={member.avatarUrl} alt={member.name} />
                    <AvatarFallback className="text-xs bg-white text-black">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {members.length > 8 && (
                  <div className="h-6 w-6 rounded-full bg-white border-2 border-black flex items-center justify-center text-xs font-bold text-black">
                    +{members.length - 8}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 p-4">
            <nav className="space-y-2">
              <button
                onClick={() => {
                  setActiveView('chat');
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg border-3 border-black font-bold transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                  activeView === 'chat'
                    ? "bg-neo-magenta text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black hover:bg-neo-green"
                )}
              >
                <MessageSquare className="h-5 w-5" />
                Chat
              </button>
              
              <button
                onClick={() => {
                  setActiveView('calendar');
                  setSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg border-3 border-black font-bold transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                  activeView === 'calendar'
                    ? "bg-neo-magenta text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-white text-black hover:bg-neo-green"
                )}
              >
                <Calendar className="h-5 w-5" />
                Calendar
              </button>
            </nav>
          </div>
          
          {/* Leave Group Button */}
          {isMember && group.ownerId !== user.id && (
            <div className="p-4 border-t-4 border-black">
              <Button 
                variant="destructive" 
                className="w-full border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
                onClick={handleLeaveGroup}
              >
                <LogOut className="mr-2 h-4 w-4" /> 
                Leave Group
              </Button>
            </div>
          )}
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col mt-20 md:mt-0">
          {activeView === 'chat' && (
            <GroupChat
              group={group}
              members={members}
            />
          )}
          {activeView === 'calendar' && (
            <div className="flex-1 overflow-y-auto">
              <GroupCalendar
                group={group}
                members={members}
              />
            </div>
          )}
        </div>
    </div>
  );
}
