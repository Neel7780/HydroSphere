import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../lib/supabase';

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

interface City {
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
  created_at?: string;
  updated_at?: string;
}

export class MapController {
  /**
   * GET /api/map/cities - Get cities data for map visualization
   */
  static async getCitiesData(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { layers = 'all', limit = 100 } = req.query;
      
      let query = supabase
        .from('cities')
        .select(`
          id,
          name,
          state,
          latitude,
          longitude,
          population,
          renewable_score,
          water_score,
          industrial_score,
          logistics_score,
          overall_score,
          created_at,
          updated_at
        `)
        .order('overall_score', { ascending: false })
        .limit(parseInt(limit as string));
      
      if (layers !== 'all') {
        // Add filtering based on layers if needed
        // This is a placeholder for layer-based filtering
      }
      
      const { data: result, error } = await query;
      
      if (error) {
        throw error;
      }
      
      if (!result) {
        return res.status(404).json({ error: 'No cities found' });
      }

      // Convert to GeoJSON format
      const features: GeoJSONFeature[] = result.map((city: City) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(city.longitude.toString()), parseFloat(city.latitude.toString())]
        },
        properties: {
          id: city.id,
          name: city.name,
          state: city.state,
          population: city.population,
          scores: {
            renewable: city.renewable_score,
            water: city.water_score,
            industrial: city.industrial_score,
            logistics: city.logistics_score,
            overall: city.overall_score
          }
        }
      }));

      const geoJSON: GeoJSONFeatureCollection = {
        type: 'FeatureCollection',
        features
      };

      return res.status(200).json({
        success: true,
        data: geoJSON,
        count: features.length
      });
    } catch (error) {
      console.error('Error in getCitiesData:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal Server Error' 
      });
    }
  }

  /**
   * GET /api/map/layers - Get available map layers
   */
  static async getMapLayers(req: NextApiRequest, res: NextApiResponse) {
    try {
      const layers = [
        {
          layer_name: 'renewable',
          display_name: 'Renewable Energy Potential',
          color: '#10B981',
          enabled: true
        },
        {
          layer_name: 'water',
          display_name: 'Water Resources',
          color: '#3B82F6',
          enabled: true
        },
        {
          layer_name: 'industrial',
          display_name: 'Industrial Infrastructure',
          color: '#F59E0B',
          enabled: true
        },
        {
          layer_name: 'logistics',
          display_name: 'Logistics & Transport',
          color: '#8B5CF6',
          enabled: true
        }
      ];

      return res.status(200).json({
        success: true,
        layers
      });
    } catch (error) {
      console.error('Error in getMapLayers:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal Server Error' 
      });
    }
  }

  /**
   * GET /api/map/stats - Get map statistics
   */
  static async getMapStats(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { data: cities, error } = await supabase
        .from('cities')
        .select('overall_score');

      if (error) {
        throw error;
      }

      if (!cities || cities.length === 0) {
        return res.status(404).json({ error: 'No cities found' });
      }

      const scores = cities.map(city => city.overall_score);
      const totalCities = cities.length;
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / totalCities;
      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);
      
      const highPotential = cities.filter(city => city.overall_score >= 80).length;
      const mediumPotential = cities.filter(city => city.overall_score >= 60 && city.overall_score < 80).length;
      const lowPotential = cities.filter(city => city.overall_score < 60).length;

      const stats = {
        totalCities,
        averageScore: avgScore.toFixed(1),
        maxScore,
        minScore,
        distribution: {
          high: highPotential,
          medium: mediumPotential,
          low: lowPotential
        }
      };

      return res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error in getMapStats:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal Server Error' 
      });
    }
  }
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
    WHERE water_score > 70
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
