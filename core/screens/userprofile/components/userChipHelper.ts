import { UserChipGeneric } from 'core/screens/userprofile/types'

export type ChipValueWithTranslation = { value: string; t: string }

export const toValuesWithTranslation = (
  typeMetadata: UserChipGeneric<string>,
  values: string[],
  tFn: (a: string) => string,
  sortByTranslation = true
): ChipValueWithTranslation[] => {
  const valuesWithTranslation = values.map((value) => ({
    value: value,
    t: tFn(`user.${typeMetadata.keyInUserObject}.${value}`),
  }))
  if (sortByTranslation) {
    return valuesWithTranslation.sort((a, b) => a.t.localeCompare(b.t))
  } else {
    // sort by index in array of all values (used for SDGs)
    // needed because the backend hands over a alphanumerically sorted list of values
    return valuesWithTranslation.sort(
      (a, b) => typeMetadata.allValues.indexOf(a.value) - typeMetadata.allValues.indexOf(b.value)
    )
  }
}
