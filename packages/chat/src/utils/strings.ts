import { TFunction } from 'i18next'

import { getInitials } from '@holi/core/helpers'
import { colors } from '@holi/ui/styles/globalVars'

export const isString = (str: unknown): str is string => typeof str === 'string'
export const isEmptyString = (str: string) => str.length === 0

export const getChatMemberName = (t: TFunction, name?: string): string => {
  if (!name || isMatrixId(name)) return t('chat.user.deleted')
  return name
}

export const getChatInitials = (name?: string): string => {
  if (!name) return ''
  if (isMatrixId(name)) return ':/'
  return getInitials(name, 2).toUpperCase()
}

const DEFAULT_AVATAR_COLORS = ['#FFAE86', '#F8F860', '#78EDA8', '#7BD7EA', '#7571EC', '#D782FB']

export const getDefaultAvatarColor = (name?: string): string => {
  if (!name || isMatrixId(name)) return colors.brandColorD20
  let sum = 0
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i)
  }
  return DEFAULT_AVATAR_COLORS[sum % DEFAULT_AVATAR_COLORS.length]
}

const MATRIX_IDENTITY_REGEX =
  /^@[a-z][a-z0-9_.-]*:(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/

export const isMatrixId = (name: string) => {
  return name.match(MATRIX_IDENTITY_REGEX)
}
