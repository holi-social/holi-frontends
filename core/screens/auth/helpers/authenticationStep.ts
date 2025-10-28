import type { NodeType } from '@holi/core/auth/components/FormBuilder'

export type AuthenticationStep = 'start' | 'code' | 'email-password'

export const getFormNodesByStep = (step: AuthenticationStep): NodeType[] => {
  switch (step) {
    case 'start':
      return ['oidc', 'email', 'code'] // TODO(SF) unsure!
    case 'email-password':
      return ['email', 'password']
    case 'code':
      return ['code']
    default:
      return []
  }
}
