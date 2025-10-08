export type LocationTypeInfo = {
  isRemote: boolean
  isHybrid: boolean
  isOnsite: boolean
}

/**
 * Determines the location type classification based on location_type and location fields
 *
 * IMPORTANT: This function rectifies incorrectly tagged data in our database.
 * We have records that are tagged as "Remote" but have specific locations, making them actually "Hybrid".
 * This logic corrects such data quality issues by applying the following classification rules:
 *
 * - Remote: location_type='remote' + (no location OR "Bundesweit/Germany-wide")
 * - Hybrid: location_type='hybrid' OR location_type='remote' + has specific location (not Germany-wide)
 * - On-site: location_type='onsite'
 *
 * @param locationType - The location type field (REMOTE, HYBRID, ONSITE, etc.)
 * @param location - The location string (e.g., "Berlin", "Bundesweit", empty string)
 * @returns Object with boolean flags for each location type
 */
export const getLocationTypeInfo = (locationType?: string | null, location?: string | null): LocationTypeInfo => {
  const isGermanyWide = location?.toLowerCase() === 'bundesweit' || location?.toLowerCase() === 'germany-wide'

  const isHybrid =
    locationType?.toLowerCase() === 'hybrid' ||
    (locationType?.toLowerCase() === 'remote' && !!location?.trim() && !isGermanyWide)

  const isRemote = locationType?.toLowerCase() === 'remote' && (!location?.trim() || isGermanyWide)

  const isOnsite = locationType?.toLowerCase() === 'onsite'

  const result = {
    isRemote,
    isHybrid,
    isOnsite,
  }

  return result
}
