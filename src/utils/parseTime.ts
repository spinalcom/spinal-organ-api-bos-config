/**
 * Parses a "HH" or "HH:MM" time of day into minutes since midnight, so that
 * two times of the day can be compared with a single number.
 */
export function parseTimeOfDay(value: string | undefined, fallback: number): number {
    if (value === undefined || value.trim() === '') return fallback;
    const match = /^(\d{1,2})(?::([0-5]\d))?$/.exec(value.trim());
    const hours = match ? Number(match[1]) : NaN;
    if (!match || hours > 23) {
        console.warn(
            `[config] invalid time of day "${value}", expected HH or HH:MM, falling back to ${fallback} minutes`
        );
        return fallback;
    }
    return hours * 60 + Number(match[2] ?? 0);
}

export function parseDuration(value: string | undefined, fallback: number): number {
    if (value === undefined || value.trim() === '') return fallback;
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
        console.warn(
            `[config] invalid duration "${value}", falling back to ${fallback}`
        );
        return fallback;
    }
    return parsed;
}