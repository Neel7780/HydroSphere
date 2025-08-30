import { NextApiRequest, NextApiResponse } from 'next';
import { MapController } from '@/controllers/mapController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      await MapController.getLayerData(req, res);  // Again, only `req` and `res`
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in getLayerData route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
