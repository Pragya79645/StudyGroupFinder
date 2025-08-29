'use client';

import { useState, useRef, useEffect } from 'react';
import type { Group, Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Send, Sparkles, Files } from 'lucide-react';
import { aiStudySuggestions } from '@/ai/flows/ai-study-suggestions';
import { summarizeChat } from '@/ai/flows/ai-chat-summarizer';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { useAuth } from '@/hooks/use-auth';
import { sendMessage, getGroupMessages } from '@/lib/firebase-service';
import { Timestamp } from 'firebase/firestore';

interface GroupChatProps {
  group: Group;
  members: User[];
}

export function GroupChat({ group, members }: GroupChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = useAuth();
  const usersById = Object.fromEntries(members.map(user => [user.id, user]));

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (group.id) {
      const unsubscribe = getGroupMessages(group.id, setMessages);
      return () => unsubscribe();
    }
  }, [group.id]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    await sendMessage(group.id, currentUser.id, newMessage);
    setNewMessage('');
  };

  const handleGetAiSuggestion = async () => {
    setIsAiLoading(true);
    try {
      const result = await aiStudySuggestions({ studyTopic: group.subject });
      // The message is sent to Firestore and will be displayed via the onSnapshot listener.
      await sendMessage(group.id, 'ai-assistant', `**Suggestion:** ${result.suggestions}`, true);
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: 'Could not fetch study suggestions at this time.',
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleSummarizeChat = async () => {
    if(messages.length < 5){
       toast({
        title: 'Not enough messages',
        description: 'Need at least 5 messages to generate a summary.',
      });
      return;
    }
    setIsSummarizing(true);
    try {
      const chatHistory = messages
        .filter(m => !m.isAIMessage) // Don't include AI messages in summary
        .map(m => {
            const userName = usersById[m.userId]?.name || 'Former Member';
            return `${userName}: ${m.text}`
        });

      const result = await summarizeChat({ history: chatHistory });
      await sendMessage(group.id, 'ai-assistant', `**Summary:**\n${result.summary}`, true);
    } catch (error) {
      console.error('AI summarization failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: 'Could not summarize the chat at this time.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };


  if (!currentUser) return null;


  return (
    <div className="flex-1 flex flex-col">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const user = usersById[message.userId];
          const isCurrentUser = message.userId === currentUser.id;
          const isAI = message.isAIMessage;
          
          const messageTimestamp = message.timestamp instanceof Timestamp
            ? message.timestamp.toDate()
            : new Date(message.timestamp);


          if (isAI) {
            return (
              <Card key={message.id} className="bg-secondary/50 border-primary/50">
                <CardContent className="p-4">
                   <div className="flex items-center gap-2 mb-2">
                     <Sparkles className="h-5 w-5 text-primary" />
                     <h3 className="font-semibold text-primary">AI Assistant</h3>
                   </div>
                   <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </CardContent>
              </Card>
            )
          }

          if (!user) {
             // Render a message for a user who is no longer in the group
             if (message.userId !== 'ai-assistant') {
                return (
                  <div key={message.id} className="text-xs text-muted-foreground text-center italic py-2">
                    A message from a former member.
                  </div>
                )
             }
             return null;
          }


          return (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                  "max-w-xs md:max-w-md p-3 rounded-lg",
                  isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-secondary'
              )}>
                {!isCurrentUser && <p className="text-xs font-semibold mb-1">{user.name}</p>}
                <p className="text-sm">{message.text}</p>
                <p className={cn("text-xs mt-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {format(messageTimestamp, 'p')}
                </p>
              </div>
               {isCurrentUser && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="pr-36 min-h-[50px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-1">
             <Button type="button" size="icon" variant="ghost" onClick={handleSummarizeChat} disabled={isSummarizing} title="Summarize Chat">
                <Files className={cn("h-5 w-5", isSummarizing && "animate-spin")} />
             </Button>
             <Button type="button" size="icon" variant="ghost" onClick={handleGetAiSuggestion} disabled={isAiLoading} title="Get AI Study Suggestion">
                <Sparkles className={cn("h-5 w-5", isAiLoading && "animate-spin")} />
             </Button>
            <Button type="submit" size="icon" title="Send Message">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
