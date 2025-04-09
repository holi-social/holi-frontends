import { ChipLabel } from 'holi-bricks/components/chips'
import type { ChipLabelProps } from 'holi-bricks/components/chips/ChipLabel'
import { Stack } from 'holi-bricks/components/stack'
import type React from 'react'

export type FooterChipsProps = {
  chips: ChipLabelProps[]
}

export const FooterChips: React.FC<FooterChipsProps> = ({ chips }) => (
  <Stack direction="row" wrap="wrap" gap="3xs" flexShrink={2}>
    {chips?.map((props) => (
      <ChipLabel {...props} key={`compact-card-chip-${props.children}-index`} />
    ))}
  </Stack>
)
