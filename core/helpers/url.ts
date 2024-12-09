const ALLOWED_PROTOCOLS = ['http', 'https']

export const withProtocol = (address: string) =>
  ALLOWED_PROTOCOLS.some((protocol) => address.startsWith(`${protocol}://`)) ? address : `https://${address}`

export const shortHost = (url: string) => new URL(url).host.replace(/^(www.)/, '')

export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(withProtocol(url))

    if (!ALLOWED_PROTOCOLS.some((protocol) => parsedUrl.protocol === `${protocol}:`)) {
      return false
    }

    // we don't want to allow just hostnames, the host
    // should at least have a top and second level domain
    if (parsedUrl.hostname.split('.').length < 2) {
      return false
    }

    if (parsedUrl.hostname.endsWith('.local')) {
      return false
    }
  } catch (e) {
    return false
  }

  return true
}
