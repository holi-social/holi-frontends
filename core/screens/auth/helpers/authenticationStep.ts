import type { NodeType } from '@holi/core/auth/components/FormBuilder'

// TODO(SF) email-code only to keep current behaviour of registration
export type AuthenticationStep = 'start' | 'code' | 'email-password' | 'email-code'

export const getFormNodesByStep = (step: AuthenticationStep): NodeType[] => {
  switch (step) {
    case 'start':
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
