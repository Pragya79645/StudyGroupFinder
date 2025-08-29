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
  prompt: `You are an AI assistant helping students in a study group chat. Your task is to create a comprehensive yet concise summary of the conversation provided.

Please analyze the chat history and provide a summary that includes:

1. **Main Topics Discussed**: Key subjects or themes that were the focus of the conversation
2. **Questions Asked**: Important questions raised by group members that may need follow-up
3. **Decisions Made**: Any agreements, plans, or action items that were decided upon
4. **Study-Related Insights**: Important concepts, resources, or learning points shared
5. **Next Steps**: Any mentioned deadlines, upcoming meetings, or tasks to be completed

Keep the summary clear, organized, and under 200 words. Focus on actionable information that would be valuable for study group members to reference later.

Chat History:
{{#each history}}
- {{this}}
{{/each}}

Generate a well-structured summary of the conversation above.`,
});

const summarizeChatFlow = ai.defineFlow(
  {
    name: 'summarizeChatFlow',
    inputSchema: SummarizeChatInputSchema,
    outputSchema: SummarizeChatOutputSchema,
  },
  async input => {
    try {
      console.log('Summarizing chat with', input.history.length, 'messages');
      
      if (input.history.length === 0) {
        throw new Error('No chat history provided for summarization');
      }
      
      const {output} = await prompt(input);
      
      if (!output || !output.summary) {
        throw new Error('AI model did not return a valid summary');
      }
      
      console.log('Successfully generated summary:', output.summary.substring(0, 100) + '...');
      
      return output;
    } catch (error) {
      console.error('Error in summarizeChatFlow:', error);
      throw error;
    }
  }
);
