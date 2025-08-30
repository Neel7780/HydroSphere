import { NextRequest } from 'next/server';
import { MapController } from '@/controllers/mapController';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const layer = searchParams.get('layer') || 'all';
    const state = searchParams.get('state');
    const minScore = searchParams.get('minScore') || '0';

    // Create mock req/res objects for compatibility with existing controller
    const mockReq = {
      query: { layer, state, minScore },
      method: 'GET'
    } as any;

    const mockRes = {
      json: (data: any) => Response.json(data),
      status: (code: number) => ({
        json: (data: any) => Response.json(data, { status: code })
      })
    } as any;

    return await MapController.getCitiesData(mockReq, mockRes);
  } catch (error) {
    console.error('Error in getCitiesData route:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
