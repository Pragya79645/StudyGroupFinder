'use client';

import { useState, useRef, useEffect } from 'react';
import type { Group, Message, User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Send, Sparkles, Files, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { MarkdownRenderer } from './ui/markdown-renderer';
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
  const [autoSuggestionsEnabled, setAutoSuggestionsEnabled] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { user: currentUser } = useAuth();
  const usersById = Object.fromEntries(members.map(user => [user.id, user]));

  const checkForAutoSuggestions = (newMessages: Message[]) => {
    if (isAiLoading || isSummarizing) return;
    
    const recentMessages = newMessages
      .filter(m => !m.isAIMessage)
      .slice(-5) // Check last 5 user messages
      .map(m => m.text.toLowerCase());
    
    // Keywords that might indicate students need help
    const helpKeywords = [
      'confused', 'don\'t understand', 'help', 'stuck', 'difficult', 'hard',
      'question', '?', 'how do', 'what is', 'explain', 'clarify', 'lost'
    ];
    
    const hasHelpRequest = recentMessages.some(message => 
      helpKeywords.some(keyword => message.includes(keyword))
    );
    
    if (hasHelpRequest) {
      // Wait a bit before auto-suggesting to avoid spam
      setTimeout(() => {
        if (!isAiLoading) {
          handleGetAiSuggestion();
        }
      }, 10000); // 10 seconds delay
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (group.id) {
      const unsubscribe = getGroupMessages(group.id, (newMessages) => {
        setMessages(newMessages);
        
        // Check if we should auto-trigger suggestions
        if (autoSuggestionsEnabled && newMessages.length > 0) {
          checkForAutoSuggestions(newMessages);
        }
      });
      return () => unsubscribe();
    }
  }, [group.id, autoSuggestionsEnabled]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUser) return;

    await sendMessage(group.id, currentUser.id, newMessage);
    setNewMessage('');
  };

  const handleGetAiSuggestion = async () => {
    setIsAiLoading(true);
    try {
      // Get recent chat history for context (last 15 messages, excluding AI messages)
      const recentChatHistory = messages
        .filter(m => !m.isAIMessage && m.text.trim().length > 0)
        .slice(-15) // Last 15 messages for context
        .map(m => {
          const userName = usersById[m.userId]?.name || 'Former Member';
          const messageTime = m.timestamp instanceof Timestamp
            ? m.timestamp.toDate()
            : new Date(m.timestamp);
          return `[${format(messageTime, 'HH:mm')}] ${userName}: ${m.text}`;
        });

      const response = await fetch('/api/genkit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'aiStudySuggestions',
          data: { 
            studyTopic: group.subject,
            chatHistory: recentChatHistory.length > 0 ? recentChatHistory : undefined
          }
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to get AI suggestions');
      }
      
      // Format the message based on resource type
      const resourceTypeEmoji: Record<string, string> = {
        practice_problems: '📝',
        concept_review: '📚',
        external_resources: '🔗',
        qa_help: '❓',
        study_plan: '📋'
      };
      
      const emoji = resourceTypeEmoji[result.result.resourceType] || '💡';
      
      // Build the message with clickable links
      let messageText = recentChatHistory.length > 0 
        ? `**${emoji} Contextual Study Suggestion:**\n\n${result.result.suggestions}`
        : `**${emoji} Study Suggestion:**\n\n${result.result.suggestions}`;
      
      // Add clickable links if provided
      if (result.result.links && result.result.links.length > 0) {
        messageText += '\n\n**📚 Helpful Resources:**\n';
        result.result.links.forEach((link: any, index: number) => {
          messageText += `${index + 1}. [${link.title}](${link.url})\n   *${link.description}*\n\n`;
        });
      }
      
      messageText += recentChatHistory.length > 0 
        ? '\n*Based on your recent discussion*'
        : '';
      
      // The message is sent to Firestore and will be displayed via the onSnapshot listener.
      await sendMessage(group.id, 'ai-assistant', messageText, true);
      
      toast({
        title: 'AI Suggestion Generated',
        description: `${recentChatHistory.length > 0 ? 'Context-aware' : 'General'} study suggestions have been added to the chat.`,
      });
    } catch (error) {
      console.error('AI suggestion failed:', error);
      toast({
        variant: 'destructive',
        title: 'AI Assistant Error',
        description: error instanceof Error ? error.message : 'Could not fetch study suggestions at this time.',
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
      // Filter out AI messages and format the chat history
      const chatHistory = messages
        .filter(m => !m.isAIMessage && m.text.trim().length > 0) // Don't include AI messages and empty messages
        .slice(-50) // Only take the last 50 messages to avoid token limits
        .map(m => {
            const userName = usersById[m.userId]?.name || 'Former Member';
            const messageTime = m.timestamp instanceof Timestamp
              ? m.timestamp.toDate()
              : new Date(m.timestamp);
            return `[${format(messageTime, 'MMM dd, HH:mm')}] ${userName}: ${m.text}`;
        });

      if (chatHistory.length === 0) {
        toast({
          title: 'No messages to summarize',
          description: 'There are no user messages in this chat to summarize.',
        });
        return;
      }

      console.log('Sending chat history for summarization:', chatHistory);
      
      const response = await fetch('/api/genkit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'summarizeChat',
          data: { history: chatHistory }
        }),
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate summary');
      }
      
      console.log('Received summary:', result.result);
      
      // Send the summary as an AI message
      await sendMessage(
        group.id, 
        'ai-assistant', 
        `**📝 Chat Summary**\n\n${result.result.summary}\n\n*Summary generated from the last ${chatHistory.length} messages*`, 
        true
      );
      
      toast({
        title: 'Chat Summary Generated',
        description: `Successfully summarized ${chatHistory.length} messages.`,
      });
      
    } catch (error) {
      console.error('AI summarization failed:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: error instanceof Error ? error.message : 'Could not summarize the chat at this time.',
      });
    } finally {
      setIsSummarizing(false);
    }
  };


  if (!currentUser) return null;


  return (
    <div className="flex-1 flex flex-col neo-border-thick neo-bg-cyan">
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
        {messages.map((message) => {
          const user = usersById[message.userId];
          const isCurrentUser = message.userId === currentUser.id;
          const isAI = message.isAIMessage;
          
          const messageTimestamp = message.timestamp instanceof Timestamp
            ? message.timestamp.toDate()
            : new Date(message.timestamp);


          if (isAI) {
            return (
              <Card key={message.id} className="neo-bg-magenta border-8 border-black">
                <CardContent className="p-6">
                   <div className="flex items-center gap-3 mb-3">
                     <Sparkles className="h-6 w-6 text-white" />
                     <h3 className="font-black text-xl text-white uppercase tracking-wide">AI ASSISTANT</h3>
                   </div>
                   <MarkdownRenderer 
                     content={message.text} 
                     className="text-sm font-bold text-white"
                   />
                </CardContent>
              </Card>
            )
          }

          if (!user) {
             // Render a message for a user who is no longer in the group
             if (message.userId !== 'ai-assistant') {
                return (
                  <div key={message.id} className="text-sm text-black text-center font-black py-4 neo-bg-muted neo-border">
                    ⚠️ MESSAGE FROM FORMER MEMBER ⚠️
                  </div>
                )
             }
             return null;
          }


          return (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-4',
                isCurrentUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!isCurrentUser && (
                <Avatar className="h-12 w-12 neo-border">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="font-black text-lg neo-bg-accent">{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                  "max-w-xs md:max-w-md p-4 neo-border neo-shadow font-bold",
                  isCurrentUser ? 'neo-bg-primary text-white' : 'neo-bg-secondary text-white'
              )}>
                {!isCurrentUser && <p className="text-sm font-black mb-2 uppercase tracking-wide">{user.name}</p>}
                <p className="text-base font-bold">{message.text}</p>
                <p className={cn("text-xs mt-2 font-bold uppercase", isCurrentUser ? "text-white/80" : "text-white/80")}>
                  {format(messageTimestamp, 'p')}
                </p>
              </div>
               {isCurrentUser && (
                <Avatar className="h-12 w-12 neo-border">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="font-black text-lg neo-bg-accent">{user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
      <div className="p-6 neo-border-thick neo-bg-muted">
        <form onSubmit={handleSendMessage} className="relative">
          <Textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="TYPE YOUR MESSAGE..."
            className="pr-44 min-h-[80px] font-black text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <div className="absolute top-4 right-4 flex gap-2">
             <Button 
               type="button" 
               size="sm" 
               variant={autoSuggestionsEnabled ? "accent" : "outline"} 
               onClick={() => setAutoSuggestionsEnabled(!autoSuggestionsEnabled)} 
               title={`AUTO AI SUGGESTIONS: ${autoSuggestionsEnabled ? 'ON' : 'OFF'}`}
               className="text-xs"
             >
                <Bot className="h-4 w-4" />
                AUTO
             </Button>
             <Button type="button" size="sm" variant="cyan" onClick={handleSummarizeChat} disabled={isSummarizing} title="SUMMARIZE CHAT" className="text-xs">
                <Files className={cn("h-4 w-4", isSummarizing && "animate-spin")} />
                SUMMARY
             </Button>
             <Button type="button" size="sm" variant="magenta" onClick={handleGetAiSuggestion} disabled={isAiLoading} title="GET AI STUDY SUGGESTION" className="text-xs">
                <Sparkles className={cn("h-4 w-4", isAiLoading && "animate-spin")} />
                SUGGEST
             </Button>
            <Button type="submit" size="sm" variant="default" title="SEND MESSAGE" className="text-xs">
              <Send className="h-4 w-4" />
              SEND
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
