'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing AI-generated study suggestions to study groups.
 *
 * @fileOverview Provides AI-generated quick tips and resources based on group study topics.
 * - aiStudySuggestions - A function that returns study suggestions for a given topic.
 * - AIStudySuggestionsInput - The input type for the aiStudySuggestions function.
 * - AIStudySuggestionsOutput - The return type for the aiStudySuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIStudySuggestionsInputSchema = z.object({
  studyTopic: z
    .string()
    .describe('The topic that the study group is currently focusing on.'),
});
export type AIStudySuggestionsInput = z.infer<typeof AIStudySuggestionsInputSchema>;

const AIStudySuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-generated study tips and resources for the topic. This could include practice problems, key concepts to review, or links to helpful articles or videos. The suggestions should be concise and easy to act on.'),
});
export type AIStudySuggestionsOutput = z.infer<typeof AIStudySuggestionsOutputSchema>;

export async function aiStudySuggestions(
  input: AIStudySuggestionsInput
): Promise<AIStudySuggestionsOutput> {
  return aiStudySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiStudySuggestionsPrompt',
  input: {schema: AIStudySuggestionsInputSchema},
  output: {schema: AIStudySuggestionsOutputSchema},
  prompt: `You are an AI study assistant for a group of students. Your goal is to provide a single, actionable study suggestion related to their topic.

  The suggestion should be one of the following:
  - A few practice problems (e.g., 2-3 problems on a specific concept).
  - A list of key concepts to review.
  - A link to a high-quality external resource (like a Khan Academy video or a technical article).

  Today's topic is: {{studyTopic}}

  Generate a concise and helpful study suggestion. For example: "Here are 3 practice problems on eigenvalues..." or "For your review of Calculus, focus on understanding the Fundamental Theorem of Calculus." or "Here is a great video explaining the Krebs Cycle: [link]".`,
});

const aiStudySuggestionsFlow = ai.defineFlow(
  {
    name: 'aiStudySuggestionsFlow',
    inputSchema: AIStudySuggestionsInputSchema,
    outputSchema: AIStudySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
