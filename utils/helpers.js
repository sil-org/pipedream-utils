/**
 * Returns a Date object with the end_of_month.beginning_of_day from a Date Time
 * @param {Date | string} date
 * @return {Date}
 */
export function lastDay(date) {
  if (!(date instanceof Date && !isNaN(date.getTime()))) {
    return new Date()
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 0, 0, 0, 0))
}

/**
 * Normalize strings
 * @param {string | undefined} v
 * @returns {string}
 */
export function normalizeString(v) {
  return typeof v === 'string' ? v.trim() : ''
}

/**
 * Check if string starts with a prefix
 * @param {string} val
 * @param {string} prefix
 * @returns {boolean}
 */
export function startsWith(val, prefix) {
  return typeof val === 'string' && val.toUpperCase().startsWith(prefix.toUpperCase())
}
