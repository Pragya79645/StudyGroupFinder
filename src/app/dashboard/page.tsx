
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 neo-border-thick bg-green-400 transform rotate-12"></div>
        <div className="absolute top-40 right-20 w-24 h-24 neo-border-thick bg-cyan-400 transform -rotate-45"></div>
        <div className="absolute bottom-20 left-1/4 w-28 h-28 neo-border-thick bg-orange-400 transform rotate-30"></div>
        <div className="absolute bottom-40 right-1/3 w-20 h-20 neo-border-thick bg-purple-600 transform -rotate-12"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {user && <OnboardingModal user={user} isOpen={showOnboarding} onSave={handleOnboardingComplete} />}
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-cyan-400 neo-border-thick transform rotate-1"></div>
            <div className="relative neo-border-thick neo-shadow-lg bg-black p-6">
              <h1 className="text-4xl md:text-5xl font-black uppercase text-white neo-text-shadow">
                WELCOME BACK,<br />
                <span className="text-yellow-400">{user?.name.split(' ')[0]}!</span>
              </h1>
            </div>
          </div>
          
          <div className="mt-6 inline-block">
            <div className="neo-border neo-shadow bg-white p-4 max-w-2xl transform hover:scale-105 transition-transform duration-300">
              <p className="text-lg font-bold text-black">
                HERE'S WHAT'S HAPPENING IN YOUR <span className="text-purple-600">STUDY WORLD</span>
              </p>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 neo-border-thick bg-red-400 p-4">
              <p className="font-black text-black uppercase">{error}</p>
            </div>
          )}
        </div>

        <DashboardClient
          recommendedGroups={recommendedGroups}
          allGroups={allGroups}
          loading={loading}
          onGroupJoined={handleGroupJoined}
          user={user}
        />
      </div>
    </div>
  );
}
