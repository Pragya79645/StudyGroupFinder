'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getGroupSuggestions } from '@/actions/groups';
import type { SuggestGroupMatchesOutput } from '@/ai/flows/suggest-group-matches';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Mock data for existing groups
const allGroups = [
  { id: '1', name: 'Calculus Crew' },
  { id: '2',name: 'Physics Phantoms' },
  { id: '3', name: 'Data Structures Alliance' },
  { id: '4', name: 'History Buffs' },
  { id: '5', name: 'ChemE Connections' },
];

export function GroupSuggestions() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SuggestGroupMatchesOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const result = await getGroupSuggestions({
          subjects: user.subjects,
          skills: user.skills,
          availability: user.availability,
          tags: user.tags,
          existingGroups: allGroups.map(g => g.name),
        });

        if ('error' in result) {
          setError(result.error);
        } else {
          setSuggestions(result);
        }
      } catch (e) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-accent" />
          AI-Powered Group Suggestions
        </CardTitle>
        <CardDescription>
          Based on your profile, here are some groups you might be interested in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {suggestions && (
          <div className="space-y-4">
            {suggestions.suggestedGroups.length > 0 ? (
              <ul className="grid gap-4 md:grid-cols-2">
                {suggestions.suggestedGroups.map((groupName) => {
                  const group = allGroups.find(g => g.name === groupName);
                  if (!group) return null;
                  return (
                    <li key={group.id} className="border p-4 rounded-lg flex items-center justify-between">
                      <span className="font-semibold">{group.name}</span>
                       <Button variant="secondary" size="sm" asChild>
                        <Link href={`/dashboard/groups/${group.id}`}>
                            View <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            ) : (
                 <div className="text-center text-muted-foreground py-4">
                    <p>No specific group suggestions for you right now.</p>
                    <Button asChild className="mt-4" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        <Link href="/dashboard/groups/create">Create a New Group</Link>
                    </Button>
                </div>
            )}
            <div className="text-sm text-muted-foreground p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold mb-1">Reasoning:</p>
              <p>{suggestions.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
