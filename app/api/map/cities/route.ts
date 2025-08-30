import { NextApiRequest, NextApiResponse } from 'next';
import { MapController } from '@/controllers/mapController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      await MapController.getCitiesData(req, res);  // No need for `next`
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in getCitiesData route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
