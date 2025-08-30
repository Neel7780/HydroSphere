# Supabase Setup Guide for HydroSphere

## Quick Setup (30 minutes)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create new project
3. Choose a name (e.g., "hydrosphere-gis")
4. Set database password (save it!)
5. Choose region closest to India (e.g., Asia Pacific)

### 2. Get Project Credentials
1. Go to Project Settings → API
2. Copy these values:
   - Project URL
   - Anon (public) key

### 3. Update Environment Variables
Create `.env.local` file in your project root:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Set Up Database
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the entire content of `scripts/sample-data.js`
3. Click "Run" to execute

### 5. Test Your Setup
1. Run `pnpm run dev`
2. Visit `/map` - should show India with layers
3. Visit `/top-cities` - should show cities with simulator

## What You Get

✅ **Full-Stack Web GIS Platform**
- PostGIS spatial database
- Real-time data processing
- Multi-layer mapping
- AI-powered city ranking

✅ **Advanced Features**
- Scenario simulation
- Infrastructure optimization
- Spatial analysis
- Export capabilities

✅ **India-Specific Data**
- 10 major cities with real coordinates
- Renewable energy zones
- Water resource mapping
- Industrial clusters
- Logistics infrastructure

## Database Schema

- **cities**: Main city data with PostGIS geometry
- **renewable_zones**: Solar, wind, hydro potential zones
- **water_resources**: River basins and groundwater
- **industrial_clusters**: Manufacturing and tech hubs
- **logistics_infrastructure**: Ports, airports, transport
- **simulation_scenarios**: Saved simulation results

## API Endpoints

- `GET /api/map/layers` - Map layer data
- `GET /api/cities/top` - Top cities with custom weights
- `GET /api/cities/[id]` - Individual city details
- `POST /api/simulation/scenario` - Run scenario simulation

## Features Implemented

1. **Infrastructure Mapping Dashboard** ✅
   - GIS-based interactive map of India
   - Renewable energy zones
   - Water resource mapping
   - Industrial cluster identification
   - Logistics infrastructure
   - Layer toggles for correlation analysis

2. **Top 5 Cities Finder** ✅
   - AI-powered ranking algorithm
   - Multi-factor scoring
   - Detailed city profiles
   - Export infrastructure analysis

3. **Scenario Simulator** ✅
   - Interactive what-if analysis
   - Adjustable factor weightings
   - Dynamic ranking updates
   - Future scenario testing
   - Impact visualization

## Next Steps for Hackathon

1. **Add Real Data**: Replace sample data with actual Indian renewable energy data
2. **Policy Integration**: Add government policy impact analysis
3. **Investment Tools**: Create ROI calculators for hydrogen infrastructure
4. **Export Features**: Add PDF/Excel export for reports
5. **Real-time Updates**: Integrate live renewable energy data feeds

## Troubleshooting

**Map not loading?**
- Check Supabase credentials in `.env.local`
- Ensure database tables are created
- Check browser console for errors

**API errors?**
- Verify Supabase project is active
- Check RLS (Row Level Security) settings
- Ensure tables have data

**Performance issues?**
- Check spatial indexes are created
- Monitor Supabase dashboard for query performance
- Consider pagination for large datasets

## Support

For hackathon support:
1. Check Supabase documentation
2. Use Supabase dashboard for database management
3. Monitor API logs in Supabase dashboard
4. Test with smaller datasets first 