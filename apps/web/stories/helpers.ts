import { EnumDeclaration, EnumType } from 'typescript'

export function enumOptions(someEnum: {}) {
  return {
    options: Object.keys(someEnum),
    mapping: someEnum,
    control: {
      type: 'select',
      labels: Object.values(someEnum),
    },
  }
}
