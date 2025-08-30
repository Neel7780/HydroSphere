// src/types/simulationTypes.ts

export interface SimulationWeights {
  renewable: number;
  water: number;
  industrial: number;
  logistics: number;
  cost_optimization?: number;
  environmental_priority?: number;
}

export interface SimulationConstraints {
  min_water_score?: number;
  min_renewable_score?: number;
  max_distance_to_port?: number;
  required_industrial_clusters?: number;
  exclude_water_stressed_regions?: boolean;
  minimum_population?: number;
}

export interface SimulationScenario {
  name: string;
  description: string;
  weights: SimulationWeights;
  constraints?: SimulationConstraints;
  priority_sectors?: string[];
  timeline?: 'short_term' | 'medium_term' | 'long_term';
  investment_budget?: number; // in crores
}

export interface CityImpactAnalysis {
  production_capacity: number; // MW
  demand_coverage: number; // percentage
  cost_efficiency: number; // score 0-100
  environmental_impact: number; // score 0-100
  infrastructure_readiness: number; // score 0-100
  risk_assessment: {
    water_security_risk: 'low' | 'medium' | 'high';
    climate_risk: 'low' | 'medium' | 'high';
    policy_risk: 'low' | 'medium' | 'high';
    overall_risk: 'low' | 'medium' | 'high';
  };
}

export interface SimulationCityResult {
  id: number;
  name: string;
  state: string;
  coordinates: [number, number];
  population: number;
  scores: {
    renewable: number;
    water: number;
    industrial: number;
    logistics: number;
    overall: number;
    weighted_score: number;
  };
  rank: number;
  change_from_default?: number;
  movement_type?: 'major_improvement' | 'improvement' | 'stable' | 'decline' | 'major_decline' | 'new_entry';
  impact_analysis: CityImpactAnalysis;
  investment_metrics: {
    required_investment: number; // crores
    payback_period: number; // years
    roi_projection: number; // percentage
  };
}

export interface SimulationSummary {
  total_production_capacity: number; // MW
  total_demand_coverage: number; // percentage
  average_cost_efficiency: number;
  carbon_reduction_potential: number; // MT CO2 per year
  investment_required: number; // crores
  economic_impact: {
    job_creation_potential: number;
    gdp_contribution: number; // crores
    export_revenue_potential: number; // crores
  };
  timeline_projections: {
    phase_1_capacity: number; // 2-3 years
    phase_2_capacity: number; // 4-5 years
    phase_3_capacity: number; // 6-10 years
  };
}

export interface SimulationResult {
  id: string;
  scenario: SimulationScenario;
  results: {
    top_cities: SimulationCityResult[];
    summary: SimulationSummary;
    insights: string[];
    recommendations: string[];
    risk_analysis: {
      overall_feasibility: 'high' | 'medium' | 'low';
      key_risks: string[];
      mitigation_strategies: string[];
    };
  };
  created_at: Date;
  execution_time_ms: number;
  metadata: {
    cities_analyzed: number;
    constraints_applied: number;
    scenario_type: string;
  };
}

export interface SimulationHistory {
  id: string;
  scenario_name: string;
  scenario_type: string;
  weights: SimulationWeights;
  top_city: {
    name: string;
    state: string;
    score: number;
  };
  created_at: Date;
  execution_time_ms: number;
  quick_insights: {
    dominant_factor: string;
    investment_scale: 'small' | 'medium' | 'large';
    geographic_spread: 'concentrated' | 'distributed';
  };
}

export interface SimulationComparison {
  baseline_ranking: Array<{
    rank: number;
    city: string;
    state: string;
    score: number;
  }>;
  simulation_ranking: Array<{
    rank: number;
    city: string;
    state: string;
    weighted_score: number;
  }>;
  changes: Array<{
    city: string;
    simulation_rank: number;
    baseline_rank: number | null;
    rank_change: number | null;
    movement_type: string;
    score_impact: number;
  }>;
  summary: {
    new_entries: number;
    significant_moves: number;
    average_rank_change: number;
    stability_index: number; // 0-100, higher = more stable rankings
  };
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  weights: SimulationWeights;
  constraints?: SimulationConstraints;
  use_case: string;
  target_sectors: string[];
  expected_outcomes: {
    primary_benefit: string;
    implementation_complexity: 'low' | 'medium' | 'high';
    time_to_impact: string;
  };
}

export interface SimulationAnalytics {
  usage_metrics: {
    total_simulations: number;
    unique_users: number;
    average_simulations_per_user: number;
    peak_usage_hours: number[];
  };
  performance_metrics: {
    average_execution_time_ms: number;
    fastest_simulation_ms: number;
    slowest_simulation_ms: number;
    success_rate: number;
  };
  scenario_insights: {
    most_popular_scenario_type: string;
    weight_distribution_trends: Record<string, number>;
    constraint_usage_frequency: Record<string, number>;
  };
  city_insights: {
    most_frequent_top_cities: Array<{ city: string; appearances: number }>;
    emerging_cities: Array<{ city: string; recent_appearances: number }>;
    stable_performers: Array<{ city: string; consistency_score: number }>;
  };
  trend_analysis: {
    daily_simulation_count: Array<{ date: string; count: number }>;
    scenario_type_trends: Array<{ type: string; weekly_change: number }>;
    geographic_preferences: Record<string, number>; // state-wise simulation focus
  };
}

export interface SimulationError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  simulation_id?: string;
}

// Request/Response interfaces
export interface RunSimulationRequest {
  scenario: SimulationScenario;
  limit?: number;
  save_to_history?: boolean;
  comparison_mode?: boolean;
}

export interface RunSimulationResponse {
  success: boolean;
  simulation: SimulationResult;
  comparison?: SimulationComparison;
  metadata: {
    scenario_type: string;
    cities_analyzed: number;
    execution_time_ms: number;
    weightings_applied: SimulationWeights;
    constraints_applied?: SimulationConstraints;
  };
}

export interface GetSimulationResponse {
  success: boolean;
  simulation: SimulationResult;
  current_comparison?: SimulationComparison;
  metadata: {
    simulation_age_hours: number;
    is_recent: boolean;
    can_rerun: boolean;
  };
}

export interface GetHistoryResponse {
  success: boolean;
  history: SimulationHistory[];
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
  analytics: SimulationAnalytics;
  filters: {
    applied_scenario_type: string | null;
    available_scenario_types: string[];
    date_range?: {
      start: Date;
      end: Date;
    };
  };
}

// Utility type definitions
export type ScenarioType = 
  | 'renewable_focused' 
  | 'water_focused' 
  | 'industrial_focused' 
  | 'logistics_focused' 
  | 'balanced' 
  | 'custom_weighted';

export type MovementType = 
  | 'major_improvement' 
  | 'improvement' 
  | 'stable' 
  | 'decline' 
  | 'major_decline' 
  | 'new_entry';

export type RiskLevel = 'low' | 'medium' | 'high';

export type InvestmentScale = 'small' | 'medium' | 'large' | 'mega';

export type GeographicSpread = 'concentrated' | 'distributed' | 'coastal' | 'inland';

// Constants for simulation calculations
export const SIMULATION_CONSTANTS = {
  MAX_CITIES_PER_SIMULATION: 50,
  DEFAULT_SIMULATION_LIMIT: 10,
  HISTORY_RETENTION_DAYS: 365,
  MAX_SIMULATIONS_PER_USER_PER_HOUR: 20,
  MIN_WEIGHT_VALUE: 0,
  MAX_WEIGHT_VALUE: 100,
  WEIGHT_PRECISION: 0.1,
  
  // Cost calculations (in crores)
  COST_PER_MW_CAPACITY: 5,
  MAINTENANCE_COST_PERCENTAGE: 3, // 3% of CAPEX annually
  
  // Environmental impact factors
  CO2_REDUCTION_PER_MW: 0.1, // MT CO2 per MW per year
  WATER_CONSUMPTION_PER_KG_H2: 9, // liters
  
  // Economic multipliers
  JOBS_PER_MW: 2.5,
  GDP_MULTIPLIER: 1.8, // 1.8x investment becomes GDP contribution
  EXPORT_PRICE_PER_KG: 300 // rupees per kg H2
} as const;