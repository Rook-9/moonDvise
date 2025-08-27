export interface GeoDetailsRequestBody {
  location: string;
}

export interface GeoDetailsResponseItem {
  name: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export interface AspectsConfig {
  observation_point?: 'topocentric' | 'geocentric';
  ayanamsha?: 'tropical' | 'sidereal';
  language?: 'en' | 'ru';
  exclude_planets?: string[];
  allowed_aspects?: string[];
  orb_values?: Record<string, number>;
}

export interface AspectsRequestBody {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  latitude: number;
  longitude: number;
  timezone: number;
  config?: AspectsConfig;
}

export type AspectsResponse = unknown;

// Use proxy in development to avoid CORS issues
const API_BASE = import.meta.env.DEV 
  ? '/api/astrology' 
  : 'https://json.freeastrologyapi.com';

function getApiKey(): string {
  const key = import.meta.env.VITE_FREE_ASTROLOGY_API_KEY as string | undefined;
  if (!key) {
    throw new Error('Missing VITE_FREE_ASTROLOGY_API_KEY environment variable');
  }
  if (key === 'your_api_key_here') {
    throw new Error('Please replace VITE_FREE_ASTROLOGY_API_KEY with your actual API key in .env file');
  }
  return key;
}

async function postJson<TReq, TRes>(path: string, body: TReq): Promise<TRes> {
  const apiKey = getApiKey();
  console.log(`Making request to: ${API_BASE}${path}`);
  console.log('Request body:', body);
  console.log('API key (first 8 chars):', apiKey.substring(0, 8) + '...');
  
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('API Error Response:', {
      status: res.status,
      statusText: res.statusText,
      headers: Object.fromEntries(res.headers.entries()),
      body: text
    });
    throw new Error(`API ${path} ${res.status}: ${text}`);
  }
  return res.json() as Promise<TRes>;
}

export async function fetchGeoDetails(location: string): Promise<GeoDetailsResponseItem> {
  // API may return a single object or array depending on service; normalize to first item
  const data = await postJson<GeoDetailsRequestBody, GeoDetailsResponseItem | GeoDetailsResponseItem[]>(
    '/geo-details',
    { location }
  );
  return Array.isArray(data) ? data[0] : data;
}

export async function fetchAspects(req: AspectsRequestBody): Promise<AspectsResponse> {
  return postJson<AspectsRequestBody, AspectsResponse>('/western/aspects', req);
}

export function decomposeLocalDateTime(isoLocal: string) {
  // isoLocal expected like "YYYY-MM-DDTHH:mm" from input[type=datetime-local]
  const d = new Date(isoLocal);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    date: d.getDate(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    seconds: d.getSeconds(),
  };
}

