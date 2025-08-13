/* eslint-disable no-restricted-imports */
import type { Meta, StoryObj } from '@storybook/react-native'
import React from 'react'
import { StyleSheet } from 'react-native-unistyles'

import { AddCircleFill } from '@holi/icons/src/generated'
import { Snackbar } from 'holi-bricks/components/snackbar/Snackbar'
import { View } from 'react-native'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'
import { accessibilityAttributes } from 'holi-bricks/foundations/accessibility'

const disabledProps = [...accessibilityAttributes, 'onPress', 'show', 'onDismiss']

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  argTypes: {
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
    icon: { ...controlWithLabel },
  },
  args: {
    label: 'Notification goes here',
    variant: 'success',
    icon: AddCircleFill,
    actionLabel: 'Action',
    onPress: () => {},
    dismissible: true,
    persistent: true,
    duration: 'medium',
  },
}

type Story = StoryObj<typeof Snackbar>

export const Default: Story = {
  render: function Render(args) {
    return (
      <View style={styles.container}>
        <Snackbar {...args} />
      </View>
    )
  },
}
export default meta

const styles = StyleSheet.create(() => ({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    paddingBottom: 100,
  },
}))
