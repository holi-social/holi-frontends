export interface ErrorInfo {
  stack?: string
  context?: Record<string, unknown>
}

function isError(error: unknown): error is Error {
  return (error as Error).message !== undefined
}

export const isNetworkConnectionError = (error: unknown): boolean => {
  return isError(error) && (error?.message === 'Failed to fetch' || error?.message === 'Network request failed')
}
