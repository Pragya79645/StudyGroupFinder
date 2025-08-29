'use server';

/**
 * @fileOverview This file defines a Genkit flow for summarizing chat conversations.
 *
 * - summarizeChat - A function that returns a summary of a chat history.
 * - SummarizeChatInput - The input type for the summarizeChat function.
 * - SummarizeChatOutput - The return type for the summarizeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChatInputSchema = z.object({
  history: z
    .array(z.string())
    .describe('A list of chat messages to be summarized.'),
});
export type SummarizeChatInput = z.infer<typeof SummarizeChatInputSchema>;

const SummarizeChatOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key points, questions, and decisions from the chat history.'),
});
export type SummarizeChatOutput = z.infer<typeof SummarizeChatOutputSchema>;

export async function summarizeChat(
  input: SummarizeChatInput
): Promise<SummarizeChatOutput> {
  return summarizeChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeChatPrompt',
  input: {schema: SummarizeChatInputSchema},
  output: {schema: SummarizeChatOutputSchema},
  prompt: `You are an AI assistant in a study group chat. Your task is to summarize the conversation provided.
  
  Focus on identifying the main topics discussed, any questions that were asked, and any decisions or action items that were agreed upon.
  
  Keep the summary brief and to the point.
  
  Chat History:
  {{#each history}}
  - {{this}}
  {{/each}}
  
  Generate a summary of the conversation.`,
});

const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: SummarizeChatInputSchema,
    outputSchema: SummarizeChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
