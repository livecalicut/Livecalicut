import { NextResponse } from 'next/server';
import { aiChatQuerySchema } from '@/lib/validations/ai';
import { AiConciergeService } from '@/lib/services/ai-concierge.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = aiChatQuerySchema.parse(body);

    const result = await AiConciergeService.generateConciergeResponse(validated.prompt);

    return NextResponse.json({
      prompt: validated.prompt,
      response: result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
