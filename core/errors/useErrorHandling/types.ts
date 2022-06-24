export type ErrorHandling = {
  logError: (error: Error, stack?: string) => void
  displayError: (error: Error, message?: string) => void
}

export type UseErrorHandling = () => ErrorHandling
