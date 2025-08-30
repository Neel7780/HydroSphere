export type Intent =
  | { type: "city_info"; cityName: string }
  | { type: "comparison"; cities: string[] }
  | { type: "policy_info" }
  | { type: "technical" }
  | { type: "general_hydrogen" }
  | { type: "general"; message: string };

export class AIService {
  static async determineIntent(message: string): Promise<Intent> {
    const lowerMessage = message.toLowerCase();
    const cityKeywords = [
      "visakhapatnam", "gujarat", "ahmedabad", "surat", "mumbai", "delhi",
      "chennai", "bangalore", "hyderabad", "pune", "kolkata", "jaipur",
      "lucknow", "kanpur", "nagpur", "indore", "bhopal", "patna", "vadodara", "coimbatore"
    ];
    const cityMentioned = cityKeywords.find(city => lowerMessage.includes(city));

    if (cityMentioned || lowerMessage.includes("city") || lowerMessage.includes("location")) {
      return { type: "city_info", cityName: cityMentioned || extractCityFromMessage(message) };
    }
    if (["compare", "vs", "versus", "difference"].some(k => lowerMessage.includes(k))) {
      return { type: "comparison", cities: extractCitiesFromMessage(message) };
    }
    if (["policy", "mission", "government", "initiative"].some(k => lowerMessage.includes(k))) {
      return { type: "policy_info" };
    }
    if (["electrolysis", "production", "storage", "transport", "technology"].some(k => lowerMessage.includes(k))) {
      return { type: "technical" };
    }
    if (["hydrogen", "green energy", "renewable"].some(k => lowerMessage.includes(k))) {
      return { type: "general_hydrogen" };
    }
    return { type: "general", message };
  }

  static async getHydrogenInfo(message: string) {
    const lowerMessage = message.toLowerCase();
    let answer = "";

    if (lowerMessage.includes("green") && lowerMessage.includes("blue")) {
      answer = `... (same text as before)`;
    } else if (lowerMessage.includes("advantage") || lowerMessage.includes("benefit")) {
      answer = `... (same text as before)`;
    } else {
      answer = `... (same text as before)`;
    }

    return {
      answer: answer.trim(),
      sources: ["Green Hydrogen Knowledge Base", "National Green Hydrogen Mission"],
      suggestions: [
        "What are the cost factors for green hydrogen?",
        "Which industries will benefit most from green hydrogen?",
        "How does India compare globally in hydrogen development?"
      ]
    };
  }

  static async getGeneralResponse(message: string) {
    const lowerMessage = message.toLowerCase();

    const responses = {
      greeting: { ... },
      help: { ... },
      default: { ... }
    };

    if (responses.greeting.keywords.some((k: string) => lowerMessage.includes(k))) {
      return responses.greeting;
    }
    if (responses.help.keywords.some((k: string) => lowerMessage.includes(k))) {
      return responses.help;
    }
    return responses.default;
  }
}

function extractCityFromMessage(message: string): string {
  const cities = ["visakhapatnam", "gujarat", "ahmedabad", "surat", "mumbai", "delhi", "chennai", "bangalore", "hyderabad", "pune", "kolkata", "jaipur"];
  return cities.find(city => message.toLowerCase().includes(city)) || "";
}

function extractCitiesFromMessage(message: string): string[] {
  const cities = ["visakhapatnam", "gujarat", "ahmedabad", "surat", "mumbai", "delhi", "chennai", "bangalore"];
  return cities.filter(city => message.toLowerCase().includes(city));
}
