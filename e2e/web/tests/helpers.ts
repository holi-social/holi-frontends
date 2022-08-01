// see https://playwright.dev/docs/selectors#id-data-testid-data-test-id-data-test-selectors
export const byTestId = (testId: string) => `data-testid=${testId}`

export const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time * 1000))
