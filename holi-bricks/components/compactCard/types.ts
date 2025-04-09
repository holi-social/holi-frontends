import type { FooterChipsProps } from 'holi-bricks/components/compactCard/footer/FooterChips'
import type { FooterDateProps } from 'holi-bricks/components/compactCard/footer/FooterDate'
import type { FooterProgressBarProps } from 'holi-bricks/components/compactCard/footer/FooterProgressBar'
import type { CompactCardProps } from 'holi-bricks/components/compactCard/CompactCard'
import type React from 'react'

export type CompoundCompactCard = React.FC<CompactCardProps> & {
  FooterChips: React.FC<FooterChipsProps>
  FooterDate: React.FC<FooterDateProps>
  FooterProgressBar: React.FC<FooterProgressBarProps>
}

export type { CompactCardProps }
