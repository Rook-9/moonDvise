import OpenAI from 'openai';

export interface CosmicAnalysisRequest {
  userData: {
    date: string;
    city: string;
  };
  interviewData: {
    date: string;
    city: string;
  };
  astrologerAspects: any;
}

export interface CosmicAnalysisResponse {
  cosmicAlignmentScore: number;
  favorableFactors: string[];
  cosmicChallenges: string[];
  cosmicInterviewGuidance: string[];
  analysis: string;
}

// Simple cache for consistent results
const analysisCache = new Map<string, CosmicAnalysisResponse>();

function generateCacheKey(userData: { date: string; city: string }, interviewData: { date: string; city: string }): string {
  return `${userData.date}-${userData.city}-${interviewData.date}-${interviewData.city}`;
}

export function clearAnalysisCache(): void {
  analysisCache.clear();
  console.log('Analysis cache cleared');
}

function getOpenAIKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;
  if (!key) {
    throw new Error('Missing VITE_OPENAI_API_KEY environment variable');
  }
  if (key === 'your_openai_api_key_here') {
    throw new Error('Please replace VITE_OPENAI_API_KEY with your actual OpenAI API key in .env file');
  }
  return key;
}

const openai = new OpenAI({
  apiKey: getOpenAIKey(),
  dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
});

export async function analyzeCosmicCareer(
  userData: { date: string; city: string },
  interviewData: { date: string; city: string },
  astrologerAspects: any
): Promise<CosmicAnalysisResponse> {
  try {
    // Check cache first
    const cacheKey = generateCacheKey(userData, interviewData);
    if (analysisCache.has(cacheKey)) {
      console.log('Using cached analysis for:', cacheKey);
      return analysisCache.get(cacheKey)!;
    }
    const prompt = `
You are an expert astrologer specializing in career guidance and interview timing. Analyze the following synastry aspects between a person's birth chart and their intended interview time/location.

USER BIRTH DATA:
- Date & Time: ${userData.date}
- Location: ${userData.city}

INTERVIEW DATA:
- Date & Time: ${interviewData.date}
- Location: ${interviewData.city}

ASTROLOGER API ASPECTS DATA:
${JSON.stringify(astrologerAspects, null, 2)}

Please provide a comprehensive cosmic career analysis in the following JSON format:

{
  "cosmicAlignmentScore": 85,
  "favorableFactors": [
    "Mercury enhances communication skills during the interview",
    "Jupiter supports confidence and positive outcomes",
    "Moon phase indicates emotional stability",
    "Venus brings charisma and likability",
    "Sun alignment suggests strong personal power"
  ],
  "cosmicChallenges": [
    "Mars may cause nervousness - practice breathing exercises",
    "Saturn requires thorough preparation and patience",
    "Eclipse energy suggests need for flexibility"
  ],
  "cosmicInterviewGuidance": [
    "Wear colors that align with your ruling planet",
    "Practice answers during the waxing moon phase",
    "Arrive 15 minutes early to ground your energy",
    "Bring a small crystal or talisman for confidence"
  ],
  "analysis": "The cosmic alignment for this interview timing is favorable overall. The aspects indicate strong communication potential and emotional stability, though some nervous energy may need to be managed through preparation and grounding techniques."
}

Guidelines:
- cosmicAlignmentScore: 0-100, where 80+ is highly favorable, 60-79 is favorable, below 60 needs caution
- favorableFactors: 3-5 specific positive astrological influences
- cosmicChallenges: 3-5 potential obstacles or areas requiring attention
- cosmicInterviewGuidance: 3-5 practical advice based on the aspects
- analysis: 2-3 sentence summary of the overall cosmic situation

Focus on practical, actionable insights that can help with interview preparation and timing.

IMPORTANT: Respond with ONLY the JSON object. Do not include any markdown formatting, code blocks, or explanatory text outside the JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini as gpt-5-nano doesn't exist
      messages: [
        {
          role: "system",
          content: "You are an expert astrologer providing career guidance. Respond ONLY with valid JSON in the exact format requested. Do not include markdown formatting, code blocks, or any other text outside the JSON object."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    try {
      let jsonText = responseText.trim();
      
      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '');
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '');
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.replace(/\s*```$/, '');
      }
      
      const analysis = JSON.parse(jsonText);
      
      // Validate the response structure
      if (!analysis.cosmicAlignmentScore || !analysis.favorableFactors || !analysis.cosmicChallenges || !analysis.cosmicInterviewGuidance) {
        throw new Error('Invalid response structure from OpenAI');
      }

      const result = analysis as CosmicAnalysisResponse;
      
      // Cache the result
      analysisCache.set(cacheKey, result);
      console.log('Cached analysis for:', cacheKey);
      
      return result;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      console.error('Parse error:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

  } catch (error) {
    console.error('Error analyzing cosmic career:', error);
    throw error;
  }
}
