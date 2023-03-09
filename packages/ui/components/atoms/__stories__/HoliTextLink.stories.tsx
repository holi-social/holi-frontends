import * as React from 'react'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'

export default {
  title: 'Atoms/HoliTextLink',
  parameters: {
    docs: {
      description: {
        component: 'HoliTextLink',
      },
    },
  },
}

const LinkPreviewSlot = ({ children }: React.PropsWithChildren<unknown>) => (
  <div style={{ paddingBottom: 20 }}>{children}</div>
)

const args = {
  label: { description: 'Accessibility label', type: 'string', control: { type: 'text' } },
  href: { description: 'Target url', type: 'string', control: { type: 'text' } },
  external: { control: { type: 'boolean' } },
  variant: {
    options: ['primary', 'secondary'],
    control: { type: 'radio' },
  },
  size: {
    options: ['extrasmall', 'small', 'large'],
    control: { type: 'radio' },
  },
}

export const Primary = ({ ...args }) => (
  <>
    <LinkPreviewSlot>
      <HoliTextLink href="/" label={args.label} variant="primary" size="default">
        Primary Default Link
      </HoliTextLink>
    </LinkPreviewSlot>

    <LinkPreviewSlot>
      <HoliTextLink href="/" label={args.label} variant="primary" size="small">
        Primary Small Link
      </HoliTextLink>
    </LinkPreviewSlot>

    <LinkPreviewSlot>
      <HoliTextLink href="/" label={args.label} variant="primary" size="extrasmall">
        Primary Link Default
      </HoliTextLink>
    </LinkPreviewSlot>

    <LinkPreviewSlot>
      <HoliHeading size="small">Change the controls</HoliHeading>
      <br />
      <HoliTextLink href="/" label={args.label} variant={args.variant} size={args.size}>
        Try the primary link controls
      </HoliTextLink>
    </LinkPreviewSlot>
  </>
)

Primary.argTypes = { ...args }

export const Secondary = ({ ...args }) => (
  <>
    <LinkPreviewSlot>
      <HoliTextLink href="/" label={args.label} variant="secondary" size="default">
        Secondary Default Link
      </HoliTextLink>
    </LinkPreviewSlot>

    <LinkPreviewSlot>
      <HoliTextLink href="/" label={args.label} variant="secondary" size="small">
        Secondary Small Link
      </HoliTextLink>
    </LinkPreviewSlot>

    <LinkPreviewSlot>
      <HoliTextLink href="/" label={args.label} variant="secondary" size="extrasmall">
        Secondary Link Default
      </HoliTextLink>
    </LinkPreviewSlot>

    <LinkPreviewSlot>
      <HoliHeading size="small">Change the controls</HoliHeading>
      <br />
      <HoliTextLink href="/" label={args.label} variant={args.variant} size={args.size}>
        Try the secondary link controls
      </HoliTextLink>
    </LinkPreviewSlot>
  </>
)

Secondary.argTypes = { ...args }
