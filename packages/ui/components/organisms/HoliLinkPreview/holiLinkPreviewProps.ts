import { Link } from '@holi/core/screens/posts/types'
import { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export interface HoliLinkPreviewProps extends Partial<HoliButtonProps> {
  previewData: Link
}
