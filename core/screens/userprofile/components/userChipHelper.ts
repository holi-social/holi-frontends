export const toValuesWithTranslation = (keyInUserObject: string, values: string[], tFn: (a: string) => string) =>
  values.map((i) => ({ name: i, t: tFn(`user.${keyInUserObject}.${i}`) })).sort((a, b) => a.t.localeCompare(b.t))
