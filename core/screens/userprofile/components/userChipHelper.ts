export type ChipValueWithTranslation = { value: string; t: string }

export const toValuesWithTranslation = (
  keyInUserObject: string,
  values: string[],
  tFn: (a: string) => string
): ChipValueWithTranslation[] =>
  values
    .map((value) => ({ value: value, t: tFn(`user.${keyInUserObject}.${value}`) }))
    .sort((a, b) => a.t.localeCompare(b.t))
