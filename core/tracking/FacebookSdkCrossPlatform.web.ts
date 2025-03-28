import type { FacebookSdkCrossPlatform } from '@holi/core/tracking/types'

export class FacebookSdkWeb implements FacebookSdkCrossPlatform {
  async initialize(): Promise<void> {}
  async optIn(): Promise<void> {}
  async optOut(): Promise<void> {}
  async trackSignUp(): Promise<void> {}
  async enabled(): Promise<boolean> {
    return false
  }
}

export const useFacebookSdkCrossPlatform = (): FacebookSdkCrossPlatform => {
  return new FacebookSdkWeb()
}
