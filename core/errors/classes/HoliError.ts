/** @description HoliError is Base class to inherit for all our custom errors */
export class HoliError extends Error {
  // used for the error modal caused by this error
  testID?: string

  constructor(message?: string, testID?: string) {
    super(message)
    this.testID = testID
  }
}
