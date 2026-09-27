export const MAX_COSMIC_POINTS = 20;

export interface ScoredAspect {
    description: string;
    points: number;
}

export interface AspectScore {
    points: number;
    maxPoints: number;
    percentage: number;
    positiveAspects: ScoredAspect[];
    negativeAspects: ScoredAspect[];
}

const ASPECT_PATTERN = /trine|sextile|square|opposition|quincunx|inconjunct|semisquare|sesquiquadrate|semisextile|conjunction/i;
const POSITIVE_ASPECT_PATTERN = /trine|sextile|semisextile/i;
const NEGATIVE_ASPECT_PATTERN = /square|opposition|quincunx|inconjunct|semisquare|sesquiquadrate/i;
const FAST_BODIES: Record<string, number> = {
    moon: 2.6,
    mercury: 2.1,
    venus: 1.9,
    mars: 1.7,
    sun: 1.6,
    ascendant: 3,
    asc: 3,
    midheaven: 3,
    mc: 3,
    descendant: 3,
    desc: 3,
    ic: 3,
    jupiter: 1.2,
    saturn: 1.1,
    uranus: 0.9,
    neptune: 0.9,
    pluto: 0.8,
};

function getScalarValues(value: unknown, values: string[] = []): string[] {
    if (typeof value === 'string' || typeof value === 'number') {
        values.push(String(value));
    } else if (Array.isArray(value)) {
        value.forEach((entry) => getScalarValues(entry, values));
    } else if (value && typeof value === 'object') {
        Object.values(value).forEach((entry) => getScalarValues(entry, values));
    }
    return values;
}

function getAspectName(record: Record<string, unknown>): string | undefined {
    for (const [key, value] of Object.entries(record)) {
        if (/aspect|type/i.test(key) && typeof value === 'string' && ASPECT_PATTERN.test(value)) return value;
    }
    return undefined;
}

function collectAspectRecords(value: unknown, records: unknown[] = [], seen = new WeakSet<object>()): unknown[] {
    if (!value || typeof value !== 'object' || seen.has(value)) return records;
    seen.add(value);

    if (Array.isArray(value)) {
        for (const entry of value) {
            if (typeof entry === 'string' && ASPECT_PATTERN.test(entry)) records.push({ description: entry });
            else collectAspectRecords(entry, records, seen);
        }
        return records;
    }

    const record = value as Record<string, unknown>;
    if (getAspectName(record)) {
        records.push(record);
        return records;
    }

    Object.values(record).forEach((nested) => collectAspectRecords(nested, records, seen));
    return records;
}

function getPolarity(description: string, aspectName: string): -1 | 0 | 1 {
    if (POSITIVE_ASPECT_PATTERN.test(aspectName)) return 1;
    if (NEGATIVE_ASPECT_PATTERN.test(aspectName)) return -1;

    if (/conjunction/i.test(aspectName)) {
        if (/venus|jupiter/i.test(description)) return 1;
        if (/mars|saturn|uranus|neptune|pluto/i.test(description)) return -1;
    }
    return 0;
}

function getSpeedWeight(description: string): number {
    const bodies = Object.entries(FAST_BODIES)
        .filter(([name]) => new RegExp(`\\b${name}\\b`, 'i').test(description))
        .map(([, weight]) => weight);
    return bodies.length ? Math.max(...bodies) : 1;
}

function getOrbMultiplier(record: Record<string, unknown>): number {
    const orbEntry = Object.entries(record).find(([key]) => /orb|orbis/i.test(key));
    if (!orbEntry) return 1;

    const orbValue = Number(String(orbEntry[1]).match(/\d+(?:\.\d+)?/)?.[0]);
    if (!Number.isFinite(orbValue)) return 1;
    return 1 / (1 + Math.max(0, orbValue) / 4);
}

function describeAspect(record: unknown, aspectName: string): string {
    if (typeof record === 'string') return record;
    const values = getScalarValues(record);
    return values.length ? values.join(' ') : aspectName;
}

export function scoreAstrologyAspects(aspects: unknown): AspectScore {
    const scored = collectAspectRecords(aspects).flatMap((entry) => {
        const record = typeof entry === 'object' && entry !== null ? entry as Record<string, unknown> : {};
        const aspectName = typeof record.description === 'string' ? record.description : getAspectName(record);
        if (!aspectName) return [];

        const description = describeAspect(entry, aspectName);
        const polarity = getPolarity(description, aspectName);
        if (polarity === 0) return [];

        const aspectWeight = /trine|square|opposition/i.test(aspectName) ? 1 : 0.85;
        const points = polarity * getSpeedWeight(description) * aspectWeight * getOrbMultiplier(record);
        return [{ description, points }];
    });

    const netInfluence = scored.reduce((sum, aspect) => sum + aspect.points, 0);
    const totalInfluence = scored.reduce((sum, aspect) => sum + Math.abs(aspect.points), 0);
    const balance = totalInfluence === 0 ? 0 : netInfluence / totalInfluence;
    const points = Math.round(Math.max(0, Math.min(MAX_COSMIC_POINTS, 10 + balance * 10)) * 100) / 100;
    const rankByWeight = (left: ScoredAspect, right: ScoredAspect) => Math.abs(right.points) - Math.abs(left.points);

    return {
        points,
        maxPoints: MAX_COSMIC_POINTS,
        percentage: Math.round((points / MAX_COSMIC_POINTS) * 1000) / 10,
        positiveAspects: scored.filter((aspect) => aspect.points > 0).sort(rankByWeight).slice(0, 3),
        negativeAspects: scored.filter((aspect) => aspect.points < 0).sort(rankByWeight).slice(0, 3),
    };
}