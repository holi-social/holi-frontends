export const isString = (str: unknown): str is string => typeof str === 'string'
export const isEmptyString = (str: string) => str.length === 0
