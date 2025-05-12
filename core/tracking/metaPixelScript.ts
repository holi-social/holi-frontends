/* eslint-disable */
// @ts-nocheck

export const metaPixelScript = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve()

    if (!window.fbq) {
      const n = () => {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      }
      n.queue = []
      n.loaded = true
      n.version = '2.0'
      n.push = n
      window.fbq = n
      window._fbq = n
    }

    const existing = document.querySelector('script[src="https://connect.facebook.net/en_US/fbevents.js"]')
    if (existing) return resolve()

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    script.async = true
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}
