import * as React from 'react'

import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

export default {
  title: 'Molecules/HoliNoResults',
  parameters: {
    docs: {
      description: {
        component: 'HoliNoResults',
      },
    },
  },
}

export const Preview = ({ ...args }) => (
  <>
    <HoliNoResults firstText={args.firstText} secondText={args.secondText}>
      <HoliButton label={''} inline>
        Some button text
      </HoliButton>
    </HoliNoResults>
    <HoliNoResults secondText="A message without children" style={{ marginTop: 24 }} />
  </>
)

Preview.argTypes = {
  firstText: { description: 'Upper text', type: 'string', control: { type: 'text' } },
  secondText: { description: 'Main text', type: 'string', control: { type: 'text' } },
}

Preview.args = {
  firstText: 'The link label',
  secondText: 'A message with children (button)',
}
