import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../lib/database';

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    [key: string]: any;
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export class MapController {
  /**
   * GET /api/map/cities - Get cities data for map visualization
   */
  public static async getCitiesData(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const { layer = 'all', state, minScore = 0 } = req.query;

      let query = `
        SELECT 
          id, name, state, latitude, longitude,
          renewable_score, water_score, industrial_score, logistics_score, overall_score
        FROM cities
        WHERE overall_score >= $1
      `;
      
      const params: any[] = [parseFloat(minScore as string)];
      let paramIndex = 2;

      // Add state filter if provided
      if (state && typeof state === 'string') {
        query += ` AND LOWER(state) = LOWER($${paramIndex})`;
        params.push(state);
        paramIndex++;
      }

      query += ` ORDER BY overall_score DESC`;

      const result = await pool.query(query, params);
      
      // Convert to GeoJSON format
      const features: GeoJSONFeature[] = result.rows.map((city: any) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(city.longitude), parseFloat(city.latitude)]
        },
        properties: {
          id: city.id,
          name: city.name,
          state: city.state,
          scores: {
            renewable: parseFloat(city.renewable_score) || 0,
            water: parseFloat(city.water_score) || 0,
            industrial: parseFloat(city.industrial_score) || 0,
            logistics: parseFloat(city.logistics_score) || 0,
            overall: parseFloat(city.overall_score) || 0
          },
          category: getCityCategory(parseFloat(city.overall_score) || 0),
          color: getCityColor(parseFloat(city.overall_score) || 0)
        }
      }));

      const geoJSON: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features
      };

      res.json({
        success: true,
        data: geoJSON,
        metadata: {
          total_cities: features.length,
          layer_type: layer,
          filters_applied: { state, minScore },
          bounds: calculateBounds(features)
        }
      });

    } catch (error) {
      console.error('Error in getCitiesData:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /api/map/stats - Get basic map statistics
   */
  public static async getMapStats(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      // Basic overview stats
      const overviewQuery = `
        SELECT 
          COUNT(*) as total_cities,
          AVG(overall_score) as avg_score,
          MAX(overall_score) as highest_score,
          MIN(overall_score) as lowest_score
        FROM cities
      `;

      const overviewResult = await pool.query(overviewQuery);
      const overview = overviewResult.rows[0];

      // Category averages
      const avgQuery = `
        SELECT 
          AVG(renewable_score) as avg_renewable,
          AVG(water_score) as avg_water,
          AVG(industrial_score) as avg_industrial,
          AVG(logistics_score) as avg_logistics
        FROM cities
      `;

      const avgResult = await pool.query(avgQuery);
      const averages = avgResult.rows[0];

      // Top cities by category
      const topCitiesQuery = `
        (SELECT 'renewable' as category, name, state, renewable_score as score 
         FROM cities ORDER BY renewable_score DESC LIMIT 3)
        UNION ALL
        (SELECT 'water' as category, name, state, water_score as score 
         FROM cities ORDER BY water_score DESC LIMIT 3)
        UNION ALL
        (SELECT 'industrial' as category, name, state, industrial_score as score 
         FROM cities ORDER BY industrial_score DESC LIMIT 3)
        UNION ALL
        (SELECT 'logistics' as category, name, state, logistics_score as score 
         FROM cities ORDER BY logistics_score DESC LIMIT 3)
      `;

      const topCitiesResult = await pool.query(topCitiesQuery);
      
      // Group top cities by category
      const topCities = topCitiesResult.rows.reduce((acc, row) => {
        if (!acc[row.category]) acc[row.category] = [];
        acc[row.category].push({
          name: row.name,
          state: row.state,
          score: parseFloat(row.score)
        });
        return acc;
      }, {} as any);

      res.json({
        success: true,
        stats: {
          overview: {
            total_cities: parseInt(overview.total_cities),
            avg_score: parseFloat(overview.avg_score) || 0,
            highest_score: parseFloat(overview.highest_score) || 0,
            lowest_score: parseFloat(overview.lowest_score) || 0
          },
          category_averages: {
            renewable: parseFloat(averages.avg_renewable) || 0,
            water: parseFloat(averages.avg_water) || 0,
            industrial: parseFloat(averages.avg_industrial) || 0,
            logistics: parseFloat(averages.avg_logistics) || 0
          },
          top_cities: topCities
        }
      });

    } catch (error) {
      console.error('Error in getMapStats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  /**
   * GET /api/map/layers - Get specific layer data
   */
  public static async getLayerData(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    try {
      const { layer, state } = req.query;

      if (!layer || typeof layer !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Layer parameter is required'
        });
        return;
      }

      let data: GeoJSONFeatureCollection;

      switch (layer) {
        case 'renewable':
          data = await getRenewableLayer(state as string);
          break;
        case 'industrial':
          data = await getIndustrialLayer(state as string);
          break;
        case 'water':
          data = await getWaterLayer(state as string);
          break;
        case 'logistics':
          data = await getLogisticsLayer(state as string);
          break;
        default:
          res.status(400).json({
            success: false,
            error: 'Invalid layer type',
            valid_layers: ['renewable', 'industrial', 'water', 'logistics']
          });
          return;
      }

      res.json({
        success: true,
        layer: layer,
        data,
        metadata: {
          features_count: data.features.length,
          state_filter: state || null
        }
      });

    } catch (error) {
      console.error('Error in getLayerData:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

// Helper functions

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

async function getRenewableLayer(stateFilter?: string): Promise<GeoJSONFeatureCollection> {
  let query = `
    SELECT 
      id, name, state, latitude, longitude, renewable_score
    FROM cities
    WHERE renewable_score > 70
  `;
  
  const params: any[] = [];
  
  if (stateFilter) {
    query += ` AND LOWER(state) = LOWER($1)`;
    params.push(stateFilter);
  }
  
  query += ` ORDER BY renewable_score DESC`;
  
  const result = await pool.query(query, params);
  
  return {
    type: 'FeatureCollection',
    features: result.rows.map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
      },
      properties: {
        id: row.id,
        name: row.name,
        state: row.state,
        renewable_score: parseFloat(row.renewable_score),
        layer_type: 'renewable',
        color: getLayerColor('renewable', parseFloat(row.renewable_score))
      }
    }))
  };
}

// Utility functions

function getCityCategory(score: number): string {
  if (score >= 80) return 'high_potential';
  if (score >= 65) return 'medium_potential';
  if (score >= 50) return 'developing';
  return 'low_potential';
}

function getCityColor(score: number): string {
  if (score >= 80) return '#00ff00'; // Green
  if (score >= 65) return '#7fff00'; // Light Green
  if (score >= 50) return '#ffff00'; // Yellow
  return '#ff6b6b'; // Red
}

function getLayerColor(layer: string, score: number): string {
  const baseColors = {
    renewable: { high: '#4ade80', medium: '#65a30d', low: '#eab308' },
    industrial: { high: '#3b82f6', medium: '#6366f1', low: '#8b5cf6' },
    water: { high: '#06b6d4', medium: '#0891b2', low: '#0e7490' },
    logistics: { high: '#f59e0b', medium: '#d97706', low: '#b45309' }
  };
  
  const colors = baseColors[layer as keyof typeof baseColors] || baseColors.renewable;
  
  if (score >= 80) return colors.high;
  if (score >= 65) return colors.medium;
  return colors.low;
}

function calculateBounds(features: GeoJSONFeature[]) {
  if (features.length === 0) return null;
  
  const lngs = features.map(f => f.geometry.coordinates[0]);
  const lats = features.map(f => f.geometry.coordinates[1]);
  
  return {
    west: Math.min(...lngs),
    south: Math.min(...lats),
    east: Math.max(...lngs),
    north: Math.max(...lats)
  };
}

async function getIndustrialLayer(stateFilter?: string): Promise<GeoJSONFeatureCollection> {
  let query = `
    SELECT 
      id, name, state, latitude, longitude, industrial_score
    FROM cities
    WHERE industrial_score > 60
  `;
  
  const params: any[] = [];
  
  if (stateFilter) {
    query += ` AND LOWER(state) = LOWER($1)`;
    params.push(stateFilter);
  }
  
  query += ` ORDER BY industrial_score DESC`;
  
  const result = await pool.query(query, params);
  
  return {
    type: 'FeatureCollection',
    features: result.rows.map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
      },
      properties: {
        id: row.id,
        name: row.name,
        state: row.state,
        industrial_score: parseFloat(row.industrial_score),
        layer_type: 'industrial',
        color: getLayerColor('industrial', parseFloat(row.industrial_score))
      }
    }))
  };
}

async function getWaterLayer(stateFilter?: string): Promise<GeoJSONFeatureCollection> {
  let query = `
    SELECT 
      id, name, state, latitude, longitude, water_score
    FROM cities
    WHERE water_score > 65
  `;
  
  const params: any[] = [];
  
  if (stateFilter) {
    query += ` AND LOWER(state) = LOWER($1)`;
    params.push(stateFilter);
  }
  
  query += ` ORDER BY water_score DESC`;
  
  const result = await pool.query(query, params);
  
  return {
    type: 'FeatureCollection',
    features: result.rows.map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
      },
      properties: {
        id: row.id,
        name: row.name,
        state: row.state,
        water_score: parseFloat(row.water_score),
        layer_type: 'water',
        color: getLayerColor('water', parseFloat(row.water_score))
      }
    }))
  };
}

async function getLogisticsLayer(stateFilter?: string): Promise<GeoJSONFeatureCollection> {
  let query = `
    SELECT 
      id, name, state, latitude, longitude, logistics_score
    FROM cities
    WHERE logistics_score > 60
  `;
  
  const params: any[] = [];
  
  if (stateFilter) {
    query += ` AND LOWER(state) = LOWER($1)`;
    params.push(stateFilter);
  }
  
  query += ` ORDER BY logistics_score DESC`;
  
  const result = await pool.query(query, params);
  
  return {
    type: 'FeatureCollection',
    features: result.rows.map(row => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
      },
      properties: {
        id: row.id,
        name: row.name,
        state: row.state,
        logistics_score: parseFloat(row.logistics_score),
        layer_type: 'logistics',
        color: getLayerColor('logistics', parseFloat(row.logistics_score))
      }
    }))
  };
}

export default MapController;
