import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../lib/database';

interface SimulationWeights {
  renewable: number;
  water: number;
  industrial: number;
  logistics: number;
}

interface SimulationScenario {
  name: string;
  description: string;
  weights: SimulationWeights;
}

export class SimulationController {
  /**
   * POST /api/simulations/run - Run a new scenario simulation
   */
  public static async runSimulation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const startTime = Date.now();
      const { scenario, limit = 5 } = req.body;

      // Basic validation
      if (!scenario || !scenario.weights) {
        res.status(400).json({
          success: false,
          error: 'Scenario with weights is required'
        });
        return;
      }

      const { renewable, water, industrial, logistics } = scenario.weights;
      const totalWeight = renewable + water + industrial + logistics;

      if (Math.abs(totalWeight - 100) > 1) {
        res.status(400).json({
          success: false,
          error: `Weights must sum to 100%. Current sum: ${totalWeight}%`
        });
        return;
      }

      // Run weighted query
      const query = `
        SELECT 
          id, name, state, latitude, longitude,
          renewable_score, water_score, industrial_score, logistics_score, overall_score,
          (
            renewable_score * $1 / 100.0 +
            water_score * $2 / 100.0 +
            industrial_score * $3 / 100.0 +
            logistics_score * $4 / 100.0
          ) as weighted_score
        FROM cities
        ORDER BY weighted_score DESC
        LIMIT $5
      `;

      const result = await pool.query(query, [renewable, water, industrial, logistics, limit]);
      
      const cities = result.rows.map((row, index) => ({
        id: row.id,
        name: row.name,
        state: row.state,
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)],
        rank: index + 1,
        scores: {
          renewable: parseFloat(row.renewable_score) || 0,
          water: parseFloat(row.water_score) || 0,
          industrial: parseFloat(row.industrial_score) || 0,
          logistics: parseFloat(row.logistics_score) || 0,
          overall: parseFloat(row.overall_score) || 0,
          weighted: parseFloat(row.weighted_score) || 0
        }
      }));

      // Generate simple simulation ID
      const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // Store in history
      await storeSimulation({
        id: simulationId,
        scenario: scenario.name,
        weights: scenario.weights,
        topCity: cities[0],
        executionTime: Date.now() - startTime
      });

      res.json({
        success: true,
        simulation: {
          id: simulationId,
          scenario,
          cities,
          summary: {
            topChoice: cities[0],
            totalCities: cities.length,
            avgWeightedScore: cities.reduce((sum, city) => sum + city.scores.weighted, 0) / cities.length
          },
          executionTime: Date.now() - startTime
        }
      });

    } catch (error) {
      console.error('Error in runSimulation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /api/simulations/:id - Get simulation by ID
   */
  public static async getSimulation(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;

      const query = `
        SELECT * FROM simulation_history WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        res.status(404).json({
          success: false,
          error: 'Simulation not found'
        });
        return;
      }

      const simulation = result.rows[0];
      
      res.json({
        success: true,
        simulation: {
          id: simulation.id,
          scenario: simulation.scenario_name,
          weights: JSON.parse(simulation.weights),
          topCity: {
            name: simulation.top_city_name,
            state: simulation.top_city_state,
            score: parseFloat(simulation.top_city_score)
          },
          createdAt: simulation.created_at,
          executionTime: simulation.execution_time_ms
        }
      });

    } catch (error) {
      console.error('Error in getSimulation:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /api/simulations/history - Get simulation history
   */
  public static async getSimulationHistory(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);

      const query = `
        SELECT 
          id, scenario_name, weights, top_city_name, 
          top_city_state, top_city_score, created_at, execution_time_ms
        FROM simulation_history
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;

      const countQuery = `SELECT COUNT(*) FROM simulation_history`;
      
      const [historyResult, countResult] = await Promise.all([
        pool.query(query, [limit, offset]),
        pool.query(countQuery)
      ]);

      const history = historyResult.rows.map(row => ({
        id: row.id,
        scenarioName: row.scenario_name,
        weights: JSON.parse(row.weights),
        topCity: {
          name: row.top_city_name,
          state: row.top_city_state,
          score: parseFloat(row.top_city_score)
        },
        createdAt: row.created_at,
        executionTime: row.execution_time_ms
      }));

      const totalCount = parseInt(countResult.rows[0].count);

      res.json({
        success: true,
        history,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(totalCount / parseInt(limit as string)),
          totalItems: totalCount,
          hasNext: offset + parseInt(limit as string) < totalCount
        }
      });

    } catch (error) {
      console.error('Error in getSimulationHistory:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// Helper function
async function storeSimulation(data: any): Promise<void> {
  try {
    const query = `
      INSERT INTO simulation_history (
        id, scenario_name, weights, top_city_name, 
        top_city_state, top_city_score, execution_time_ms, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    `;

    await pool.query(query, [
      data.id,
      data.scenario,
      JSON.stringify(data.weights),
      data.topCity.name,
      data.topCity.state,
      data.topCity.scores.weighted,
      data.executionTime
    ]);
  } catch (error) {
    console.error('Error storing simulation:', error);
  }
}

export default SimulationController;
