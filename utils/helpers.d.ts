/**
 * Returns a Date object with the end_of_month.beginning_of_day from a Date Time
 * @param {Date | string} date
 * @return {Date}
 */
export function lastDay(date: Date | string): Date;
/**
 * Normalize strings
 * @param {string | undefined} v
 * @returns {string}
 */
export function normalizeString(v: string | undefined): string;
/**
 * Check if string starts with a prefix
 * @param {string} val
 * @param {string} prefix
 * @returns {boolean}
 */
export function startsWith(val: string, prefix: string): boolean;
