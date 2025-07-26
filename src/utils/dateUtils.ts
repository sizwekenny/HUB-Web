/**
 * Format a date object to a readable string
 * @param date - Date to format
 * @returns Formatted date string (e.g., "Apr 15, 2025")
 */
export const formatDate = (date: Date): string => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Format a date object to include time
 * @param date - Date to format
 * @returns Formatted date and time string (e.g., "Apr 15, 2025, 2:30 PM")
 */
export const formatDateTime = (date: Date): string => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};