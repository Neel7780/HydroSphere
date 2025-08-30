// src/app/api/simulations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '../lib/database';
import City from '../models/City';
import Simulation from '../models/Simulation';
import {
  SimulationWeights,
  SimulationScenario,
  SimulationResult,
  SimulationCityResult,
  SimulationSummary,
  SIMULATION_CONSTANTS,
  PresetScenario,
} from '@/types/simulationTypes';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const startTime = Date.now();
    const { scenario, limit = SIMULATION_CONSTANTS.DEFAULT_SIMULATION_LIMIT } = await req.json();

    if (!scenario || !scenario.weights) {
      return NextResponse.json({
        success: false,
        error: 'Scenario with weights is required',
        message: 'Please provide a valid scenario object with weights',
      }, { status: 400 });
    }

    const cityLimit = Math.min(parseInt(limit), SIMULATION_CONSTANTS.MAX_CITIES_PER_SIMULATION);

    // Validate weights
    const totalWeight = Object.values(scenario.weights as SimulationWeights)
      .filter(val => typeof val === 'number')
      .reduce((sum: number, weight: number) => sum + weight, 0);

    if (Math.abs(totalWeight - 100) > SIMULATION_CONSTANTS.WEIGHT_PRECISION) {
      return NextResponse.json({
        success: false,
        error: 'Weights must sum to 100%',
        message: `Current sum: ${totalWeight}%`,
      }, { status: 400 });
    }

    // Generate unique simulation ID
    const simulationId = SimulationController.generateSimulationId();

    // Run simulation with custom weights
    const cities = await SimulationController.runWeightedAnalysis(scenario, cityLimit);

    // Calculate impact analysis for each city
    const enrichedCities: SimulationCityResult[] = await Promise.all(
      cities.map(async (city: any, index: number) => {
        // Use constants for calculations
        const impactAnalysis = {
          production_capacity: city.renewable_score * SIMULATION_CONSTANTS.COST_PER_MW_CAPACITY,
          demand_coverage: city.industrial_score * 5,
          cost_efficiency: 100 - city.weighted_score,
          environmental_impact: city.renewable_score * SIMULATION_CONSTANTS.CO2_REDUCTION_PER_MW,
          infrastructure_readiness: 80, // placeholder
          risk_assessment: {
            water_security_risk: 'medium',
            climate_risk: 'low',
            policy_risk: 'medium',
            overall_risk: 'medium',
          },
        };
        return {
          ...city,
          rank: index + 1,
          change_from_default: null,
          movement_type: 'stable',
          impact_analysis: impactAnalysis,
          investment_metrics: {
            required_investment: city.renewable_score * SIMULATION_CONSTANTS.COST_PER_MW_CAPACITY,
            payback_period: 7,
            roi_projection: 12.5,
          },
        };
      })
    );

    // Generate summary metrics
    const summary: SimulationSummary = {
      total_production_capacity: enrichedCities.reduce((sum, c) => sum + c.impact_analysis.production_capacity, 0),
      total_demand_coverage: enrichedCities.reduce((sum, c) => sum + c.impact_analysis.demand_coverage, 0),
      average_cost_efficiency: enrichedCities.length ? enrichedCities.reduce((sum, c) => sum + c.impact_analysis.cost_efficiency, 0) / enrichedCities.length : 0,
      carbon_reduction_potential: enrichedCities.reduce((sum, c) => sum + c.impact_analysis.environmental_impact, 0),
      investment_required: enrichedCities.reduce((sum, c) => sum + c.investment_metrics.required_investment, 0),
      economic_impact: {
        job_creation_potential: Math.round(enrichedCities.reduce((sum, c) => sum + c.impact_analysis.production_capacity * SIMULATION_CONSTANTS.JOBS_PER_MW, 0)),
        gdp_contribution: Math.round(enrichedCities.reduce((sum, c) => sum + c.investment_metrics.required_investment * SIMULATION_CONSTANTS.GDP_MULTIPLIER, 0)),
        export_revenue_potential: Math.round(enrichedCities.reduce((sum, c) => sum + c.impact_analysis.production_capacity * SIMULATION_CONSTANTS.EXPORT_PRICE_PER_KG, 0)),
      },
      timeline_projections: {
        phase_1_capacity: 100, // placeholder
        phase_2_capacity: 200, // placeholder
        phase_3_capacity: 300, // placeholder
      },
    };

    // Generate insights and recommendations
    const insights = [
      `Top city: ${enrichedCities[0]?.name}`,
      `Average cost efficiency: ${summary.average_cost_efficiency}`,
    ];
    const recommendations = [
      `Invest in ${enrichedCities[0]?.name} for best results.`
    ];

    // Risk analysis placeholder
    const risk_analysis = {
      overall_feasibility: 'medium',
      key_risks: ['Water security', 'Policy uncertainty'],
      mitigation_strategies: ['Diversify water sources', 'Engage with policymakers'],
    };

    const simulationResult: SimulationResult = {
      id: simulationId,
      scenario,
      results: {
        top_cities: enrichedCities,
        summary,
        insights,
        recommendations,
        risk_analysis,
      },
      created_at: new Date(),
      execution_time_ms: Date.now() - startTime,
      metadata: {
        cities_analyzed: enrichedCities.length,
        constraints_applied: scenario.constraints ? Object.keys(scenario.constraints).length : 0,
        scenario_type: SimulationController.detectScenarioType(scenario),
      },
    };

    // Store simulation in history
    await SimulationController.storeSimulationHistory(simulationResult);

    return NextResponse.json({
      success: true,
      simulation: simulationResult,
      metadata: {
        scenario_type: simulationResult.metadata.scenario_type,
        cities_analyzed: simulationResult.metadata.cities_analyzed,
        execution_time_ms: simulationResult.execution_time_ms,
        weightings_applied: scenario.weights,
        constraints_applied: scenario.constraints,
      },
    });
  } catch (error) {
    console.error('Error in runSimulation:', error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const id = req.nextUrl.pathname.split("/").pop();
    const simulation = id ? await SimulationController.retrieveSimulationById(id) : null;

    if (!simulation) {
      return NextResponse.json({
        success: false,
        error: 'Simulation not found',
        message: `No simulation found with ID: ${id}`,
      }, { status: 404 });
    }

    // Add comparative analysis with current data
    const currentComparison = await SimulationController.generateCurrentComparison(simulation);

    return NextResponse.json({
      success: true,
      simulation,
      current_comparison: currentComparison,
      metadata: {
        simulation_age_hours: Math.round((Date.now() - simulation.created_at.getTime()) / (1000 * 60 * 60)),
        is_recent: (Date.now() - simulation.created_at.getTime()) < (24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error('Error in getSimulation:', error);
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export class SimulationController {
  // Helper static methods
  static generateSimulationId(): string {
    return 'sim_' + Math.random().toString(36).substr(2, 9);
  }

  static async runWeightedAnalysis(scenario: SimulationScenario, limit: number) {
    return await Simulation.runScenarioAnalysis(scenario, limit);
  }

  static async calculateImpactAnalysis(city: any, scenario: SimulationScenario) {
    return {
      production_capacity: city.renewable_score * 10,
      demand_coverage: city.industrial_score * 5,
      cost_efficiency: 100 - city.weighted_score,
      environmental_impact: city.renewable_score * 2 - city.industrial_score
    };
  }

  static async getDefaultCityRank(cityId: number) {
    return null;
  }

  static generateSimulationSummary(cities: any[], scenario: SimulationScenario) {
    return {
      total_production_capacity: cities.reduce((sum: number, c: any) => sum + c.impact_analysis.production_capacity, 0),
      total_demand_coverage: cities.reduce((sum: number, c: any) => sum + c.impact_analysis.demand_coverage, 0),
      average_cost_efficiency: cities.length ? cities.reduce((sum: number, c: any) => sum + c.impact_analysis.cost_efficiency, 0) / cities.length : 0,
      carbon_reduction_potential: cities.reduce((sum: number, c: any) => sum + c.impact_analysis.environmental_impact, 0),
      investment_required: cities.length * 1000000
    };
  }

  static generateSimulationInsights(cities: any[], scenario: SimulationScenario) {
    return [
      `Top city: ${cities[0]?.name}`,
      `Average cost efficiency: ${SimulationController.generateSimulationSummary(cities, scenario).average_cost_efficiency}`
    ];
  }

  static generateSimulationRecommendations(cities: any[], scenario: SimulationScenario) {
    return [
      `Invest in ${cities[0]?.name} for best results.`
    ];
  }

  static async storeSimulationHistory(simulationResult: SimulationResult) {
    return await Simulation.storeSimulation(simulationResult);
  }

  static detectScenarioType(scenario: SimulationScenario) {
    return Simulation.detectScenarioType ? Simulation.detectScenarioType(scenario) : (scenario.name || 'custom');
  }

  static async retrieveSimulationById(simId: string): Promise<SimulationResult|null> {
    return await Simulation.findById(simId);
  }

  static async generateCurrentComparison(simulation: SimulationResult) {
    return await Simulation.compareWithBaseline(simulation.id);
  }

  // Add static method for presets
  static async getPresetScenarios(req: NextRequest): Promise<NextResponse> {
    try {
      const presets: PresetScenario[] = [
        {
          id: 'renewable_focus',
          name: 'Renewable Energy Focus',
          description: 'Prioritizes locations with maximum renewable energy potential',
          weights: { renewable: 50, water: 20, industrial: 15, logistics: 15 },
          use_case: 'Green hydrogen production with minimal carbon footprint',
        },
        {
          id: 'industrial_demand',
          name: 'Industrial Demand Priority',
          description: 'Optimizes for high industrial hydrogen consumption',
          weights: { renewable: 15, water: 20, industrial: 45, logistics: 20 },
          use_case: 'Supply hydrogen to existing heavy industries',
        },
        {
          id: 'export_oriented',
          name: 'Export-Oriented Development',
          description: 'Focuses on logistics and port connectivity for exports',
          weights: { renewable: 25, water: 15, industrial: 20, logistics: 40 },
          use_case: 'International hydrogen trade and export',
        },
        {
          id: 'cost_optimized',
          name: 'Cost Optimization',
          description: 'Balances all factors for minimum total cost',
          weights: { renewable: 30, water: 25, industrial: 25, logistics: 20 },
          use_case: 'Economically viable hydrogen hub development',
        },
        {
          id: 'water_secure',
          name: 'Water Security Priority',
          description: 'Emphasizes water availability and sustainability',
          weights: { renewable: 20, water: 45, industrial: 20, logistics: 15 },
          use_case: 'Sustainable water usage for electrolysis',
        },
        {
          id: 'rapid_deployment',
          name: 'Rapid Deployment',
          description: 'Focuses on existing infrastructure for quick implementation',
          weights: { renewable: 20, water: 15, industrial: 35, logistics: 30 },
          use_case: 'Fast hydrogen infrastructure rollout',
        },
      ];

      return NextResponse.json({
        success: true,
        presets,
        metadata: {
          total_presets: presets.length,
          categories: ['renewable_focus', 'industrial_demand', 'export_oriented', 'cost_optimized', 'water_secure', 'rapid_deployment'],
          last_updated: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error('Error in getPresetScenarios:', error);
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  public static async runSimulation(req: NextRequest): Promise<NextResponse> {
    try {
      const startTime = Date.now();
      const { scenario, limit = 10 } = await req.json();

      if (!scenario || !scenario.weights) {
        return NextResponse.json({
          success: false,
          error: 'Scenario with weights is required',
          message: 'Please provide a valid scenario object with weights'
        }, { status: 400 });
      }

      const cityLimit = Math.min(parseInt(limit), 50);
      const simulationId = SimulationController.generateSimulationId();
      const cities = await SimulationController.runWeightedAnalysis(scenario, cityLimit);
      const enrichedCities = await Promise.all(
        cities.map(async (city: any, index: number) => {
          const impactAnalysis = await SimulationController.calculateImpactAnalysis(city, scenario);
          const defaultRank = await SimulationController.getDefaultCityRank(city.id);
          return {
            ...city,
            rank: index + 1,
            change_from_default: defaultRank ? (defaultRank - (index + 1)) : null,
            impact_analysis: impactAnalysis
          };
        })
      );
      const summary = SimulationController.generateSimulationSummary(enrichedCities, scenario);
      const insights = SimulationController.generateSimulationInsights(enrichedCities, scenario);
      const recommendations = SimulationController.generateSimulationRecommendations(enrichedCities, scenario);
      const simulationResult: SimulationResult = {
        id: simulationId,
        scenario,
        results: {
          top_cities: enrichedCities,
          summary,
          insights,
          recommendations
        },
        created_at: new Date(),
        execution_time_ms: Date.now() - startTime
      };
      await SimulationController.storeSimulationHistory(simulationResult);
      return NextResponse.json({
        success: true,
        simulation: simulationResult,
        metadata: {
          scenario_type: SimulationController.detectScenarioType(scenario),
          cities_analyzed: enrichedCities.length,
          execution_time_ms: simulationResult.execution_time_ms,
          weightings_applied: scenario.weights
        }
      });
    } catch (error) {
      console.error('Error in runSimulation:', error);
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }

  public static async getSimulation(req: NextRequest): Promise<NextResponse> {
    try {
      const id = req.nextUrl.pathname.split("/").pop();
      const simulation = id ? await SimulationController.retrieveSimulationById(id) : null;

      if (!simulation) {
        return NextResponse.json({
          success: false,
          error: 'Simulation not found',
          message: `No simulation found with ID: ${id}`
        }, { status: 404 });
      }

      const currentComparison = await SimulationController.generateCurrentComparison(simulation);

      return NextResponse.json({
        success: true,
        simulation,
        current_comparison: currentComparison,
        metadata: {
          simulation_age_hours: Math.round((Date.now() - simulation.created_at.getTime()) / (1000 * 60 * 60)),
          is_recent: (Date.now() - simulation.created_at.getTime()) < (24 * 60 * 60 * 1000),
        },
      });
    } catch (error) {
      console.error('Error in getSimulation:', error);
      let message = 'Unknown error';
      if (error instanceof Error) message = error.message;
      return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
  }
}
