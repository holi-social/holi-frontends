import type { User } from '@holi/core/screens/userprofile/types'

export const fullName = (firstname?: string, lastname?: string) => {
  return `${firstname || ''} ${lastname || ''}`.trim()
}

export const userFullName = (user?: Partial<User>) => {
  return fullName(user?.firstName, user?.lastName)
}
