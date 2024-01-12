export const getEnumKeyByValue = <T extends { [index: string]: string }>(
  enumObject: T,
  enumValue?: string
): T[keyof T] | undefined => {
  if (!enumValue) return undefined
  const found = Object.keys(enumObject).find((x) => enumObject[x] === enumValue)
  return found ? (enumObject[found] as T[keyof T]) : undefined
}
