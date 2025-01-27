export const simpleColumnSortingByIndex = <T>(items: readonly T[], numberOfColumns: number): T[][] => {
  if (numberOfColumns === 0) return new Array<T[]>()

  return (items || []).reduce((previous, p, index) => {
    const mod = index % numberOfColumns
    previous[mod] = previous[mod].concat(p)
    return previous
  }, new Array<T[]>(numberOfColumns).fill(new Array<T>()))
}
