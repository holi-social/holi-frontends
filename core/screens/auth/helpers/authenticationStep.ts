import type { NodeType } from '@holi/core/auth/components/FormBuilder'

export type AuthenticationStep = 'oidc' | 'code' | 'email-code' | 'email-password'

export const getFormNodesByStep = (step: AuthenticationStep): NodeType[] => {
  switch (step) {
    case 'oidc':
      return ['oidc']
    case 'email-password':
      return ['email', 'password']
    case 'email-code':
      return ['email', 'code']
    case 'code':
      return ['code']
    default:
      return []
  }
}
