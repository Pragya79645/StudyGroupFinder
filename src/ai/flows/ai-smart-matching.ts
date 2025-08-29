'use server';

/**
 * @fileOverview A study group recommendation AI agent that uses embeddings for matching.
 *
 * - suggestGroups - A function that suggests study groups to a user based on semantic similarity.
 * - SuggestGroupsInput - The input type for the suggestGroups function.
 * - SuggestGroupsOutput - The return type for the suggestGroups function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {dot} from 'mathjs';
import {textEmbedding004} from '@genkit-ai/vertexai';

const SuggestGroupsInputSchema = z.object({
  subjects: z.array(z.string()).describe('List of subjects the student is interested in.'),
  skills: z.array(z.string()).describe('List of skills the student possesses.'),
  availability: z.string().describe("The student's availability for study sessions."),
  existingGroups: z.array(z.object({
      name: z.string(),
      subject: z.string(),
      description: z.string(),
  })).describe('An array of existing study groups with their name, subject, and description.'),
});
export type SuggestGroupsInput = z.infer<typeof SuggestGroupsInputSchema>;

const SuggestGroupsOutputSchema = z.object({
  suggestedGroups: z.array(z.string()).describe('List of up to 3 study group names recommended for the student.'),
  reasoning: z.string().describe('Explanation of why these groups were suggested (optional).'),
});
export type SuggestGroupsOutput = z.infer<typeof SuggestGroupsOutputSchema>;

export async function suggestGroups(input: SuggestGroupsInput): Promise<SuggestGroupsOutput> {
  return suggestGroupsFlow(input);
}


const suggestGroupsFlow = ai.defineFlow(
  {
    name: 'suggestGroupsFlow',
    inputSchema: SuggestGroupsInputSchema,
    outputSchema: SuggestGroupsOutputSchema,
  },
  async ({ subjects, skills, availability, existingGroups }) => {
    if (existingGroups.length === 0) {
        return { suggestedGroups: [], reasoning: 'No groups available to recommend.' };
    }

    // 1. Create a query string from the user's profile
    const userQuery = `Student interested in subjects: ${subjects.join(', ')}. Skills: ${skills.join(', ')}. Availability: ${availability}.`;

    // 2. Create a "document" for each group
    const groupDocuments = existingGroups.map(
      (group) => `${group.name}: ${group.subject}. ${group.description}`
    );

    // 3. Generate embeddings for the user query and all group documents
    const [userEmbedding, groupEmbeddings] = await Promise.all([
      ai.embed({
        embedder: textEmbedding004,
        content: userQuery,
      }),
      ai.embed({
        embedder: textEmbedding004,
        content: groupDocuments,
      }),
    ]);

    // 4. Calculate similarity scores
    const similarities = groupEmbeddings.map((groupEmbedding) => {
      // Use dot product to calculate similarity. Higher is better.
      return dot(userEmbedding, groupEmbedding) as number;
    });

    // 5. Rank groups by similarity
    const rankedGroups = existingGroups
      .map((group, index) => ({
        name: group.name,
        score: similarities[index],
      }))
      .sort((a, b) => b.score - a.score); // Sort descending

    // 6. Return the top 3 groups
    const suggestedGroups = rankedGroups.slice(0, 3).map(group => group.name);

    return {
      suggestedGroups,
      reasoning: `Found top matches based on your profile's similarity to group descriptions.`,
    };
  }
);
