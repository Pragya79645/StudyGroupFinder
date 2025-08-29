'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { getStudyTips } from '@/actions/groups';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '../ui/scroll-area';

export function AiAssistant({ subject }: { subject: string }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSuggestions = async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);

    const result = await getStudyTips(subject);

    if (result.error) {
      setError(result.error);
    } else {
      setSuggestion(result.suggestions);
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-accent" />
          AI Study Assistant
        </CardTitle>
        <CardDescription>Get instant help for your subject.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetSuggestions} disabled={loading} className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          {loading ? 'Generating...' : `Generate Tips for ${subject}`}
        </Button>
        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        )}
        {error && <p className="text-destructive text-sm">{error}</p>}
        {suggestion && (
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
             <pre className="text-sm whitespace-pre-wrap font-body">{suggestion}</pre>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
