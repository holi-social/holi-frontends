export const createUUID = () => {
  let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = ((dt + Math.random() * 16) % 16) | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
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
