/**
 * Format a content date for display. Frontmatter dates parse as UTC
 * midnight, so always format in UTC — formatting in the machine's local
 * zone shifts the shown day by one for anyone building west of UTC.
 */
export function formatDate(date: Date, monthFormat: 'short' | 'long' = 'short'): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: monthFormat,
    day: 'numeric',
    timeZone: 'UTC',
  });
}
