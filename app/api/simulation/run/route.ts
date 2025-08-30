import { NextApiRequest, NextApiResponse } from 'next';
import { SimulationController } from '@/controllers/simulationController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      await SimulationController.runSimulation(req, res);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in run simulation route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
