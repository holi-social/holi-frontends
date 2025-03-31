import type { User } from '@holi/core/domain/shared/types'

export const isAccountComplete = (user?: User): boolean => !!user?.identity && !!user?.firstName
