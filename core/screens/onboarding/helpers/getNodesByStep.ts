import { NodeType } from '@holi/core/auth/components/FormBuilder'

export const getNodesByStep = (step: 'oidc' | 'email-password' | 'email-code' | 'code'): NodeType[] => {
  switch (step) {
    case 'oidc':
      return ['oidc']
    case 'email-password':
      return ['email', 'password']
    case 'email-code':
      return ['email', 'code']
    case 'code':
      return ['code']
  }
}
