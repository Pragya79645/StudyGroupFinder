'use server';

/**
 * @fileOverview An AI agent for suggesting study group matches to students.
 *
 * - suggestGroupMatches - A function that suggests study group matches for a student.
 * - SuggestGroupMatchesInput - The input type for the suggestGroupMatches function.
 * - SuggestGroupMatchesOutput - The return type for the suggestGroupMatches function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestGroupMatchesInputSchema = z.object({
  subjects: z
    .array(z.string())
    .describe('The subjects the student is studying.'),
  skills: z.array(z.string()).describe('The skills the student possesses.'),
  availability: z
    .string()
    .describe('The student’s availability for study sessions.'),
  tags: z.array(z.string()).describe('Relevant tags for the student.'),
  existingGroups: z
    .array(z.string())
    .describe('A list of existing group names to match the student to.'),
});
export type SuggestGroupMatchesInput = z.infer<typeof SuggestGroupMatchesInputSchema>;

const SuggestGroupMatchesOutputSchema = z.object({
  suggestedGroups: z
    .array(z.string())
    .describe('The names of the study groups suggested for the student.'),
  reasoning: z.string().describe('The reasoning behind the group suggestions.'),
});
export type SuggestGroupMatchesOutput = z.infer<typeof SuggestGroupMatchesOutputSchema>;

export async function suggestGroupMatches(
  input: SuggestGroupMatchesInput
): Promise<SuggestGroupMatchesOutput> {
  return suggestGroupMatchesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestGroupMatchesPrompt',
  input: {schema: SuggestGroupMatchesInputSchema},
  output: {schema: SuggestGroupMatchesOutputSchema},
  prompt: `You are an AI assistant designed to suggest study groups to students based on their profile information.

  Given the following student profile, suggest the best-fit study groups from the existing groups listed.
  If no groups are a good fit, suggest that the student create a new group.

  Student Profile:
  - Subjects: {{subjects}}
  - Skills: {{skills}}
  - Availability: {{availability}}
  - Tags: {{tags}}

  Existing Groups: {{existingGroups}}

  Format your response as a list of suggested group names, followed by a brief explanation of why each group was suggested.
  If no groups are a good fit, return an empty list of suggested groups, and suggest that the student create a new group.
  `,
});

const suggestGroupMatchesFlow = ai.defineFlow(
  {
    name: 'suggestGroupMatchesFlow',
    inputSchema: SuggestGroupMatchesInputSchema,
    outputSchema: SuggestGroupMatchesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
