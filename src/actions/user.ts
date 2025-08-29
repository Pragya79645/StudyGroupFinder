'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  subjects: z.string().optional(),
  skills: z.string().optional(),
  availability: z.string().optional(),
  tags: z.string().optional(),
});

export async function updateUserProfile(uid: string, prevState: any, formData: FormData) {
  if (!uid) {
    return { message: 'User not found. Please log in again.' };
  }

  const validatedFields = profileSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, subjects, skills, availability, tags } = validatedFields.data;

  const profileData = {
    name,
    subjects: subjects ? subjects.split(',').map(s => s.trim()) : [],
    skills: skills ? skills.split(',').map(s => s.trim()) : [],
    availability: availability || '',
    tags: tags ? tags.split(',').map(t => t.trim()) : [],
  };

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, profileData);
  } catch (e) {
    return { message: 'Failed to update profile.' };
  }

  // Revalidate paths to show updated info
  revalidatePath('/dashboard/profile');
  revalidatePath('/dashboard');

  return { message: 'Profile updated successfully!' };
}
