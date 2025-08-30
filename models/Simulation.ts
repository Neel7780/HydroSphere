// src/models/Simulation.ts
import { pool } from '../lib/database';

interface SimulationWeights {
  renewable: number;
  water: number;
  industrial: number;
  logistics: number;
  cost_optimization?: number;
  environmental_priority?: number;
}

interface SimulationConstraints {
  min_water_score?: number;
  min_renewable_score?: number;
  max_distance_to_port?: number;
  required_industrial_clusters?: number;
}

interface SimulationScenario {
  name: string;
  description: string;
  weights: SimulationWeights;
  constraints?: SimulationConstraints;
  priority_sectors?: string[];
}

interface SimulationRecord {
  id: string;
  scenario_name: string;
  scenario_weights: string; // JSON string
  scenario_type: string;
  top_city_name: string;
  top_city_state: string;
  top_city_score: number;
  execution_time_ms: number;
  results_data: string; // JSON string
  created_at: Date;
  updated_at: Date;
}

interface CitySimulationResult {
  id: number;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  population: number;
  renewable_score: number;
  water_score: number;
  industrial_score: number;
  logistics_score: number;
  overall_score: number;
  weighted_score: number;
  // Additional fields for detailed analysis
  solar_potential?: number;
  wind_potential?: number;
  hydro_potential?: number;
  water_availability?: number;
  industrial_clusters?: number;
  port_distance?: number;
  transport_score?: number;
}

export class Simulation {
  /**
   * Run simulation with custom weights and constraints
   * @param scenario - Simulation scenario configuration
   * @param limit - Maximum number of cities to return
   */
  public static async runScenarioAnalysis(scenario: SimulationScenario, limit: number = 10): Promise<CitySimulationResult[]> {
    try {
      const { weights, constraints } = scenario;
      
      let query = `
        SELECT 
          c.*,
          (
            c.renewable_score * $1 / 100.0 +
            c.water_score * $2 / 100.0 +
            c.industrial_score * $3 / 100.0 +
            c.logistics_score * $4 / 100.0
          ) as weighted_score
        FROM cities c
        WHERE 1=1
      `;
      
      const queryParams: any[] = [weights.renewable, weights.water, weights.industrial, weights.logistics];
      let paramIndex = 5;

      // Apply constraints dynamically
      if (constraints) {
        if (constraints.min_water_score !== undefined) {
          query += ` AND c.water_score >= $${paramIndex}`;
          queryParams.push(constraints.min_water_score);
          paramIndex++;
        }
        
        if (constraints.min_renewable_score !== undefined) {
          query += ` AND c.renewable_score >= $${paramIndex}`;
          queryParams.push(constraints.min_renewable_score);
          paramIndex++;
        }
        
        if (constraints.max_distance_to_port !== undefined) {
          query += ` AND c.port_distance <= $${paramIndex}`;
          queryParams.push(constraints.max_distance_to_port);
          paramIndex++;
        }
        
        if (constraints.required_industrial_clusters !== undefined) {
          query += ` AND c.industrial_clusters >= $${paramIndex}`;
          queryParams.push(constraints.required_industrial_clusters);
          paramIndex++;
        }
      }

      query += ` ORDER BY weighted_score DESC LIMIT $${paramIndex}`;
      queryParams.push(limit);

      const result = await pool.query(query, queryParams);
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        state: row.state,
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        population: parseInt(row.population) || 0,
        renewable_score: parseFloat(row.renewable_score) || 0,
        water_score: parseFloat(row.water_score) || 0,
        industrial_score: parseFloat(row.industrial_score) || 0,
        logistics_score: parseFloat(row.logistics_score) || 0,
        overall_score: parseFloat(row.overall_score) || 0,
        weighted_score: parseFloat(row.weighted_score) || 0,
        solar_potential: parseFloat(row.solar_potential) || 0,
        wind_potential: parseFloat(row.wind_potential) || 0,
        hydro_potential: parseFloat(row.hydro_potential) || 0,
        water_availability: parseFloat(row.water_availability) || 0,
        industrial_clusters: parseInt(row.industrial_clusters) || 0,
        port_distance: parseFloat(row.port_distance) || 0,
        transport_score: parseFloat(row.transport_score) || 0
      }));
    } catch (error) {
      console.error('Error in runScenarioAnalysis:', error);
      throw new Error('Failed to run scenario analysis');
    }
  }

  /**
   * Store simulation results in database
   * @param simulationData - Complete simulation result data
   */
  public static async storeSimulation(simulationData: any): Promise<string> {
    try {
      const {
        id,
        scenario,
        results,
        execution_time_ms
      } = simulationData;

      const topCity = results.top_cities[0];
      const scenarioType = this.detectScenarioType(scenario);

      const insertQuery = `
        INSERT INTO simulation_history (
          id, scenario_name, scenario_weights, scenario_type,
          top_city_name, top_city_state, top_city_score,
          execution_time_ms, results_data, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING id
      `;

      const result = await pool.query(insertQuery, [
        id,
        scenario.name,
        JSON.stringify(scenario.weights),
        scenarioType,
        topCity.name,
        topCity.state,
        topCity.scores.weighted_score,
        execution_time_ms,
        JSON.stringify(results)
      ]);

      return result.rows[0].id;
    } catch (error) {
      console.error('Error storing simulation:', error);
      throw new Error('Failed to store simulation');
    }
  }

  /**
   * Retrieve simulation by ID
   * @param simulationId - Unique simulation identifier
   */
  public static async findById(simulationId: string): Promise<any | null> {
    try {
      const query = `
        SELECT * FROM simulation_history 
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [simulationId]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      
      return {
        id: row.id,
        scenario: {
          name: row.scenario_name,
          description: `Simulation executed on ${new Date(row.created_at).toLocaleDateString()}`,
          weights: JSON.parse(row.scenario_weights),
          type: row.scenario_type
        },
        results: JSON.parse(row.results_data),
        created_at: new Date(row.created_at),
        updated_at: new Date(row.updated_at),
        execution_time_ms: parseInt(row.execution_time_ms)
      };
    } catch (error) {
      console.error('Error finding simulation by ID:', error);
      throw new Error('Failed to retrieve simulation');
    }
  }

  /**
   * Get simulation history with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @param scenarioType - Optional filter by scenario type
   */
  public static async getHistory(page: number = 1, limit: number = 20, scenarioType?: string): Promise<{
    simulations: any[];
    pagination: any;
    analytics: any;
  }> {
    try {
      const offset = (page - 1) * limit;
      
      let query = `
        SELECT 
          id,
          scenario_name,
          scenario_weights,
          scenario_type,
          top_city_name,
          top_city_state,
          top_city_score,
          created_at,
          execution_time_ms
        FROM simulation_history
      `;
      
      const queryParams: any[] = [];
      let paramIndex = 1;
      
      if (scenarioType) {
        query += ` WHERE scenario_type = $${paramIndex}`;
        queryParams.push(scenarioType);
        paramIndex++;
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);
      
      const result = await pool.query(query, queryParams);
      
      // Get total count
      const countQuery = scenarioType 
        ? `SELECT COUNT(*) FROM simulation_history WHERE scenario_type = $1`
        : `SELECT COUNT(*) FROM simulation_history`;
      
      const countParams = scenarioType ? [scenarioType] : [];
      const countResult = await pool.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);
      
      const simulations = result.rows.map(row => ({
        id: row.id,
        scenario_name: row.scenario_name,
        scenario_type: row.scenario_type,
        weights: JSON.parse(row.scenario_weights),
        top_city: {
          name: row.top_city_name,
          state: row.top_city_state,
          score: parseFloat(row.top_city_score)
        },
        created_at: new Date(row.created_at),
        execution_time_ms: parseInt(row.execution_time_ms)
      }));
      
      // Generate analytics
      const analytics = await this.generateHistoryAnalytics(simulations);
      
      return {
        simulations,
        pagination: {
          current_page: page,
          per_page: limit,
          total_items: totalCount,
          total_pages: Math.ceil(totalCount / limit),
          has_next: page < Math.ceil(totalCount / limit),
          has_previous: page > 1
        },
        analytics
      };
    } catch (error) {
      console.error('Error getting simulation history:', error);
      throw new Error('Failed to retrieve simulation history');
    }
  }

  /**
   * Delete simulation from history
   * @param simulationId - Simulation ID to delete
   */
  public static async deleteById(simulationId: string): Promise<boolean> {
    try {
      const deleteQuery = `
        DELETE FROM simulation_history 
        WHERE id = $1 
        RETURNING id
      `;
      
      const result = await pool.query(deleteQuery, [simulationId]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting simulation:', error);
      throw new Error('Failed to delete simulation');
    }
  }

  /**
   * Get available scenario types from history
   */
  public static async getScenarioTypes(): Promise<string[]> {
    try {
      const query = `
        SELECT DISTINCT scenario_type 
        FROM simulation_history 
        WHERE scenario_type IS NOT NULL
        ORDER BY scenario_type
      `;
      
      const result = await pool.query(query);
      return result.rows.map(row => row.scenario_type);
    } catch (error) {
      console.error('Error getting scenario types:', error);
      return [];
    }
  }

  /**
   * Compare simulation results with baseline rankings
   * @param simulationId - Simulation to compare
   */
  public static async compareWithBaseline(simulationId: string): Promise<any> {
    try {
      const simulation = await this.findById(simulationId);
      if (!simulation) {
        throw new Error('Simulation not found');
      }

      // Get current default rankings
      const defaultQuery = `
        SELECT id, name, state, overall_score,
        RANK() OVER (ORDER BY overall_score DESC) as default_rank
        FROM cities
        ORDER BY overall_score DESC
        LIMIT 20
      `;
      
      const defaultResult = await pool.query(defaultQuery);
      const defaultRankings = defaultResult.rows;
      
      // Compare with simulation results
      const simulationCities = simulation.results.top_cities;
      
      const comparison = simulationCities.map((simCity: any) => {
        const defaultCity = defaultRankings.find(dc => dc.id === simCity.id);
        const defaultRank = defaultCity ? defaultCity.default_rank : null;
        
        return {
          city: `${simCity.name}, ${simCity.state}`,
          simulation_rank: simCity.rank,
          default_rank: defaultRank,
          rank_change: defaultRank ? defaultRank - simCity.rank : null,
          weighted_score: simCity.scores.weighted_score,
          default_score: defaultCity ? parseFloat(defaultCity.overall_score) : null,
          score_difference: defaultCity ? simCity.scores.weighted_score - parseFloat(defaultCity.overall_score) : null,
          movement_type: this.getMovementType(simCity.rank, defaultRank)
        };
      });
      
    interface CityComparison {
        city: string;
        simulation_rank: number;
        default_rank: number | null;
        rank_change: number | null;
        weighted_score: number;
        default_score: number | null;
        score_difference: number | null;
        movement_type: string;
    }

    interface ComparisonSummary {
        new_entries: number;
        significant_moves: number;
        average_rank_change: number;
    }

    interface ComparisonResult {
        comparison: CityComparison[];
        summary: ComparisonSummary;
    }

    return {
        comparison,
        summary: {
            new_entries: comparison.filter((c: CityComparison) => c.default_rank === null || c.default_rank > 20).length,
            significant_moves: comparison.filter((c: CityComparison) => c.rank_change && Math.abs(c.rank_change) >= 5).length,
            average_rank_change:
                comparison
                    .filter((c: CityComparison) => c.rank_change !== null)
                    .reduce((sum: number, c: CityComparison) => sum + (c.rank_change || 0), 0) /
                comparison.filter((c: CityComparison) => c.rank_change !== null).length || 0
        }
    } as ComparisonResult;
    } catch (error) {
      console.error('Error comparing with baseline:', error);
      throw new Error('Failed to compare with baseline');
    }
  }

  /**
   * Generate analytics for simulation history
   */
  private static async generateHistoryAnalytics(simulations: any[]): Promise<any> {
    if (simulations.length === 0) {
      return { message: 'No simulation history available' };
    }

    // Most frequent scenarios
    const scenarioFrequency = simulations.reduce((acc: Record<string, number>, sim: any) => {
      acc[sim.scenario_name] = (acc[sim.scenario_name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Most frequent top cities
    const cityFrequency = simulations.reduce((acc: Record<string, number>, sim: any) => {
      const cityKey = `${sim.top_city.name}, ${sim.top_city.state}`;
      acc[cityKey] = (acc[cityKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Performance metrics
    const avgExecutionTime = simulations.reduce((sum: number, sim: any) => sum + sim.execution_time_ms, 0) / simulations.length;
    const avgTopScore = simulations.reduce((sum: number, sim: any) => sum + sim.top_city.score, 0) / simulations.length;

    // Trend analysis
    const last7Days = simulations.filter((sim: any) => 
      (Date.now() - sim.created_at.getTime()) < (7 * 24 * 60 * 60 * 1000)
    );
    
    const last30Days = simulations.filter((sim: any) => 
      (Date.now() - sim.created_at.getTime()) < (30 * 24 * 60 * 60 * 1000)
    );

    return {
      total_simulations: simulations.length,
      performance_metrics: {
        average_execution_time_ms: Math.round(avgExecutionTime),
        average_top_score: Math.round(avgTopScore * 10) / 10,
        fastest_simulation_ms: Math.min(...simulations.map((s: any) => s.execution_time_ms)),
        slowest_simulation_ms: Math.max(...simulations.map((s: any) => s.execution_time_ms))
      },
      popular_scenarios: Object.entries(scenarioFrequency)
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
      frequently_top_cities: Object.entries(cityFrequency)
        .sort((a: [string, number], b: [string, number]) => b[1] - a[1])
        .slice(0, 5)
        .map(([city, count]) => ({ city, appearances: count })),
      usage_trends: {
        last_7_days: last7Days.length,
        last_30_days: last30Days.length,
        daily_average: Math.round(last7Days.length / 7 * 10) / 10,
        growth_rate: last7Days.length > 0 && last30Days.length > 7 ? 
          Math.round(((last7Days.length / 7) / (last30Days.length / 30) - 1) * 100) : null
      }
    };
  }

  /**
   * Detect scenario type based on weights
   */
  public static detectScenarioType(scenario: SimulationScenario): string {
    const weights = scenario.weights;
    const maxWeight = Math.max(weights.renewable, weights.water, weights.industrial, weights.logistics);
    const dominantFactor = Object.entries(weights).find(([key, value]) => value === maxWeight)?.[0];
    
    if (maxWeight >= 40) {
      return `${dominantFactor}_focused`;
    } else if (Math.max(...Object.values(weights)) - Math.min(...Object.values(weights)) <= 15) {
      return 'balanced';
    } else {
      return 'custom_weighted';
    }
  }

  /**
   * Determine movement type for ranking changes
   */
  private static getMovementType(simulationRank: number, defaultRank: number | null): string {
    if (defaultRank === null) return 'new_entry';
    
    const change = defaultRank - simulationRank;
    
    if (change > 5) return 'major_improvement';
    if (change > 2) return 'improvement';
    if (change >= -2) return 'stable';
    if (change >= -5) return 'decline';
    return 'major_decline';
  }

  /**
   * Calculate scenario impact score
   */
  public static calculateScenarioImpact(scenario: SimulationScenario, cities: CitySimulationResult[]): number {
    const weights = scenario.weights;
    
    // Calculate weighted average of top 5 cities
    const top5 = cities.slice(0, 5);
    const weightedAverage = top5.reduce((sum, city) => {
      return sum + (
        city.renewable_score * weights.renewable / 100 +
        city.water_score * weights.water / 100 +
        city.industrial_score * weights.industrial / 100 +
        city.logistics_score * weights.logistics / 100
      );
    }, 0) / top5.length;
    
    return Math.round(weightedAverage * 10) / 10;
  }

  /**
   * Get simulation statistics
   */
  public static async getSimulationStats(): Promise<any> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_simulations,
          COUNT(DISTINCT scenario_type) as unique_scenario_types,
          AVG(execution_time_ms) as avg_execution_time,
          AVG(top_city_score) as avg_top_score,
          MIN(created_at) as first_simulation,
          MAX(created_at) as latest_simulation
        FROM simulation_history
      `;
      
      const result = await pool.query(statsQuery);
      const stats = result.rows[0];
      
      // Get scenario type distribution
      const typeDistQuery = `
        SELECT scenario_type, COUNT(*) as count
        FROM simulation_history
        GROUP BY scenario_type
        ORDER BY count DESC
      `;
      
      const typeResult = await pool.query(typeDistQuery);
      
      return {
        overview: {
          total_simulations: parseInt(stats.total_simulations),
          unique_scenario_types: parseInt(stats.unique_scenario_types),
          average_execution_time_ms: Math.round(parseFloat(stats.avg_execution_time) || 0),
          average_top_score: Math.round((parseFloat(stats.avg_top_score) || 0) * 10) / 10,
          first_simulation: stats.first_simulation,
          latest_simulation: stats.latest_simulation
        },
        scenario_distribution: typeResult.rows.map(row => ({
          type: row.scenario_type,
          count: parseInt(row.count),
          percentage: Math.round((parseInt(row.count) / parseInt(stats.total_simulations)) * 100)
        }))
      };
    } catch (error) {
      console.error('Error getting simulation stats:', error);
      return { error: 'Failed to retrieve statistics' };
    }
  }

  /**
   * Clean old simulations (older than specified days)
   */
  public static async cleanOldSimulations(daysOld: number = 90): Promise<number> {
    try {
      const cleanQuery = `
        DELETE FROM simulation_history 
        WHERE created_at < NOW() - INTERVAL '${daysOld} days'
        RETURNING id
      `;
      
      const result = await pool.query(cleanQuery);
      return result.rows.length;
    } catch (error) {
      console.error('Error cleaning old simulations:', error);
      throw new Error('Failed to clean old simulations');
    }
  }

  /**
   * Export simulation data for analysis
   */
  public static async exportSimulationData(simulationIds: string[]): Promise<any[]> {
    try {
      const query = `
        SELECT * FROM simulation_history 
        WHERE id = ANY($1)
        ORDER BY created_at DESC
      `;
      
      const result = await pool.query(query, [simulationIds]);
      
      return result.rows.map(row => ({
        id: row.id,
        scenario_name: row.scenario_name,
        scenario_weights: JSON.parse(row.scenario_weights),
        scenario_type: row.scenario_type,
        top_city: {
          name: row.top_city_name,
          state: row.top_city_state,
          score: parseFloat(row.top_city_score)
        },
        execution_time_ms: parseInt(row.execution_time_ms),
        created_at: row.created_at,
        results: JSON.parse(row.results_data)
      }));
    } catch (error) {
      console.error('Error exporting simulation data:', error);
      throw new Error('Failed to export simulation data');
    }
  }
}

export default Simulation;