import { pool } from "@/lib/database";

interface CityData {
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
  renewable_data: any;
  industrial_data: any;
  water_resources: any;
  logistics_data: any;
}

const sampleCities: CityData[] = [
  {
    name: "Mumbai",
    state: "Maharashtra",
    latitude: 19.0760,
    longitude: 72.8777,
    population: 20411000,
    renewable_score: 7.5,
    water_score: 6.8,
    industrial_score: 8.2,
    logistics_score: 9.0,
    overall_score: 7.9,
    renewable_data: {
      solar_potential: 5.2,
      wind_potential: 3.1,
      hydro_potential: 2.5,
      solar_irradiance: 4.8,
      wind_speed: 6.2,
      installed_capacity: 1200
    },
    industrial_data: {
      steel_demand: 500,
      cement_demand: 700,
      fertilizer_demand: 300,
      refinery_capacity: 1000,
      industrial_clusters: 5,
      annual_consumption: 2000
    },
    water_resources: {
      water_availability: 8.0,
      groundwater_level: 6.5,
      surface_water: 7.2,
      water_quality_index: 85
    },
    logistics_data: {
      port_distance: 10,
      highway_connectivity: 9.5,
      rail_connectivity: 8.7,
      pipeline_access: 7.0,
      transport_score: 9.2
    }
  },
  {
    name: "Delhi",
    state: "Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    population: 16787941,
    renewable_score: 6.2,
    water_score: 5.5,
    industrial_score: 7.8,
    logistics_score: 8.5,
    overall_score: 7.0,
    renewable_data: {
      solar_potential: 4.5,
      wind_potential: 2.8,
      hydro_potential: 1.9,
      solar_irradiance: 4.2,
      wind_speed: 5.8,
      installed_capacity: 900
    },
    industrial_data: {
      steel_demand: 400,
      cement_demand: 600,
      fertilizer_demand: 250,
      refinery_capacity: 800,
      industrial_clusters: 4,
      annual_consumption: 1700
    },
    water_resources: {
      water_availability: 6.5,
      groundwater_level: 5.2,
      surface_water: 6.0,
      water_quality_index: 78
    },
    logistics_data: {
      port_distance: 250,
      highway_connectivity: 8.8,
      rail_connectivity: 8.2,
      pipeline_access: 6.5,
      transport_score: 8.7
    }
  }
  // Add more city objects as needed
];

export async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");
    await pool.query("TRUNCATE TABLE logistics_data, water_resources, industrial_data, renewable_data, cities RESTART IDENTITY CASCADE;");

    for (const cityData of sampleCities) {
      const cityResult = await pool.query(
        `INSERT INTO cities (name, state, latitude, longitude, population, renewable_score, water_score, industrial_score, logistics_score, overall_score)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id;`,
        [cityData.name, cityData.state, cityData.latitude, cityData.longitude, cityData.population, cityData.renewable_score, cityData.water_score, cityData.industrial_score, cityData.logistics_score, cityData.overall_score]
      );
      const cityId = cityResult.rows[0].id;

      await pool.query(`INSERT INTO renewable_data (city_id, solar_potential, wind_potential, hydro_potential, solar_irradiance, wind_speed, installed_capacity)
        VALUES ($1,$2,$3,$4,$5,$6,$7);`,
        [cityId, cityData.renewable_data.solar_potential, cityData.renewable_data.wind_potential, cityData.renewable_data.hydro_potential, cityData.renewable_data.solar_irradiance, cityData.renewable_data.wind_speed, cityData.renewable_data.installed_capacity]);

      await pool.query(`INSERT INTO industrial_data (city_id, steel_demand, cement_demand, fertilizer_demand, refinery_capacity, industrial_clusters, annual_consumption)
        VALUES ($1,$2,$3,$4,$5,$6,$7);`,
        [cityId, cityData.industrial_data.steel_demand, cityData.industrial_data.cement_demand, cityData.industrial_data.fertilizer_demand, cityData.industrial_data.refinery_capacity, cityData.industrial_data.industrial_clusters, cityData.industrial_data.annual_consumption]);

      await pool.query(`INSERT INTO water_resources (city_id, water_availability, groundwater_level, surface_water, water_quality_index)
        VALUES ($1,$2,$3,$4,$5);`,
        [cityId, cityData.water_resources.water_availability, cityData.water_resources.groundwater_level, cityData.water_resources.surface_water, cityData.water_resources.water_quality_index]);

      await pool.query(`INSERT INTO logistics_data (city_id, port_distance, highway_connectivity, rail_connectivity, pipeline_access, transport_score)
        VALUES ($1,$2,$3,$4,$5,$6);`,
        [cityId, cityData.logistics_data.port_distance, cityData.logistics_data.highway_connectivity, cityData.logistics_data.rail_connectivity, cityData.logistics_data.pipeline_access, cityData.logistics_data.transport_score]);

      console.log(`✅ Seeded data for ${cityData.name}, ${cityData.state}`);
    }

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    process.exit(0);
  }
}

if (require.main === module) {
  seedDatabase();
}
