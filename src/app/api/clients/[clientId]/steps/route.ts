import { NextRequest, NextResponse } from 'next/server';
import { DailyStepSchema } from '../../../../../domain/types/DailySteps';
import { validateApiKey } from '../../../../../app/api/utils/auth';
import { addDailyStep } from '../../../../../app/actions/clientActions';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const apiKey = request.headers.get('x-api-key');

    // Validate API key header exists
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing X-API-Key header' },
        { status: 401 }
      );
    }

    // Validate API key matches client
    const isValid = await validateApiKey(clientId, apiKey);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or mismatched API key' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();

    // Convert date string to Date object if needed
    const dateInput = typeof body.date === 'string' ? new Date(body.date) : body.date;

    const parsed = DailyStepSchema.safeParse({
      date: dateInput,
      steps: body.steps,
      notes: body.notes,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: `Validation failed: ${parsed.error.message}` },
        { status: 400 }
      );
    }

    // Add daily step
    const result = await addDailyStep(
      clientId,
      parsed.data.date,
      parsed.data.steps,
      parsed.data.notes
    );

    if (!result) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        clientId,
        data: {
          date: parsed.data.date.toISOString().split('T')[0],
          steps: parsed.data.steps,
          notes: parsed.data.notes,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /api/clients/[clientId]/steps:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
