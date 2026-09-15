import OpenAI from 'openai';
import type { Language } from '../components/LocalizationContext';

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

export function clearAnalysisCache(): void {
  // Kept for backwards compatibility with callers that explicitly reset analyses.
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

export async function analyzeCosmicCareer(
  userData: { date: string; city: string },
  interviewData: { date: string; city: string },
  astrologerAspects: any,
  language: Language = 'en'
): Promise<CosmicAnalysisResponse> {
  try {
    const openai = new OpenAI({
      apiKey: getOpenAIKey(),
      dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
    });

    const randomSeed = crypto.randomUUID();
    const responseLanguage = language === 'ru' ? 'Russian' : 'English';
    const creativeAngles = ['communication style', 'emotional composure', 'first impression', 'decision-making', 'adaptability'];
    const creativeAngle = creativeAngles[Math.floor(Math.random() * creativeAngles.length)];

    const prompt = `
You are an expert astrologer specializing in career guidance and interview timing. Analyze the following synastry aspects between a person's birth chart and their intended interview time/location.

Write every user-facing value in ${responseLanguage}. Do not mix languages.

CRITICAL: This analysis is for a SPECIFIC interview time and location. The timing and location details are crucial for accurate astrological guidance.

USER BIRTH DATA:
- Date & Time: ${userData.date}
- Location: ${userData.city}

INTERVIEW DATA:
- Date & Time: ${interviewData.date}
- Location: ${interviewData.city}

ASTROLOGER API ASPECTS DATA:
${JSON.stringify(astrologerAspects, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Analyze the SPECIFIC timing and location provided above
2. Consider how the interview time and location interact with the birth chart
3. Provide unique insights based on the exact astrological aspects for this specific combination
4. Do NOT use generic advice - tailor everything to the specific data provided
5. VARY the cosmicAlignmentScore based on the actual astrological aspects - do not default to 88 or any other specific number
6. Consider both favorable and challenging aspects. A result below 75 is expected when the data includes meaningful challenges; do not round scores upward just to make the result positive.
7. Use this fresh perspective for this analysis: ${creativeAngle}
8. Use the full 0-100 scale when the aspects justify it, including scores below 75 and below 60.

Please provide a comprehensive cosmic career analysis in the following JSON format:

{
  "cosmicAlignmentScore": 72,
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
- cosmicAlignmentScore: Choose a score between 0-100 based on the specific aspects. Vary the score based on the actual astrological data. Consider:
  * 85-100: Exceptional alignment (rare, only for very favorable aspects)
  * 70-84: Very favorable alignment
  * 55-69: Moderately favorable alignment
  * 40-54: Challenging but manageable alignment
  * 25-39: Difficult alignment requiring extra preparation
  * 0-24: Very challenging alignment (consider rescheduling)
- favorableFactors: 3-5 specific positive astrological influences based on the exact aspects
- cosmicChallenges: 3-5 potential obstacles specific to this timing/location combination
- cosmicInterviewGuidance: 3-5 practical advice tailored to the specific astrological situation
- analysis: 2-3 sentence summary that references the specific timing and location

CRITICAL: Make sure your analysis is UNIQUE to the specific date, time, and location provided. Do not repeat generic advice.

CREATIVE VARIATION SEED: ${randomSeed}. Use it only to choose different wording and emphasis; the score must still be grounded in the supplied aspects.

IMPORTANT: Respond with ONLY the JSON object. Do not include any markdown formatting, code blocks, or explanatory text outside the JSON.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini as gpt-5-nano doesn't exist
      messages: [
        {
          role: "system",
          content: `You are an expert astrologer providing career guidance in ${responseLanguage}. Each analysis must be unique and tailored to the specific timing and location provided. Never repeat generic advice when the aspects support a more specific observation. Respond ONLY with valid JSON in the exact format requested. Do not include markdown formatting, code blocks, or any other text outside the JSON object.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 1.0, // Maximum temperature for maximum variety
      max_tokens: 1000,
      presence_penalty: 0.5, // Higher penalty for repetition
      frequency_penalty: 0.5, // Higher penalty for frequent tokens
      top_p: 0.9, // Nucleus sampling for more variety
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
      if (typeof analysis.cosmicAlignmentScore !== 'number' || !analysis.favorableFactors || !analysis.cosmicChallenges || !analysis.cosmicInterviewGuidance || !analysis.analysis) {
        throw new Error('Invalid response structure from OpenAI');
      }

      analysis.cosmicAlignmentScore = Math.max(0, Math.min(100, analysis.cosmicAlignmentScore));

      const result = analysis as CosmicAnalysisResponse;

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
