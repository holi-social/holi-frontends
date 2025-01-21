import { TextLinkProps } from 'holi-bricks/components/text'

import { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'

export type HoliTextLinkProps = Omit<HoliLinkProps, 'testID'> & Pick<TextLinkProps, 'color' | 'size' | 'textAlign'>
