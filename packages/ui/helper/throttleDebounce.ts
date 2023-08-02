type VoidCallback<T> = (arg: T) => void

export const throttleDebounce = <T>(
  callback: VoidCallback<T>,
  scrollEventThrottleMs: number,
  persist?: VoidCallback<T>
): VoidCallback<T> => {
  let throttled = false
  let debounceTimeoutId: ReturnType<typeof setTimeout>

  return (event: T) => {
    if (throttled) {
      // debouncing last throttled event, so the newest (e.g. scroll) state
      // gets checked, after the interaction was completed
      clearTimeout(debounceTimeoutId)
      persist?.(event) // needed in RN because events are reused otherwise
      debounceTimeoutId = setTimeout(() => callback(event), scrollEventThrottleMs)
    } else {
      throttled = true
      clearTimeout(debounceTimeoutId) // interaction still happening
      callback(event)
      setTimeout(() => (throttled = false), scrollEventThrottleMs)
    }
  }
}
