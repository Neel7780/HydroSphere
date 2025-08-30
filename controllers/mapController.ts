import City from "../models/City";
import { pool } from "../lib/database";
import { NextResponse } from "next/server";

export default class MapController {
  static async getMapData(layers: string | null) {
    const requestedLayers = layers ? layers.split(",") : [
      "cities", "renewable", "industrial", "water", "logistics"
    ];

    const data: any = {};

    if (requestedLayers.includes("cities")) {
      const cities = await City.findAll();
      data.cities = cities.map((city: any) => ({
        ...city,
        coordinates: [city.longitude, city.latitude],
        type: "city",
      }));
    }

    if (requestedLayers.includes("renewable")) {
      const renewableQuery = `
        SELECT c.name, c.state, c.latitude, c.longitude,
               r.solar_potential, r.wind_potential, r.hydro_potential,
               c.renewable_score
        FROM cities c
        JOIN renewable_data r ON c.id = r.city_id
        WHERE c.renewable_score > 70
        ORDER BY c.renewable_score DESC;
      `;
      const renewableResult = await pool.query(renewableQuery);
      data.renewableZones = renewableResult.rows.map((zone: any) => ({
        ...zone,
        coordinates: [zone.longitude, zone.latitude],
        type: "renewable_zone",
      }));
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
    });
  }

  static async getMapStats() {
    const statsQuery = `
      SELECT COUNT(*) as total_cities,
             AVG(overall_score) as avg_overall_score,
             AVG(renewable_score) as avg_renewable_score,
             AVG(water_score) as avg_water_score,
             AVG(industrial_score) as avg_industrial_score,
             AVG(logistics_score) as avg_logistics_score,
             MAX(overall_score) as highest_score,
             MIN(overall_score) as lowest_score
      FROM cities;
    `;
    const result = await pool.query(statsQuery);
    const stats = result.rows[0];

    Object.keys(stats).forEach((key) => {
      if (key !== "total_cities") {
        stats[key] = parseFloat(stats[key]) || 0;
      } else {
        stats[key] = parseInt(stats[key]) || 0;
      }
    });

    return NextResponse.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  }
}
