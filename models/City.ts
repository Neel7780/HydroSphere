import { pool } from "../lib/database";

export default class City {
  static async findAll() {
    const query = `
      SELECT id, name, state, latitude, longitude, population,
             renewable_score, water_score, industrial_score,
             logistics_score, overall_score, created_at, updated_at
      FROM cities
      ORDER BY overall_score DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findTopCities(limit = 5) {
    const query = `
      SELECT id, name, state, latitude, longitude, population,
             renewable_score, water_score, industrial_score,
             logistics_score, overall_score
      FROM cities
      ORDER BY overall_score DESC
      LIMIT $1;
    `;
    const result = await pool.query(query, [limit]);
    return result.rows;
  }

  static async findById(id: number) {
    const query = `
      SELECT c.*, r.solar_potential, r.wind_potential, r.hydro_potential,
             r.solar_irradiance, r.wind_speed, r.installed_capacity,
             i.steel_demand, i.cement_demand, i.fertilizer_demand,
             i.refinery_capacity, i.industrial_clusters, i.annual_consumption,
             w.water_availability, w.groundwater_level, w.surface_water,
             w.water_quality_index,
             l.port_distance, l.highway_connectivity, l.rail_connectivity,
             l.pipeline_access, l.transport_score
      FROM cities c
      LEFT JOIN renewable_data r ON c.id = r.city_id
      LEFT JOIN industrial_data i ON c.id = i.city_id
      LEFT JOIN water_resources w ON c.id = w.city_id
      LEFT JOIN logistics_data l ON c.id = l.city_id
      WHERE c.id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findWithCustomWeights(weights: {
    renewable?: number;
    water?: number;
    industrial?: number;
    logistics?: number;
  }) {
    const { renewable = 25, water = 25, industrial = 25, logistics = 25 } = weights;

    const query = `
      SELECT id, name, state, latitude, longitude,
             renewable_score, water_score, industrial_score, logistics_score,
             (
               (renewable_score * $1 / 100) +
               (water_score * $2 / 100) +
               (industrial_score * $3 / 100) +
               (logistics_score * $4 / 100)
             ) as custom_score
      FROM cities
      ORDER BY custom_score DESC;
    `;
    const result = await pool.query(query, [renewable, water, industrial, logistics]);
    return result.rows;
  }
}
