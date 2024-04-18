export const withProtocol = (address: string) =>
  address.startsWith('https://') || address.startsWith('http://') ? address : `https://${address}`

export const shortHost = (url: string) => new URL(url).host.replace(/^(www.)/, '')
