'use server';

import { z } from 'zod';

// ===== Google Auth - Profile Completion Validation =====

const profileCompletionSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  subjects: z.array(z.string()).min(1, { message: 'Please select at least one subject.' }),
  skills: z.array(z.string()).min(1, { message: 'Please select at least one skill.' }),
  availability: z.array(z.string()).min(1, { message: 'Please select your availability.' }),
  examTags: z.array(z.string()).optional().default([]),
  skillTags: z.array(z.string()).optional().default([]),
});

export async function validateProfileCompletion(prevState: any, formData: FormData) {
  // Parse complex fields from JSON strings
  const subjects = JSON.parse(formData.get('subjects') as string || '[]');
  const skills = JSON.parse(formData.get('skills') as string || '[]');
  const availability = JSON.parse(formData.get('availability') as string || '[]');
  const examTags = JSON.parse(formData.get('examTags') as string || '[]');
  const skillTags = JSON.parse(formData.get('skillTags') as string || '[]');

  const dataToValidate = {
    name: formData.get('name'),
    subjects,
    skills,
    availability,
    examTags,
    skillTags,
  };

  const validatedFields = profileCompletionSchema.safeParse(dataToValidate);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: validatedFields.error.issues[0].message,
    };
  }

  // Return validated data for profile completion
  return { 
    success: true, 
    data: validatedFields.data,
    redirectTo: '/dashboard' 
  };
}
