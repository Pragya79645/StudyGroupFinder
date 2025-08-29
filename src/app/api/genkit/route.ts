import { NextRequest, NextResponse } from 'next/server';
import { summarizeChat } from '@/ai/flows/ai-chat-summarizer';
import { aiStudySuggestions } from '@/ai/flows/ai-study-suggestions';

export async function POST(req: NextRequest) {
  try {
    const { action, data } = await req.json();
    
    switch (action) {
      case 'summarizeChat':
        const summary = await summarizeChat(data);
        return NextResponse.json({ success: true, result: summary });
        
      case 'aiStudySuggestions':
        const suggestions = await aiStudySuggestions(data);
        return NextResponse.json({ success: true, result: suggestions });
        
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
