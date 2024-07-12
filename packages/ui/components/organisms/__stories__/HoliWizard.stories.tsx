import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import { colors } from '@holi/ui/styles/globalVars'

const StepOne = () => {
  const { setNextButtonEnabled } = useWizard()

  return (
    <View style={styles.contentWrapper}>
      <HoliText>Step one</HoliText>
      <View style={styles.buttonContainer}>
        <HoliButton style={styles.button} onPress={() => setNextButtonEnabled(true)} label={'enable button'}>
          <HoliText>Enable</HoliText>
        </HoliButton>
        <HoliButton
          style={[styles.button, { backgroundColor: colors.background10 }]}
          onPress={() => setNextButtonEnabled(false)}
          label={'disable button'}
        >
          <HoliText>Disable</HoliText>
        </HoliButton>
      </View>
    </View>
  )
}

const StepTwo = () => {
  const { setNextButtonEnabled } = useWizard()

  return (
    <View style={styles.contentWrapper}>
      <HoliText>Step two</HoliText>
      <View style={styles.buttonContainer}>
        <HoliButton style={styles.button} onPress={() => setNextButtonEnabled(true)} label={'enable button'}>
          <HoliText>Enable</HoliText>
        </HoliButton>
        <HoliButton
          style={[styles.button, { backgroundColor: colors.background10 }]}
          onPress={() => setNextButtonEnabled(false)}
          label={'disable button'}
        >
          <HoliText>Disable</HoliText>
        </HoliButton>
      </View>
    </View>
  )
}

const StepThree = () => {
  const { setNextButtonEnabled } = useWizard()

  return (
    <View style={styles.contentWrapper}>
      <HoliText>Step three</HoliText>
      <View style={styles.buttonContainer}>
        <HoliButton style={styles.button} onPress={() => setNextButtonEnabled(true)} label={'enable button'}>
          <HoliText>Enable</HoliText>
        </HoliButton>
        <HoliButton
          style={[styles.button, { backgroundColor: colors.background10 }]}
          onPress={() => setNextButtonEnabled(false)}
          label={'disable button'}
        >
          <HoliText>Disable</HoliText>
        </HoliButton>
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
  return (
    <HoliContainer>
      <HoliWizard {...args}>
        <StepOne />
        <StepTwo />
        <StepThree />
      </HoliWizard>
    </HoliContainer>
  )
}

export const BasicExample: ComponentStory<typeof HoliWizard> = Template.bind({})

BasicExample.argTypes = {
  isBackButtonAvailable: { description: 'Back button status', type: 'boolean', control: { type: 'boolean' } },
}

BasicExample.args = {
  isBackButtonAvailable: true,
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
    borderColor: colors.brandColorB30,
    backgroundColor: colors.brandColorB30,
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
