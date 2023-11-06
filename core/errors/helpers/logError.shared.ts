export interface ErrorContext extends Record<string, unknown> {
  // To identify the place where the error occurred (e.g. `file.method`)
  location: string
}

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined
}

export const isNetworkConnectionError = (error: unknown, forceTrue = false): boolean => {
  if (forceTrue) return true
  return (
    isError(error) &&
    (error?.message === 'Failed to fetch' ||
      error?.message === 'Network request failed' ||
      error?.message === 'Network error')
  )
}
