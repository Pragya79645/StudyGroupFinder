'use server';

import { suggestGroupMatches, type SuggestGroupMatchesInput } from '@/ai/flows/suggest-group-matches';
import { generateStudySuggestions } from '@/ai/flows/generate-study-suggestions';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { addDoc, collection, serverTimestamp, arrayUnion, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function getGroupSuggestions(input: SuggestGroupMatchesInput) {
  try {
    const suggestions = await suggestGroupMatches(input);
    return suggestions;
  } catch (error) {
    console.error('Error getting group suggestions:', error);
    return { error: 'Failed to get AI suggestions.' };
  }
}

const createGroupSchema = z.object({
    groupName: z.string().min(3, 'Group name must be at least 3 characters.'),
    subject: z.string().min(1, 'Subject is required.'),
    tags: z.string().optional(),
});

export async function createGroup(prevState: any, formData: FormData) {
    const validatedFields = createGroupSchema.safeParse(Object.fromEntries(formData));
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }
    
    const user = auth.currentUser;
    if (!user) {
      return { message: 'You must be logged in to create a group.' };
    }

    const { groupName, subject, tags } = validatedFields.data;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

    try {
        const groupRef = await addDoc(collection(db, 'groups'), {
            groupName,
            subject,
            tags: tagsArray,
            members: [user.uid],
            createdAt: serverTimestamp(),
        });

        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            groups: arrayUnion(groupRef.id)
        });

    } catch(e) {
        console.error(e);
        return { message: 'Failed to create group.' };
    }

    redirect('/dashboard');
}

export async function getStudyTips(subject: string) {
    if (!subject) {
        return { error: 'Subject is required to get study tips.' };
    }
    try {
        const result = await generateStudySuggestions({ subject });
        return result;
    } catch (error) {
        console.error('Error getting study tips:', error);
        return { error: 'Failed to get AI study tips.' };
    }
}
