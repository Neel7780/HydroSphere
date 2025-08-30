import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config();

// Check if environment variables are set
if (!process.env.SUPABASE_URL) {
  console.error("❌ SUPABASE_URL environment variable is required");
  console.log("Please add the following to your .env.local file:");
  console.log("SUPABASE_URL=your_supabase_project_url");
  console.log("SUPABASE_SERVICE_KEY=your_supabase_service_key");
  console.log("HF_API_KEY=your_hugging_face_api_key");
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_KEY) {
  console.error("❌ SUPABASE_SERVICE_KEY environment variable is required");
  console.log("Please add the following to your .env.local file:");
  console.log("SUPABASE_URL=your_supabase_project_url");
  console.log("SUPABASE_SERVICE_KEY=your_supabase_service_key");
  console.log("HF_API_KEY=your_hugging_face_api_key");
  process.exit(1);
}

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string
);

const HF_API_KEY = process.env.HF_API_KEY;

// Hugging Face Embedding API
async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(text),
    }
  );

  const result = await response.json();
  return result[0]; // returns [384] vector
}

// Comprehensive knowledge chunks covering all clean energy topics
const dummyChunks: string[] = [
  // Green Hydrogen & Fuels
  "Green hydrogen is produced using renewable energy sources like solar and wind through electrolysis, creating a clean fuel that produces only water when used.",
  "Green fuels include hydrogen, ammonia, synthetic fuels, and biofuels that offer carbon-neutral alternatives to fossil fuels for aviation, shipping, and heavy transport.",
  "Green ammonia is produced from green hydrogen and nitrogen, serving as a carbon-free fuel for shipping and a hydrogen carrier for international trade.",
  
  // Renewable Energy
  "Solar energy is crucial for green hydrogen production, especially in sunny regions where large-scale solar farms can power electrolyzers during peak sunlight hours.",
  "Wind energy, both onshore and offshore, provides key renewable power for green hydrogen production, with coastal wind farms particularly valuable for export facilities.",
  "Renewable energy costs have dropped 70-90% in the last decade, making clean electricity increasingly competitive with fossil fuels.",
  "Battery storage provides short-term energy storage while hydrogen offers long-term storage, together creating complete renewable energy systems.",
  
  // Environmental Benefits
  "Green energy technologies significantly reduce greenhouse gas emissions, air pollution, and environmental degradation compared to fossil fuels.",
  "Renewable energy and green fuels can reduce CO2 emissions by 70-80% in sectors like industry and transportation, critical for meeting climate goals.",
  "Clean energy eliminates air pollutants like NOx, SO2, and particulates that cause health problems, while green fuels produce only water vapor.",
  "Green technologies can eliminate 80% of industrial emissions through electrification and green fuel substitution in hard-to-abate sectors.",
  
  // Economic Aspects
  "The clean energy transition creates jobs, reduces long-term energy costs, and builds energy independence, with green hydrogen potentially becoming a $2.5 trillion market by 2050.",
  "The renewable energy sector creates 3x more jobs per dollar invested than fossil fuels, including manufacturing, installation, maintenance, and research positions.",
  "Clean energy attracts massive investment - over $1.8 trillion globally in 2023, with early movers gaining competitive advantages in the growing green economy.",
  "Green bonds, carbon credits, and government incentives make renewable energy projects increasingly attractive to investors.",
  
  // Transportation Applications
  "Green hydrogen powers fuel cell vehicles, ships, trains, and aircraft, offering long-range, fast-refueling solutions for heavy transport that batteries can't easily serve.",
  "Maritime shipping can use green ammonia and hydrogen as clean fuels, eliminating the 3% of global emissions from international shipping.",
  "Hydrogen fuel cell vehicles offer 300+ mile range and 3-minute refueling, ideal for trucks, buses, and long-distance transport.",
  "Heavy-duty trucks benefit from hydrogen fuel cells for long-haul transport, offering quick refueling and high payload capacity.",
  "Hydrogen trains are replacing diesel locomotives on non-electrified routes, providing clean rail transport with 600+ mile range.",
  
  // Industrial Applications
  "Green hydrogen can replace coal in steel production, eliminating 7% of global CO2 emissions from this hard-to-abate industrial sector.",
  "Chemical industries use hydrogen for ammonia, methanol, and refining processes, making green hydrogen essential for clean chemical production.",
  "Heavy industries like steel, cement, and chemicals rely on hydrogen for decarbonization, creating massive demand for green hydrogen.",
  
  // Technology & Infrastructure
  "Electrolyzer technology is rapidly improving, with costs falling and efficiency rising. PEM and alkaline electrolyzers are most common, with solid oxide showing promise.",
  "Hydrogen infrastructure includes production facilities, pipelines, storage tanks, and refueling stations, requiring coordinated development for widespread adoption.",
  "Storage and transportation of hydrogen requires specialized infrastructure and safety considerations, with compressed gas, liquid, and chemical carriers as options.",
  
  // Geographic & Site Selection
  "India's National Hydrogen Mission aims to position India as a global green hydrogen hub, leveraging excellent solar and wind resources.",
  "HydroSphere project focuses on identifying optimal locations for green hydrogen production in India using AI-powered site selection.",
  "Key factors for site selection include renewable energy potential, water resources, industrial demand, and logistics infrastructure.",
  "Coastal cities have advantages for hydrogen export due to port facilities, shipping access, and proximity to industrial clusters.",
  "Visakhapatnam is a strong candidate for green hydrogen production due to port access, industrial clusters, and renewable energy potential.",
  "Optimal sites for green energy projects have excellent renewable resources, water access, industrial demand, and export infrastructure like ports.",
  
  // Challenges & Solutions
  "Challenges for green hydrogen include water availability, storage infrastructure, cost optimization, and scaling up production capacity.",
  "Economic viability depends on renewable energy costs, electrolyzer efficiency, market demand, and supportive policy frameworks.",
  "International cooperation and standardization are essential for developing global green hydrogen trade and supply chains."
];

async function ingest() {
  console.log("🚀 Starting HydroSphere knowledge base ingestion...");
  
  for (const chunk of dummyChunks) {
    try {
      const embedding = await getEmbedding(chunk);

      const { error } = await supabase.from("hydrosphere_chunks").insert({
        content: chunk,
        embedding,
      });

      if (error) {
        console.error("❌ Insert error:", error);
      } else {
        console.log(`✅ Inserted chunk: ${chunk.substring(0, 40)}...`);
      }
    } catch (err) {
      console.error(`❌ Error processing chunk: ${chunk.substring(0, 40)}...`, err);
    }
  }
  console.log("🎉 Ingestion complete!");
}

ingest();
