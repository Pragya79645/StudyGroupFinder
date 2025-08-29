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
import { getResourcesForTopic } from '@/lib/educational-resources';

const AIStudySuggestionsInputSchema = z.object({
  studyTopic: z
    .string()
    .describe('The topic that the study group is currently focusing on.'),
  chatHistory: z
    .array(z.string())
    .optional()
    .describe('Recent chat messages from the group to understand their current needs and questions.'),
});
export type AIStudySuggestionsInput = z.infer<typeof AIStudySuggestionsInputSchema>;

const AIStudySuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('AI-generated study tips and resources for the topic. This could include practice problems, key concepts to review, helpful resources, or answers to specific questions raised in the chat. The suggestions should be concise and easy to act on.'),
  resourceType: z
    .enum(['practice_problems', 'concept_review', 'external_resources', 'qa_help', 'study_plan'])
    .describe('The type of suggestion provided to help categorize the recommendation.'),
  links: z
    .array(z.object({
      title: z.string().describe('The title of the resource'),
      url: z.string().describe('The URL of the resource'),
      description: z.string().describe('Brief description of what this resource provides')
    }))
    .optional()
    .describe('Relevant external links and resources'),
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
  prompt: `You are an AI study assistant for a group of students. Your goal is to provide personalized, actionable study suggestions based on their topic and recent chat activity.

**Study Topic:** {{studyTopic}}

{{#if chatHistory}}
**Recent Group Discussion:**
{{#each chatHistory}}
- {{this}}
{{/each}}

Based on the chat history, analyze:
1. What specific questions or confusion points have been raised?
2. What concepts seem to be challenging for the group?
3. What type of resources or help do they seem to need?
4. Are there any gaps in understanding that should be addressed?
{{/if}}

Provide a targeted suggestion that could include:
- **Practice Problems**: 2-3 specific problems addressing concepts they're struggling with
- **Concept Review**: Key concepts they should revisit based on their questions
- **External Resources**: High-quality videos, articles, or tools that directly address their needs
- **Q&A Help**: Direct answers to questions raised in the chat
- **Study Plan**: A structured approach if they seem overwhelmed

When suggesting external resources, provide REAL, working URLs to high-quality educational content such as:
- Khan Academy videos (https://www.khanacademy.org/)
- YouTube educational channels (https://www.youtube.com/)
- MIT OpenCourseWare (https://ocw.mit.edu/)
- Coursera courses (https://www.coursera.org/)
- edX courses (https://www.edx.org/)
- Wikipedia articles (https://en.wikipedia.org/)
- Educational websites like Brilliant.org, Paul's Online Math Notes, etc.

Make your suggestion specific and actionable. Reference their actual questions or concerns when possible.

IMPORTANT: When including URLs in your suggestions text, format them as proper markdown links using [Link Text](URL) format, not as plain URLs.
For example: "Check out this great tutorial: [Khan Academy Calculus](https://www.khanacademy.org/math/calculus-1)"

For the "links" field, provide 1-3 actual, relevant URLs with descriptive titles and brief descriptions. These will be automatically formatted as clickable links.

Example formats:
- "I noticed questions about derivatives. Here are 3 practice problems on the chain rule..."
- "Based on your discussion about photosynthesis, review these key concepts: [concepts]"
- "For the confusion about data structures, here's an excellent visualization tool: [link]"
- "To answer John's question about matrix multiplication: [explanation]"`,
});

const aiStudySuggestionsFlow = ai.defineFlow(
  {
    name: 'aiStudySuggestionsFlow',
    inputSchema: AIStudySuggestionsInputSchema,
    outputSchema: AIStudySuggestionsOutputSchema,
  },
  async input => {
    try {
      console.log('Generating AI study suggestions for topic:', input.studyTopic);
      if (input.chatHistory && input.chatHistory.length > 0) {
        console.log('Using chat context with', input.chatHistory.length, 'messages');
      }
      
      const {output} = await prompt(input);
      
      if (!output || !output.suggestions) {
        throw new Error('AI model did not return valid suggestions');
      }
      
      // Get relevant resources from our database
      const relevantResources = getResourcesForTopic(input.studyTopic);
      
      // If the AI didn't provide links or provided fewer than 2, supplement with our database
      let finalLinks = output.links || [];
      if (finalLinks.length < 2 && relevantResources.length > 0) {
        const additionalLinks = relevantResources.slice(0, 2 - finalLinks.length);
        finalLinks = [...finalLinks, ...additionalLinks];
      }
      
      console.log('Successfully generated study suggestion:', output.resourceType);
      
      return {
        ...output,
        links: finalLinks
      };
    } catch (error) {
      console.error('Error in aiStudySuggestionsFlow:', error);
      throw error;
    }
  }
);
