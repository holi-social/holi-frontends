import { TextLinkProps } from 'holi-bricks/components/text'

import { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'

export type HoliTextLinkProps = HoliLinkProps & Pick<TextLinkProps, 'variant' | 'size' | 'textAlign'>
