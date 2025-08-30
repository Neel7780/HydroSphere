import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface City {
  id: number
  name: string
  state: string
  latitude: number
  longitude: number
  population: number
  renewable_score: number
  water_score: number
  industrial_score: number
  logistics_score: number
  overall_score: number
  created_at: string
  updated_at: string
}

export interface RenewableData {
  id: number
  city_id: number
  solar_potential: number
  wind_potential: number
  hydro_potential: number
  solar_irradiance: number
  wind_speed: number
  installed_capacity: number
}

export interface WaterResources {
  id: number
  city_id: number
  water_availability: number
  groundwater_level: number
  surface_water: number
  water_quality_index: number
}

export interface IndustrialData {
  id: number
  city_id: number
  steel_demand: number
  cement_demand: number
  fertilizer_demand: number
  refinery_capacity: number
  industrial_clusters: string[]
  annual_consumption: number
}

export interface LogisticsData {
  id: number
  city_id: number
  port_distance: number
  highway_connectivity: number
  rail_connectivity: number
  pipeline_access: number
  transport_score: number
} 