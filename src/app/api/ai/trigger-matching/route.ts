import { NextRequest, NextResponse } from 'next/server';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { suggestGroupMatches } from '@/ai/flows/suggest-group-matches';
import { UserProfile, Group } from '@/lib/types';

// ===== Step 2: AI Matching Trigger API =====
// Triggered when student signs up or updates profile

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userProfile = userDoc.data() as UserProfile;

    // Get all existing groups
    const groupsSnapshot = await getDocs(collection(db, 'groups'));
    const existingGroups: Group[] = groupsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Group));

    // Call AI matching flow
    const matchingInput = {
      userProfile: {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        subjects: userProfile.subjects,
        skills: userProfile.skills,
        availability: userProfile.availability,
        examTags: userProfile.examTags,
        skillTags: userProfile.skillTags,
      },
      existingGroups: existingGroups.map(group => ({
        id: group.id,
        groupName: group.groupName,
        subject: group.subject,
        examFocus: group.examFocus,
        description: group.description,
        tags: group.tags,
        members: group.members,
        memberCount: group.members.length,
      })),
    };

    const suggestions = await suggestGroupMatches(matchingInput);

    // Store suggestions in user's document for later retrieval
    // In a real app, you might want a separate collection for suggestions
    console.log('AI Suggestions generated for user:', userId, suggestions);

    return NextResponse.json({
      success: true,
      suggestions,
      message: 'AI matching completed successfully'
    });

  } catch (error) {
    console.error('Error in AI matching trigger:', error);
    return NextResponse.json(
      { error: 'Failed to process AI matching' },
      { status: 500 }
    );
  }
}
