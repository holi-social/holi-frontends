export type ErrorHandling = {
  logError: (error: Error, message?: string, stack?: string) => void
  displayError: (error: Error, message?: string) => void
}

export type UseErrorHandling = () => ErrorHandling
