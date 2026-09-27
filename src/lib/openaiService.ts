import OpenAI from 'openai';
import type { Language } from '../components/LocalizationContext';
import type { AspectScore } from './aspectScoring';

export interface CosmicAnalysisRequest {
  userData: {
    date: string;
    city: string;
  };
  interviewData: {
    date: string;
    city: string;
  };
  aspectScore: AspectScore;
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
  aspectScore: AspectScore,
  language: Language = 'en'
): Promise<CosmicAnalysisResponse> {
  try {
    const openai = new OpenAI({
      apiKey: getOpenAIKey(),
      dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
    });

    const responseLanguage = language === 'ru' ? 'Russian' : 'English';

    const prompt = `
  You are an expert astrologer specializing in career guidance and interview timing. Interpret the scored synastry aspects between a person's birth chart and their intended interview time/location.

Write every user-facing value in ${responseLanguage}. Do not mix languages.

CRITICAL: This analysis is for a SPECIFIC interview time and location. The timing and location details are crucial for accurate astrological guidance.

USER BIRTH DATA:
- Date & Time: ${userData.date}
- Location: ${userData.city}

INTERVIEW DATA:
- Date & Time: ${interviewData.date}
- Location: ${interviewData.city}

DETERMINISTIC SCORE:
- Points: ${aspectScore.points}/${aspectScore.maxPoints}
- Percentage: ${aspectScore.percentage}%

TOP POSITIVE ASPECTS:
${JSON.stringify(aspectScore.positiveAspects, null, 2)}

TOP NEGATIVE ASPECTS:
${JSON.stringify(aspectScore.negativeAspects, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Analyze the SPECIFIC timing and location provided above
2. Consider how the interview time and location interact with the birth chart
3. Provide unique insights based on the exact astrological aspects for this specific combination
4. Do NOT use generic advice - tailor everything to the specific data provided
5. Return the supplied deterministic percentage exactly; do not change the score.
6. Discuss only the supplied aspects and explain how to work with the challenging ones.
7. Make each factor and piece of advice specific to the listed planets, aspect type, and orb. Avoid generic astrological advice.

Please provide a comprehensive cosmic career analysis in the following JSON format:

{
  "cosmicAlignmentScore": ${aspectScore.percentage},
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
- cosmicAlignmentScore: Return exactly ${aspectScore.percentage}, calculated from ${aspectScore.points}/${aspectScore.maxPoints} points.
- favorableFactors: 3-5 specific positive astrological influences based on the exact aspects
- cosmicChallenges: 3-5 potential obstacles specific to this timing/location combination
- cosmicInterviewGuidance: 3-5 practical advice tailored to the specific astrological situation
- analysis: 2-3 sentence summary that references the specific timing and location

CRITICAL: Make the interpretation specific to the exact interview date and hour and the supplied aspects. Do not invent aspects or repeat generic advice.

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

      analysis.cosmicAlignmentScore = aspectScore.percentage;

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
