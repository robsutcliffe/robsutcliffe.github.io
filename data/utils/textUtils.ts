/**
 * Converts a string to title case.
 *
 * @param str The string to convert
 * @returns The title cased string
 */
export const toTitleCase = (str: string): string => {
  if (!str) return str
  return str
    .replace(/-/g, ' ')
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
