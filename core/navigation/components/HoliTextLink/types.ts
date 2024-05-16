import { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { HoliTextProps } from '@holi/ui/components/atoms/HoliText'

export type HoliTextLinkProps = HoliLinkProps & Pick<HoliTextProps, 'color' | 'size' | 'align'>
