import { NextRequest, NextResponse } from "next/server";

// Initialize services only if environment variables are available
let groq: any = null;
let supabase: any = null;

try {
  if (process.env.GROQ_API_KEY) {
    const Groq = require("groq-sdk");
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    const { createClient } = require("@supabase/supabase-js");
    supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string
    );
  }
} catch (error) {
  console.log("Services not initialized - running in fallback mode");
}

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
  return result[0];
}

type ChatRequest = { message: string };
type ChatResponse = { reply?: string; error?: string };

// Dynamic response generator with multiple variants for each topic
function generateDynamicResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Multiple response variants for each topic to avoid repetition
  const responseVariants = {
    greetings: [
      "Hello! I'm HydroBot, your clean energy assistant. What would you like to know about renewable energy or green fuels?",
      "Hi there! I'm here to help with questions about hydrogen, renewable energy, and sustainable technology. How can I assist you?",
      "Welcome! I specialize in clean energy topics including green hydrogen, environmental impacts, and sustainable solutions. What interests you?"
    ],
    
    hydrogen: [
      "Green hydrogen is produced through electrolysis using renewable electricity to split water. It's completely clean - producing only water when used as fuel.",
      "Hydrogen can be produced in different ways, but green hydrogen uses renewable energy for electrolysis, making it carbon-free. It's key for decarbonizing heavy industry.",
      "Green hydrogen offers unique advantages: long-term energy storage, clean industrial feedstock, and zero-emission fuel for transportation. Production costs are falling rapidly.",
      "The hydrogen economy is emerging as renewable costs drop. Green hydrogen can replace fossil fuels in steel, chemicals, shipping, and aviation where electrification is challenging."
    ],
    
    renewable: [
      "Renewable energy from solar, wind, and hydro is becoming the cheapest electricity source globally. It's essential for producing green hydrogen and achieving climate goals.",
      "Solar and wind costs have dropped 85% and 70% respectively in the last decade. This makes renewable-powered hydrogen production increasingly competitive.",
      "Renewable energy provides clean electricity for electrolysis, industrial processes, and transportation. Combined with storage, it creates resilient energy systems.",
      "The renewable transition is accelerating - over 260 GW of renewable capacity was added globally in 2020, with solar and wind leading growth."
    ],
    
    environment: [
      "Clean energy eliminates air pollution, reduces greenhouse gases, and protects ecosystems. Green hydrogen produces only water vapor when used.",
      "Environmental benefits include 70-80% emission reductions in industry and transport, cleaner air in cities, and reduced climate change impacts.",
      "Renewable energy and green fuels prevent millions of tons of CO2 emissions annually while creating healthier communities through cleaner air.",
      "The environmental case is clear: clean energy prevents climate change, reduces health costs from pollution, and preserves natural resources for future generations."
    ],
    
    economic: [
      "The clean energy economy is booming - $1.8 trillion invested globally in 2023. Green hydrogen could become a $2.5 trillion market by 2050.",
      "Renewable energy creates 3x more jobs per dollar than fossil fuels. The sector employs millions in manufacturing, installation, and maintenance.",
      "Clean energy reduces long-term costs, creates energy independence, and attracts massive investment. Early movers gain competitive advantages.",
      "Economic benefits include job creation, reduced energy imports, lower health costs from cleaner air, and new export opportunities in green fuels."
    ],
    
    transportation: [
      "Hydrogen fuel cells power trucks, ships, trains, and planes with 300+ mile range and 3-minute refueling. Perfect for heavy transport.",
      "Green fuels are transforming transport: hydrogen for long-haul trucks, ammonia for shipping, and sustainable fuels for aviation.",
      "Transportation accounts for 24% of energy-related CO2. Hydrogen and electric vehicles together can eliminate these emissions completely.",
      "Fuel cell vehicles offer advantages over batteries for heavy duty: faster refueling, longer range, and higher payload capacity."
    ],
    
    technology: [
      "Electrolyzer technology is advancing rapidly - costs falling 30% annually with efficiency improvements. PEM, alkaline, and solid oxide types serve different needs.",
      "Hydrogen infrastructure includes production, storage, pipelines, and refueling stations. Coordinated development is creating hydrogen corridors globally.",
      "Storage solutions range from compressed gas to liquid hydrogen to chemical carriers like ammonia. Each suits different applications and distances.",
      "Innovation is accelerating across the hydrogen value chain: better electrolyzers, advanced storage, fuel cells, and safety systems."
    ],
    
    india: [
      "India has world-class solar and wind resources, making it ideal for green hydrogen. The National Hydrogen Mission targets 5 MMT production by 2030.",
      "India's advantages include abundant renewable energy, large industrial demand, skilled workforce, and government support through the National Hydrogen Mission.",
      "Coastal states like Gujarat, Tamil Nadu, and Andhra Pradesh are emerging as hydrogen hubs with ports, renewables, and industrial clusters.",
      "India could become a major hydrogen exporter, leveraging low renewable costs and strategic location between Europe and Asia markets."
    ],
    
    industrial: [
      "Heavy industries like steel, cement, and chemicals need hydrogen for decarbonization. Green hydrogen can replace coal in steel, eliminating 7% of global emissions.",
      "Industrial applications include steel production, ammonia synthesis, oil refining, and chemical processes. These create massive hydrogen demand.",
      "Green hydrogen enables clean industrial processes: direct reduction in steel, high-temperature heat for cement, and feedstock for chemicals.",
      "Industrial decarbonization requires both electrification and green hydrogen. Together they can eliminate 80% of industrial emissions."
    ]
  };
  
  // Determine topic and select random response variant
  let selectedResponses = responseVariants.greetings;
  
  // Check for greetings first, but only for simple greetings
  if ((lowerMessage === 'hello' || lowerMessage === 'hi' || lowerMessage === 'hey') || 
      (lowerMessage.includes('hello') && lowerMessage.length < 10) ||
      (lowerMessage.includes('hi') && lowerMessage.length < 10)) {
    selectedResponses = responseVariants.greetings;
  }
  // Check for content topics (prioritize over greetings for longer messages)
  else if (lowerMessage.includes('hydrogen') || lowerMessage.includes('h2') || lowerMessage.includes('fuel')) {
    selectedResponses = responseVariants.hydrogen;
  } else if (lowerMessage.includes('renewable') || lowerMessage.includes('solar') || lowerMessage.includes('wind') || lowerMessage.includes('energy')) {
    selectedResponses = responseVariants.renewable;
  } else if (lowerMessage.includes('environment') || lowerMessage.includes('climate') || lowerMessage.includes('emission') || lowerMessage.includes('pollution') || lowerMessage.includes('benefit')) {
    selectedResponses = responseVariants.environment;
  } else if (lowerMessage.includes('economic') || lowerMessage.includes('cost') || lowerMessage.includes('job') || lowerMessage.includes('investment') || lowerMessage.includes('money')) {
    selectedResponses = responseVariants.economic;
  } else if (lowerMessage.includes('transport') || lowerMessage.includes('vehicle') || lowerMessage.includes('ship') || lowerMessage.includes('truck') || lowerMessage.includes('car')) {
    selectedResponses = responseVariants.transportation;
  } else if (lowerMessage.includes('technology') || lowerMessage.includes('electrolyzer') || lowerMessage.includes('storage') || lowerMessage.includes('infrastructure')) {
    selectedResponses = responseVariants.technology;
  } else if (lowerMessage.includes('india') || lowerMessage.includes('indian')) {
    selectedResponses = responseVariants.india;
  } else if (lowerMessage.includes('industry') || lowerMessage.includes('steel') || lowerMessage.includes('chemical') || lowerMessage.includes('industrial')) {
    selectedResponses = responseVariants.industrial;
  } else if (lowerMessage.includes('shift') || lowerMessage.includes('change') || lowerMessage.includes('switch') || lowerMessage.includes('why')) {
    // Handle "why don't we shift" type questions
    selectedResponses = [
      "The shift to green fuels faces several challenges: high initial costs, lack of infrastructure, policy barriers, and established fossil fuel systems. However, costs are dropping rapidly and governments are increasing support.",
      "Transitioning to green fuels requires massive infrastructure investment, policy changes, and overcoming entrenched interests. But the benefits - cleaner air, energy security, and climate protection - make it essential.",
      "The main barriers to green fuel adoption are cost, infrastructure, and scale. However, renewable energy costs have plummeted 70-90%, making green fuels increasingly competitive with fossil fuels.",
      "Green fuel adoption is accelerating but faces challenges: upfront investment, infrastructure development, and market inertia. Government incentives and falling renewable costs are driving faster adoption."
    ];
  } else {
    // Default to a helpful response for unrecognized questions
    selectedResponses = [
      "That's an interesting question about clean energy! Green technologies offer solutions for climate change, energy security, and economic growth. What specific aspect would you like to explore?",
      "I'd be happy to help with that topic! The clean energy transition involves renewable power, green fuels, environmental benefits, and economic opportunities. What would you like to know more about?",
      "Great question! Clean energy encompasses many areas - from hydrogen production to renewable power to environmental impacts. Which aspect interests you most?",
      "I can help explain that! The green energy sector includes solar, wind, hydrogen, storage, and transportation applications. What specific information are you looking for?"
    ];
  }
  
  // Return random variant to avoid repetition
  const randomIndex = Math.floor(Math.random() * selectedResponses.length);
  return selectedResponses[randomIndex];
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json() as ChatRequest;

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Always provide fallback responses when environment variables are missing
    if (!process.env.GROQ_API_KEY || !process.env.HF_API_KEY || !process.env.SUPABASE_URL) {
      return NextResponse.json({ reply: generateDynamicResponse(message) });
    }

    return NextResponse.json({ reply: generateDynamicResponse(message) });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ 
      reply: "I'm having some technical difficulties right now. Please try asking about green hydrogen, renewable energy, or the HydroSphere project!" 
    });
  }
}
