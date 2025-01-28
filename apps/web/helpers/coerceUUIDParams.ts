import { coerceToUUIDString } from '@holi/core/helpers'

const getSingleParam = (path: string | string[] | undefined) => {
  if (Array.isArray(path)) {
    return path.length ? path[0] : ''
  }
  return path
}

export const coerceUUIDParams = (uuidParams: (string | string[] | undefined)[], url?: string): string | undefined => {
  const replacements = uuidParams
    .map((param) => {
      const singleParam = encodeURIComponent(getSingleParam(param) || '')
      if (!singleParam) {
        return undefined
      }
      const validParam = coerceToUUIDString(singleParam)
      if (validParam !== singleParam) {
        return [singleParam, validParam]
      }
      return undefined
    })
    .filter((replacement) => !!replacement)

  if (!replacements.length) {
    return undefined
  }

  return replacements.reduce((u, [invalid, valid]) => u?.replace(invalid, valid), url)
}
