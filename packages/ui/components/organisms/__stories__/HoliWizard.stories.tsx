import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const StepOne = () => {
  const { setNextButtonEnabled } = useWizard()

  return (
    <View style={styles.contentWrapper}>
      <Text>Step one</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => setNextButtonEnabled(true)}>
          <Text>Enable</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.backgroundColorWhite }]}
          onPress={() => setNextButtonEnabled(false)}
        >
          <Text>Disable</Text>
        </Pressable>
      </View>
    </View>
  )
}

const StepTwo = () => {
  const { setNextButtonEnabled } = useWizard()

  return (
    <View style={styles.contentWrapper}>
      <Text>Step two</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => setNextButtonEnabled(true)}>
          <Text>Enable</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.backgroundColorWhite }]}
          onPress={() => setNextButtonEnabled(false)}
        >
          <Text>Disable</Text>
        </Pressable>
      </View>
    </View>
  )
}

const StepThree = () => {
  const { setNextButtonEnabled } = useWizard()

  return (
    <View style={styles.contentWrapper}>
      <Text>Step three</Text>
      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={() => setNextButtonEnabled(true)}>
          <Text>Enable</Text>
        </Pressable>
        <Pressable
          style={[styles.button, { backgroundColor: colors.backgroundColorWhite }]}
          onPress={() => setNextButtonEnabled(false)}
        >
          <Text>Disable</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default {
  title: 'Organisms/HoliWizard',
  component: HoliWizard,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for wizard.',
      },
    },
  },
} as ComponentMeta<typeof HoliWizard>

const Template: ComponentStory<typeof HoliWizard> = ({ ...args }) => {
  const mixins = useStyleMixins()

  return (
    <View style={mixins.container}>
      <HoliWizard {...args}>
        <StepOne />
        <StepTwo />
        <StepThree />
      </HoliWizard>
    </View>
  )
}

export const BasicExample: ComponentStory<typeof HoliWizard> = Template.bind({})

BasicExample.argTypes = {
  isBackButtonAvailable: { description: 'Back button status', type: 'boolean', control: { type: 'boolean' } },
  submitButtonLabel: { description: 'Button Name', type: 'string', control: { type: 'text' } },
}

BasicExample.args = {
  isBackButtonAvailable: true,
  submitButtonLabel: 'Submit',
}

const styles = StyleSheet.create({
  contentWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 5,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.borderColorSecondary,
    backgroundColor: colors.backgroundColorSuccess,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
