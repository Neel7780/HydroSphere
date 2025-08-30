// Sample data script for Supabase
// Run this in your Supabase SQL editor

// Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create cities table with PostGIS geometry
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state VARCHAR(50) NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  population INTEGER,
  renewable_score DECIMAL(5, 2) DEFAULT 0,
  water_score DECIMAL(5, 2) DEFAULT 0,
  industrial_score DECIMAL(5, 2) DEFAULT 0,
  logistics_score DECIMAL(5, 2) DEFAULT 0,
  overall_score DECIMAL(5, 2) DEFAULT 0,
  geom GEOMETRY(POINT, 4326),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create renewable zones table
CREATE TABLE IF NOT EXISTS renewable_zones (
  id SERIAL PRIMARY KEY,
  zone_name VARCHAR(100),
  zone_type VARCHAR(50),
  potential_capacity DECIMAL(10,2),
  solar_irradiance DECIMAL(5,2),
  wind_speed DECIMAL(5,2),
  hydro_potential DECIMAL(5,2),
  geom GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create water resources table
CREATE TABLE IF NOT EXISTS water_resources (
  id SERIAL PRIMARY KEY,
  resource_name VARCHAR(100),
  resource_type VARCHAR(50),
  availability_score DECIMAL(5,2),
  quality_index DECIMAL(5,2),
  geom GEOMETRY(POLYGON, 4326),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create industrial clusters table
CREATE TABLE IF NOT EXISTS industrial_clusters (
  id SERIAL PRIMARY KEY,
  cluster_name VARCHAR(100),
  industry_type VARCHAR(100),
  demand_score DECIMAL(5,2),
  employment_count INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  geom GEOMETRY(POINT, 4326),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create logistics infrastructure table
CREATE TABLE IF NOT EXISTS logistics_infrastructure (
  id SERIAL PRIMARY KEY,
  facility_name VARCHAR(100),
  facility_type VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  capacity DECIMAL(10,2),
  geom GEOMETRY(POINT, 4326),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create simulation scenarios table
CREATE TABLE IF NOT EXISTS simulation_scenarios (
  id SERIAL PRIMARY KEY,
  scenario_name VARCHAR(100),
  weights JSONB,
  constraints JSONB,
  results JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample cities data
INSERT INTO cities (name, state, latitude, longitude, population, renewable_score, water_score, industrial_score, logistics_score, overall_score, geom) VALUES
('Mumbai', 'Maharashtra', 19.0760, 72.8777, 20411274, 75.0, 65.0, 90.0, 95.0, 81.25, ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326)),
('Delhi', 'Delhi', 28.7041, 77.1025, 16787941, 70.0, 60.0, 85.0, 90.0, 76.25, ST_SetSRID(ST_MakePoint(77.1025, 28.7041), 4326)),
('Bangalore', 'Karnataka', 12.9716, 77.5946, 12425304, 85.0, 70.0, 80.0, 75.0, 77.5, ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)),
('Chennai', 'Tamil Nadu', 13.0827, 80.2707, 7088000, 80.0, 75.0, 75.0, 80.0, 77.5, ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)),
('Hyderabad', 'Telangana', 17.3850, 78.4867, 6993262, 75.0, 70.0, 80.0, 75.0, 75.0, ST_SetSRID(ST_MakePoint(78.4867, 17.3850), 4326)),
('Kolkata', 'West Bengal', 22.5726, 88.3639, 14974073, 65.0, 80.0, 75.0, 85.0, 76.25, ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326)),
('Pune', 'Maharashtra', 18.5204, 73.8567, 3124458, 80.0, 70.0, 75.0, 70.0, 73.75, ST_SetSRID(ST_MakePoint(73.8567, 18.5204), 4326)),
('Ahmedabad', 'Gujarat', 23.0225, 72.5714, 5577940, 90.0, 60.0, 80.0, 75.0, 76.25, ST_SetSRID(ST_MakePoint(72.5714, 23.0225), 4326)),
('Surat', 'Gujarat', 21.1702, 72.8311, 4467797, 85.0, 65.0, 75.0, 80.0, 76.25, ST_SetSRID(ST_MakePoint(72.8311, 21.1702), 4326)),
('Jaipur', 'Rajasthan', 26.9124, 75.7873, 3073350, 95.0, 50.0, 65.0, 70.0, 70.0, ST_SetSRID(ST_MakePoint(75.7873, 26.9124), 4326));

-- Insert renewable zones data
INSERT INTO renewable_zones (zone_name, zone_type, potential_capacity, solar_irradiance, wind_speed, hydro_potential, geom) VALUES
('Rajasthan Solar Zone', 'solar', 50000.0, 5.8, 0.0, 0.0, ST_GeomFromText('POLYGON((70 25, 75 25, 75 30, 70 30, 70 25))', 4326)),
('Gujarat Wind Zone', 'wind', 30000.0, 0.0, 7.2, 0.0, ST_GeomFromText('POLYGON((70 20, 75 20, 75 25, 70 25, 70 20))', 4326)),
('Tamil Nadu Wind Zone', 'wind', 25000.0, 0.0, 7.8, 0.0, ST_GeomFromText('POLYGON((78 10, 82 10, 82 15, 78 15, 78 10))', 4326)),
('Himalayan Hydro Zone', 'hydro', 40000.0, 0.0, 0.0, 8.5, ST_GeomFromText('POLYGON((75 30, 80 30, 80 35, 75 35, 75 30))', 4326));

-- Insert water resources data
INSERT INTO water_resources (resource_name, resource_type, availability_score, quality_index, geom) VALUES
('Ganga River Basin', 'river', 85.0, 75.0, ST_GeomFromText('POLYGON((75 25, 85 25, 85 30, 75 30, 75 25))', 4326)),
('Yamuna River Basin', 'river', 80.0, 70.0, ST_GeomFromText('POLYGON((75 28, 80 28, 80 30, 75 30, 75 28))', 4326)),
('Krishna River Basin', 'river', 75.0, 80.0, ST_GeomFromText('POLYGON((75 15, 80 15, 80 20, 75 20, 75 15))', 4326)),
('Groundwater Aquifer Central', 'groundwater', 70.0, 65.0, ST_GeomFromText('POLYGON((75 20, 85 20, 85 25, 75 25, 75 20))', 4326));

-- Insert industrial clusters data
INSERT INTO industrial_clusters (cluster_name, industry_type, demand_score, employment_count, latitude, longitude, geom) VALUES
('Mumbai Petrochemical Cluster', 'petrochemical', 90.0, 50000, 19.0760, 72.8777, ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326)),
('Delhi Manufacturing Hub', 'manufacturing', 85.0, 45000, 28.7041, 77.1025, ST_SetSRID(ST_MakePoint(77.1025, 28.7041), 4326)),
('Bangalore Tech Cluster', 'technology', 80.0, 60000, 12.9716, 77.5946, ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)),
('Chennai Auto Cluster', 'automotive', 75.0, 35000, 13.0827, 80.2707, ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)),
('Hyderabad Pharma Cluster', 'pharmaceutical', 80.0, 40000, 17.3850, 78.4867, ST_SetSRID(ST_MakePoint(78.4867, 17.3850), 4326));

-- Insert logistics infrastructure data
INSERT INTO logistics_infrastructure (facility_name, facility_type, latitude, longitude, capacity, geom) VALUES
('Jawaharlal Nehru Port', 'port', 18.9490, 72.9525, 5000000.0, ST_SetSRID(ST_MakePoint(72.9525, 18.9490), 4326)),
('Mundra Port', 'port', 22.8397, 69.7203, 3000000.0, ST_SetSRID(ST_MakePoint(69.7203, 22.8397), 4326)),
('Chennai Port', 'port', 13.0827, 80.2707, 2500000.0, ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)),
('Delhi International Airport', 'airport', 28.5562, 77.1000, 10000000.0, ST_SetSRID(ST_MakePoint(77.1000, 28.5562), 4326)),
('Mumbai International Airport', 'airport', 19.0896, 72.8656, 12000000.0, ST_SetSRID(ST_MakePoint(72.8656, 19.0896), 4326));

-- Create spatial indexes for better performance
CREATE INDEX cities_geom_idx ON cities USING GIST (geom);
CREATE INDEX renewable_zones_geom_idx ON renewable_zones USING GIST (geom);
CREATE INDEX water_resources_geom_idx ON water_resources USING GIST (geom);
CREATE INDEX industrial_clusters_geom_idx ON industrial_clusters USING GIST (geom);
CREATE INDEX logistics_infrastructure_geom_idx ON logistics_infrastructure USING GIST (geom);

-- Update cities with PostGIS geometry
UPDATE cities SET geom = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326) WHERE geom IS NULL; 