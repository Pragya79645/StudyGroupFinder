'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating study suggestions tailored to a specific subject.
 *
 * The flow takes a subject as input and returns a set of study tips, resources, and practice problems.
 *
 * @example
 * // Example usage:
 * const suggestions = await generateStudySuggestions({
 *   subject: "Mathematics"
 * });
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const GenerateStudySuggestionsInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate study suggestions.'),
});
export type GenerateStudySuggestionsInput = z.infer<
  typeof GenerateStudySuggestionsInputSchema
>;

// Define the output schema for the flow
const GenerateStudySuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('A list of study tips, resources, and practice problems.'),
});
export type GenerateStudySuggestionsOutput = z.infer<
  typeof GenerateStudySuggestionsOutputSchema
>;

// Exported function to call the flow
export async function generateStudySuggestions(
  input: GenerateStudySuggestionsInput
): Promise<GenerateStudySuggestionsOutput> {
  return generateStudySuggestionsFlow(input);
}

// Define the prompt for generating study suggestions
const studySuggestionsPrompt = ai.definePrompt({
  name: 'studySuggestionsPrompt',
  input: {schema: GenerateStudySuggestionsInputSchema},
  output: {schema: GenerateStudySuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide helpful study suggestions for students.
  Given the subject: {{{subject}}}, generate a list of study tips, resources, and practice problems that would be helpful for students studying this subject.`,
});

// Define the Genkit flow
const generateStudySuggestionsFlow = ai.defineFlow(
  {
    name: 'generateStudySuggestionsFlow',
    inputSchema: GenerateStudySuggestionsInputSchema,
    outputSchema: GenerateStudySuggestionsOutputSchema,
  },
  async input => {
    const {output} = await studySuggestionsPrompt(input);
    return output!;
  }
);
