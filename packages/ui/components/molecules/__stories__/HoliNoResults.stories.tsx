import * as React from 'react'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
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
      <HoliButton label="" inline>
        Some button text
      </HoliButton>
    </HoliNoResults>
    <HoliNoResults secondText="A message without children" style={{ marginTop: 24 }} />
    <HoliNoResults
      firstText={args.firstText}
      media={
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_settings.svg')}
          width={161}
          height={180}
          label=""
          isSvg
        />
      }
      secondText="A message with media"
      style={{ marginTop: 24 }}
    >
      <HoliButton label="" inline>
        Some button text
      </HoliButton>
    </HoliNoResults>
  </>
)

Preview.argTypes = {
  firstText: { description: 'Upper text', type: 'string', control: { type: 'text' } },
  media: { description: 'Optional media component', type: 'JSX.Element', control: { type: 'object' } },
  secondText: { description: 'Main text', type: 'string', control: { type: 'text' } },
}

Preview.args = {
  firstText: 'The link label',
  secondText: 'A message with children (button)',
}
