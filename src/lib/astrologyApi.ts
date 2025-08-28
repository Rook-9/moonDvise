// Browser-compatible timezone utilities

export interface LocationData {
  date: string;
  city: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  timezone: string;
  displayName: string;
}

export interface AstrologerSubject {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  longitude: number;
  latitude: number;
  city: string;
  nation: string;
  timezone: string;
  name: string;
  zodiac_type: 'Tropic';
  sidereal_mode: null;
  perspective_type: 'Apparent Geocentric';
  houses_system_identifier: 'P';
}

export interface SynastryRequest {
  first_subject: AstrologerSubject;
  second_subject: AstrologerSubject;
  theme: 'classic';
  language: 'EN';
  wheel_only: boolean;
}

export interface SynastryResponse {
  // Will be defined based on actual API response
  aspects?: any[];
  [key: string]: any;
}

// Cache for synastry aspects to debug if API is returning same data
const synastryCache = new Map<string, SynastryResponse>();

function generateSynastryCacheKey(userData: LocationData, interviewData: LocationData): string {
  return `${userData.date}-${userData.city}-${interviewData.date}-${interviewData.city}`;
}



function getAstrologerApiKey(): string {
  const key = import.meta.env.VITE_ASTROLOGER_API as string | undefined;
  if (!key) {
    throw new Error('Missing VITE_ASTROLOGER_API environment variable');
  }
  if (key === 'your_astrologer_api_key_here') {
    throw new Error('Please replace VITE_ASTROLOGER_API with your actual API key in .env file');
  }
  return key;
}

function getOpenCageApiKey(): string {
  const key = import.meta.env.VITE_OPENCAGE_API as string | undefined;
  if (!key) {
    throw new Error('Missing VITE_OPENCAGE_API environment variable');
  }
  if (key === 'your_opencage_api_key_here') {
    throw new Error('Please replace VITE_OPENCAGE_API with your actual API key in .env file');
  }
  return key;
}

/**
 * Simple timezone estimation based on longitude
 * This is a fallback when timezone data isn't available from geocoding services
 */
function estimateTimezoneFromLongitude(longitude: number): string {
  // Rough estimation: each 15 degrees of longitude ≈ 1 hour timezone
  const timezoneOffset = Math.round(longitude / 15);
  
  // Map to common timezone names
  if (timezoneOffset >= -5 && timezoneOffset <= -3) return 'America/New_York';
  if (timezoneOffset >= -8 && timezoneOffset <= -6) return 'America/Los_Angeles';
  if (timezoneOffset >= -1 && timezoneOffset <= 1) return 'Europe/London';
  if (timezoneOffset >= 1 && timezoneOffset <= 3) return 'Europe/Paris';
  if (timezoneOffset >= 5 && timezoneOffset <= 7) return 'Asia/Tashkent';
  if (timezoneOffset >= 7 && timezoneOffset <= 9) return 'Asia/Shanghai';
  if (timezoneOffset >= 9 && timezoneOffset <= 11) return 'Asia/Tokyo';
  
  // Default to UTC if no match
  return 'UTC';
}

/**
 * Get location data using Nominatim (OpenStreetMap)
 */
export async function getLocationData(city: string): Promise<GeoLocation> {
  try {
    // Try Nominatim first (free, no API key required)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    
    const response = await fetch(nominatimUrl);
    if (!response.ok) {
      throw new Error(`Nominatim request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data || data.length === 0) {
      throw new Error(`No location found for: ${city}`);
    }
    
    const location = data[0];
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);
    
    // Use timezone from Nominatim if available, otherwise estimate
    let timezone = 'UTC';
    if (location.timezone) {
      timezone = location.timezone;
    } else {
      timezone = estimateTimezoneFromLongitude(lon);
    }
    
    return {
      latitude: lat,
      longitude: lon,
      timezone,
      displayName: location.display_name
    };
  } catch (error) {
    console.error('Nominatim failed, trying OpenCage as fallback:', error);
    
    // Fallback to OpenCage if Nominatim fails
    const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${getOpenCageApiKey()}&limit=1`;
    
    const response = await fetch(openCageUrl);
    if (!response.ok) {
      throw new Error(`OpenCage request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error(`No location found for: ${city}`);
    }
    
    const result = data.results[0];
    const lat = result.geometry.lat;
    const lon = result.geometry.lng;
    
    // Use timezone from OpenCage if available, otherwise estimate
    let timezone = 'UTC';
    if (result.annotations && result.annotations.timezone) {
      timezone = result.annotations.timezone.name;
    } else {
      timezone = estimateTimezoneFromLongitude(lon);
    }
    
    return {
      latitude: lat,
      longitude: lon,
      timezone,
      displayName: result.formatted
    };
  }
}

/**
 * Decompose datetime-local input into components
 */
export function decomposeLocalDateTime(isoLocal: string) {
  const d = new Date(isoLocal);
  return {
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  };
}

/**
 * Create Astrologer subject from location data and datetime
 */
export function createAstrologerSubject(
  locationData: LocationData,
  geoLocation: GeoLocation,
  name: string
): AstrologerSubject {
  const dt = decomposeLocalDateTime(locationData.date);
  
  const subject: AstrologerSubject = {
    year: dt.year,
    month: dt.month,
    day: dt.day,
    hour: dt.hour,
    minute: dt.minute,
    longitude: geoLocation.longitude,
    latitude: geoLocation.latitude,
    city: locationData.city,
    nation: 'US', // Default, could be extracted from geo data
    timezone: geoLocation.timezone,
    name,
    zodiac_type: 'Tropic' as const,
    sidereal_mode: null,
    perspective_type: 'Apparent Geocentric',
    houses_system_identifier: 'P'
  };
  
  return subject;
}

/**
 * Get synastry aspects from Astrologer API
 */
export async function getSynastryAspects(
  userData: LocationData,
  interviewData: LocationData
): Promise<SynastryResponse> {
  try {
    // Check cache first
    const cacheKey = generateSynastryCacheKey(userData, interviewData);
    
    if (synastryCache.has(cacheKey)) {
      return synastryCache.get(cacheKey)!;
    }
    
    // Get location data for both cities
    const [userGeo, interviewGeo] = await Promise.all([
      getLocationData(userData.city),
      getLocationData(interviewData.city)
    ]);
    
    // Create subjects for the API
    const firstSubject = createAstrologerSubject(userData, userGeo, 'User');
    const secondSubject = createAstrologerSubject(interviewData, interviewGeo, 'Interview');
    
    const requestBody: SynastryRequest = {
      first_subject: firstSubject,
      second_subject: secondSubject,
      theme: 'classic',
      language: 'EN',
      wheel_only: false
    };
    
    const response = await fetch('https://astrologer.p.rapidapi.com/api/v4/synastry-aspects-data', {
      method: 'POST',
      headers: {
        'x-rapidapi-key': getAstrologerApiKey(),
        'x-rapidapi-host': 'astrologer.p.rapidapi.com',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-RapidAPI-Host': 'astrologer.p.rapidapi.com'
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Astrologer API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Astrologer API failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    
    // Cache the result
    synastryCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('Error getting synastry aspects:', error);
    throw error;
  }
}
