
'use client';
import { DashboardClient } from '@/components/dashboard-client';
import { suggestGroups } from '@/ai/flows/ai-smart-matching';
import type { Group, User } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState, useCallback } from 'react';
import { getGroups } from '@/lib/firebase-service';
import { OnboardingModal } from '@/components/onboarding-modal';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [recommendedGroups, setRecommendedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const fetchGroupsAndRecommendations = useCallback(async () => {
    if (user) {
      setLoading(true);
      setError(null);
      try {
        const groups = await getGroups();
        setAllGroups(groups);

        // Only run recommendations if the user has some interests set
        if (groups.length > 0 && user.subjects.length > 0) {
          try {
            const groupInfoForAI = groups.map(g => ({
              name: g.name,
              subject: g.subject,
              description: g.description
            }));

            const recommendations = await suggestGroups({
              subjects: user.subjects,
              skills: user.skills,
              availability: user.availability,
              existingGroups: groupInfoForAI,
            });

            const recGroups = groups.filter(g =>
              recommendations.suggestedGroups.includes(g.name)
            );
            setRecommendedGroups(recGroups);
          } catch (aiError) {
            console.error('AI Smart Matching failed:', aiError);
            setError('Could not load AI recommendations. Displaying some available groups.');
            // Fallback: show the first 3 groups if AI fails
            setRecommendedGroups(groups.slice(0, 3));
          }
        } else {
          setRecommendedGroups([]);
        }
      } catch (e) {
        console.error('Failed to fetch groups', e);
        setError('Could not load groups. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Check if user has completed onboarding
      if (user.subjects.length === 0 && user.skills.length === 0) {
        setShowOnboarding(true);
      }
      fetchGroupsAndRecommendations();
    }
  }, [user, fetchGroupsAndRecommendations]);

  const handleGroupJoined = () => {
    // Re-fetch groups to update membership status on cards and re-evaluate recommendations
    if (user) {
      fetchGroupsAndRecommendations();
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Re-fetch recommendations with new profile info
    fetchGroupsAndRecommendations();
  }

  if (authLoading || (!user && !authLoading)) {
    return <div>Loading dashboard...</div>;
  }
  
  return (
    <div className="flex flex-col gap-8">
      {user && <OnboardingModal user={user} isOpen={showOnboarding} onSave={handleOnboardingComplete} />}
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">Here's what's happening in your study world.</p>
      </div>
      {error && <p className="text-destructive">{error}</p>}
      <DashboardClient
        recommendedGroups={recommendedGroups}
        allGroups={allGroups}
        loading={loading}
        onGroupJoined={handleGroupJoined}
        user={user}
      />
    </div>
  );
}
