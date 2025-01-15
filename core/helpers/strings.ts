import { v4 as uuidv4, validate as uuidValidate } from 'uuid'
export const createUUID = uuidv4
export const isValidUUID = uuidValidate
export const coerceToUUIDString = (value?: string | string[]): string => {
  if (value instanceof Array) return coerceToUUIDString(value[0])
  if (typeof value === 'undefined') return ''
  if (isValidUUID(value)) return value
  // try to get first uuid pattern by regex from value
  const uuidMatch = value.match(/\p{Hex_Digit}{8}(?:-\p{Hex_Digit}{4}){3}-\p{Hex_Digit}{12}/u)
  if (uuidMatch) return uuidMatch[0]
  // fall back to returning the input string
  return value
}

export const getInitials = (str: string, maxLength = 3) =>
  str
    .split(' ')
    .map((name) => name[0] || '')
    .join('')
    .substring(0, maxLength) // maxLength is the max number of characters in the initials string

export const replaceSpecialChars = (str: string) => str.replace(/[<>,.:;_!"§$%&/()=?+*#]/g, '')

export const isString = (value: unknown): value is string => typeof value === 'string'

export const isStringOrUndefined = (value: unknown): value is string | undefined => {
  return isString(value) || value === undefined
}
