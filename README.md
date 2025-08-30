# HydroSphere - Green Hydrogen Infrastructure Platform

A comprehensive Web GIS platform for optimizing green hydrogen infrastructure placement in India through data-driven mapping and visualization tools.

## 🚀 Features

### 1. **Infrastructure Mapping Dashboard** (`/map`)
- **Interactive GIS Map**: Leaflet.js-powered map centered on India
- **Multi-Layer Visualization**: 
  - Renewable energy zones (solar, wind, hydro)
  - Water resource mapping with river basins
  - Industrial cluster identification with heatmaps
  - Logistics infrastructure (ports, airports, transport networks)
- **Real-time Data**: PostGIS spatial database integration
- **Layer Controls**: Toggle different infrastructure layers
- **Satellite View**: Switch between OpenStreetMap and satellite imagery

### 2. **Top 5 Cities Finder** (`/top-cities`)
- **AI-Powered Ranking**: Multi-factor scoring algorithm
- **Custom Weighting**: Adjust renewable, water, industrial, and logistics priorities
- **Interactive Controls**: Real-time sliders for factor adjustment
- **Detailed Profiles**: Deep-dive into individual city data
- **Demo Mode**: Works without database connection
- **Export Capability**: Generate reports and analysis

### 3. **Hydrogen Infrastructure Dashboard** (`/hydrogen`) ⭐ **NEW**
- **Production Overview**: Total capacity, current production, efficiency metrics
- **Electrolysis Plants**: Real-time monitoring of hydrogen production facilities
- **Storage Facilities**: Track hydrogen storage infrastructure
- **Distribution Network**: Monitor delivery and transport systems
- **Policy Support**: National Hydrogen Mission and state incentives tracking
- **Technology Tracking**: PEM, Alkaline, and Solid Oxide electrolysis technologies

### 4. **Scenario Simulator** (`/simulate`)
- **What-If Analysis**: Test different investment strategies
- **Dynamic Weighting**: Adjust factor priorities in real-time
- **Constraint Testing**: Set minimum thresholds for various factors
- **Future Scenarios**: Model 2025, 2030, and 2035 projections
- **Impact Visualization**: Color-coded results and insights

### 5. **Export & Reporting** ⭐ **NEW**
- **Comprehensive Reports**: City rankings, infrastructure analysis, scenario results
- **Multiple Formats**: JSON and CSV export options
- **Custom Filters**: Generate reports based on specific criteria
- **Insights Generation**: AI-powered recommendations and analysis

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Leaflet.js**: Interactive mapping
- **React-Leaflet**: React components for Leaflet
- **Lucide React**: Beautiful icons

### Backend
- **Supabase**: PostgreSQL as a service with PostGIS
- **PostGIS**: Advanced spatial database capabilities
- **Real-time APIs**: Live data updates
- **RESTful Endpoints**: Clean API architecture

### Key Libraries
- **SWR**: Data fetching and caching
- **React Hook Form**: Form management
- **Zod**: Schema validation
- **Recharts**: Data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd HACKOUT
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Set up database** (Optional)
   - Follow the `SUPABASE_SETUP.md` guide
   - Or run in demo mode without database

5. **Start development server**
   ```bash
   pnpm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📊 Database Schema

### Core Tables
- **cities**: City data with spatial coordinates and scores
- **renewable_zones**: Renewable energy potential areas
- **water_resources**: Water availability and quality data
- **industrial_clusters**: Industrial demand and employment data
- **logistics_infrastructure**: Transport and connectivity data
- **hydrogen_infrastructure**: Electrolysis plants, storage, distribution
- **simulation_scenarios**: Saved scenario configurations

### Spatial Features
- **PostGIS Integration**: Advanced geographic queries
- **Geometry Columns**: Point, polygon, and line geometries
- **Spatial Indexing**: High-performance location-based queries

## 🎯 Hackathon Features

### Problem Statement Alignment
✅ **Green Hydrogen Focus**: Infrastructure specifically for hydrogen production
✅ **India-Specific Data**: Real Indian cities with accurate coordinates
✅ **Multi-Factor Analysis**: Renewable + Water + Industrial + Logistics
✅ **Policy Integration**: National Hydrogen Mission support tracking
✅ **Export Capabilities**: Professional reporting for stakeholders

### Technical Excellence
✅ **Full-Stack Web GIS**: Advanced mapping with PostGIS
✅ **Real-time Updates**: Live data processing and visualization
✅ **AI-Powered Ranking**: Intelligent multi-factor scoring
✅ **Professional UI**: Modern, responsive design
✅ **Scalable Architecture**: Production-ready codebase

## 📈 Demo Features

### For Judges & Presentations
1. **"Watch how changing renewable energy priority from 25% to 80% completely reshuffles the top cities!"**
2. **"See how our spatial analysis identifies the perfect hydrogen hub location considering water, industry, and logistics!"**
3. **"Our PostGIS database enables real-time proximity calculations and infrastructure optimization!"**
4. **"Monitor real-time hydrogen infrastructure development across India!"**

### Key Metrics
- **500 MW** total electrolysis capacity
- **85%** average efficiency
- **$3.50/kg** production cost target
- **10 major cities** with comprehensive data
- **5 infrastructure types** tracked

## 🔧 Development

### Project Structure
```
HACKOUT/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── map/               # Mapping dashboard
│   ├── top-cities/        # City rankings
│   ├── hydrogen/          # Hydrogen infrastructure
│   └── simulate/          # Scenario simulator
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── scripts/               # Database setup and sample data
└── types/                 # TypeScript type definitions
```

### Key API Endpoints
- `GET /api/map/layers` - Map visualization data
- `GET /api/cities/top` - City rankings with custom weights
- `GET /api/hydrogen/infrastructure` - Hydrogen infrastructure data
- `POST /api/simulation/scenario` - Run scenario simulations
- `POST /api/export/report` - Generate comprehensive reports

## 🎨 UI Components

### Design System
- **Shadcn/ui**: Modern component library
- **Tailwind CSS**: Utility-first styling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

### Key Components
- **MapView**: Interactive GIS visualization
- **CityCard**: Detailed city information display
- **ScenarioControls**: Interactive simulation controls
- **HydrogenDashboard**: Infrastructure monitoring

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Static site hosting
- **Railway**: Full-stack deployment
- **DigitalOcean**: Custom server deployment

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For hackathon judges and stakeholders:
- **Live Demo**: Available at deployment URL
- **Documentation**: Comprehensive setup guides included
- **Demo Mode**: Works without database connection
- **Export Reports**: Generate professional analysis documents

---

**Built for the Green Hydrogen Infrastructure Hackathon** 🏆
*Transforming complex renewable energy data into actionable insights for hydrogen infrastructure development in India.*
