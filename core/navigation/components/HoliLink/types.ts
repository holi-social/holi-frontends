import { UseLinkProps } from '@holi/core/navigation/hooks/useLink'
import { TextLinkProps } from 'holi-bricks/components/text'

export interface HoliLinkProps extends UseLinkProps {
  label: string
  testID?: string
  isFullHeight?: boolean
  size?: TextLinkProps['size']
}
