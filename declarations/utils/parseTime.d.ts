/**
 * Parses a "HH" or "HH:MM" time of day into minutes since midnight, so that
 * two times of the day can be compared with a single number.
 */
export declare function parseTimeOfDay(value: string | undefined, fallback: number): number;
export declare function parseDuration(value: string | undefined, fallback: number): number;
