import * as React from 'react'
import { StyleSheet } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLink from '@holi/ui/components/molecules/HoliLink'

export default {
  title: 'Molecules/HoliLink',
  parameters: {
    docs: {
      description: {
        component: 'HoliLink',
      },
    },
  },
}

export const Preview = ({ ...args }) => (
  <>
    <HoliHeading size="medium" level="3" style={styles.headline}>
      Try out:
    </HoliHeading>
    <HoliLink href={args.href} label={args.label} external>
      This is a link
    </HoliLink>

    <HoliHeading size="medium" level="3" style={styles.headline}>
      Examples:
    </HoliHeading>
    <HoliLink href="/" label="An internal link" style={styles.paddingTop}>
      Internal Link
    </HoliLink>
    <br />
    <HoliLink
      href="https://validator.w3.org/checklink?uri=https%3A%2F%2Fstaging.web.project-holi.org%2F"
      label="An external link"
      external
      style={styles.paddingTop}
    >
      External Link
    </HoliLink>
    <br />
    <HoliLink
      href="https://www.w3schools.com/html/html_links.asp"
      label="with extra onPress"
      onPress={() => {
        alert('Ups, I am pressed ;-)')
        return false // stops propagation
      }}
      external
      style={[styles.paddingTop, styles.borderedLink]}
      textStyle={{ color: 'black' }}
    >
      I am external with click event
    </HoliLink>
  </>
)

Preview.argTypes = {
  label: { description: 'Accessibility label', type: 'string', control: { type: 'text' } },
  href: { description: 'Target url', type: 'string', control: { type: 'text' } },
  external: { control: { type: 'boolean' } },
}

Preview.args = {
  label: 'The link label',
  href: 'https://www.w3schools.com/html/html_links.asp',
  external: true,
}

const styles = StyleSheet.create({
  paddingTop: {
    display: 'inline-block',
    paddingTop: 10,
  },
  borderedLink: {
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  headline: {
    display: 'block',
    paddingVertical: 20,
  },
})
