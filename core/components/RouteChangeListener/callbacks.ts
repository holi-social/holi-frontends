import { increaseUserVisitedScreensCount } from '@holi/core/components/TrackingConsentModal/userVisitedScreensCount'

// add callbacks to be called on route change to the array
const callbacks: CallableFunction[] = [increaseUserVisitedScreensCount]

export const callAllCallbacks = () => Promise.all(callbacks.map((fn) => fn()))
