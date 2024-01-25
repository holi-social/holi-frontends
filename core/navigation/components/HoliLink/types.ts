import { UseLinkProps } from '@holi/core/navigation/hooks/useLink'

export interface HoliLinkProps extends UseLinkProps {
  label: string
  testID?: string
}
