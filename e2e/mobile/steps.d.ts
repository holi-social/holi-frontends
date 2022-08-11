/// <reference types='codeceptjs' />
type stepsFile = typeof import('./stepsFile.js')

declare namespace CodeceptJS {
  interface SupportObject {
    I: I
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    current: any
  }
  interface Methods extends Appium {}
  interface I extends ReturnType<stepsFile> {}
  namespace Translation {
    interface Actions {}
  }
}
