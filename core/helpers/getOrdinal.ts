/**
 * This helper function accepts an argument that is a number
 * and returns a string with the ordinal of that number attached to it.
 *
 * 0 => 0th
 * 1 => 1st
 * 2 => 2nd
 * 3 => 3rd
 * 4 => 4th
 * 101 => 101st
 * 111 => 111th
 */

export const getOrdinal = (n: number) => {
  let ord = 'th'
  if (n % 10 == 1 && n % 100 != 11) {
    ord = 'st'
  } else if (n % 10 == 2 && n % 100 != 12) {
    ord = 'nd'
  } else if (n % 10 == 3 && n % 100 != 13) {
    ord = 'rd'
  }
  return `${n}${ord}`
}
