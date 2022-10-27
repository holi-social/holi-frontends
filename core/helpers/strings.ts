import type { User } from '@holi/core/screens/userprofile/types'

export const fullName = (firstname?: string, lastname?: string) => {
  return `${firstname || ''} ${lastname || ''}`.trim()
}

export const userFullName = (user?: Partial<User>) => {
  return fullName(user?.firstName, user?.lastName)
}

export const createUUID = () => {
  let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}
