import { NextApiRequest, NextApiResponse } from 'next';
import { SimulationController } from '@/controllers/simulationController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;  // Access the id directly from req.query

  try {
    if (req.method === 'GET') {
      // Pass the query parameter directly to the controller
      await SimulationController.getSimulation(req, res);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error in get simulation route:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
