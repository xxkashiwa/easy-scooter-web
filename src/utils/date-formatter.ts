/**
 * Format time from ISO string (2025-04-26T11:01:59.336) to readable format
 * @param timeString ISO date string
 * @returns Formatted date string in "YYYY-MM-DD HH:MM" format
 */
export const formatDateTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString || 'N/A';
  }
};

/**
 * Format date only from ISO string (2025-04-26T11:01:59.336) to readable format
 * @param dateString ISO date string
 * @returns Formatted date string in "YYYY-MM-DD" format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);

    // Extract date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || 'N/A';
  }
};

/**
 * Format time only from ISO string (2025-04-26T11:01:59.336) to readable format
 * @param timeString ISO time string
 * @returns Formatted time string in "HH:MM" format
 */
export const formatTime = (timeString: string): string => {
  try {
    const date = new Date(timeString);

    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString || 'N/A';
  }
};
