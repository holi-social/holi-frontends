import type React from 'react'
import { Platform, ScrollView, type ScrollViewProps, StyleSheet, View } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { PROGRESS_BAR_HEIGHT, ProgressBar } from '@holi/ui/components/organisms/HoliStepperV2/ProgressBar'
import { Spacing } from 'holi-bricks/foundations'
import NavigationButtons, { BUTTON_RECT, type NavigationButtonsProps } from './NavigationButtons'

const ONBOARDING_HEADER_OFFSET = PROGRESS_BAR_HEIGHT + Spacing.xxs
const ONBOARDING_FOOTER_OFFSET = BUTTON_RECT.height + Spacing.xxs + Spacing.lg

export interface RenderFuncOptions<D> {
  item: D
  key: string
  index: number
}

export type StepperButtonType = 'continue' | 'back' | 'skip'

export interface HoliStepperProps<D> extends Pick<ScrollViewProps, 'keyboardShouldPersistTaps'> {
  data: D[]
  keyExtractor: (item: D) => string
  renderStep: (options: RenderFuncOptions<D>) => React.ReactNode
  activeStepKey: string
  onChange: (key: string, previousKey: string, buttonPressed: StepperButtonType) => void
  WrapperComponent?: (preop: React.PropsWithChildren) => React.JSX.Element
  paddingTop?: number
  paddingBottom?: number
  testID?: string
}

export interface HoliStepperItem {
  progressBar?: { skippable?: boolean }
  footerNavigation?: Pick<NavigationButtonsProps, 'isBackButtonAvailable' | 'isNextButtonEnabled' | 'nextButtonLabel'>
}

const DefaultWrapperComponent = ({ children }: React.PropsWithChildren) => (
  <HoliContainer flex={1}>{children}</HoliContainer>
)

export const HoliStepper = <D extends HoliStepperItem>({
  data,
  keyExtractor,
  renderStep,
  activeStepKey,
  onChange,
  WrapperComponent = DefaultWrapperComponent,
  paddingTop = 0,
  paddingBottom = 0,
  keyboardShouldPersistTaps = 'handled',
  testID = 'holi-stepper',
}: HoliStepperProps<D>) => {
  const activeStepIndex = data.findIndex((item) => keyExtractor(item) === activeStepKey)
  const activeStepData = data[activeStepIndex]

  const stepsWithProgressBar = data.filter((item) => item.progressBar)
  const currentIndexInProgressBar = stepsWithProgressBar.findIndex((item) => keyExtractor(item) === activeStepKey)

  const onContinue = (buttonPressed: StepperButtonType) => {
    const nextStepIndex = activeStepIndex + 1
    if (nextStepIndex < data.length) {
      const previousStepKey = keyExtractor(data[activeStepIndex])
      const nextStepKey = keyExtractor(data[nextStepIndex])
      onChange(nextStepKey, previousStepKey, buttonPressed)
    }
  }

  const onGoBack = () => {
    const nextStepIndex = activeStepIndex - 1
    if (nextStepIndex >= 0) {
      const previousStepKey = keyExtractor(data[activeStepIndex])
      const nextStepKey = keyExtractor(data[nextStepIndex])
      onChange(nextStepKey, previousStepKey, 'back')
    }
  }

  const showProgressBar = !!activeStepData?.progressBar
  const showNavigationButtons = !!activeStepData?.footerNavigation

  return (
    <View style={styles.flex1} testID={testID}>
      <HoliTransition.FadeSwitch animKey={activeStepKey} style={styles.stepContainer}>
        <ScrollView
          style={styles.flex1}
          contentContainerStyle={{
            minHeight: '100%',
            paddingTop: paddingTop + (showProgressBar ? ONBOARDING_HEADER_OFFSET : 0),
            paddingBottom: paddingBottom + (showNavigationButtons ? ONBOARDING_FOOTER_OFFSET : 0),
          }}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          <WrapperComponent>
            {renderStep({
              item: activeStepData,
              key: activeStepKey,
              index: activeStepIndex,
            })}
          </WrapperComponent>
        </ScrollView>
      </HoliTransition.FadeSwitch>

      {/* Progress Bar */}
      <HoliTransition.FadeUp visible={showProgressBar} style={[styles.floatingElement, { top: paddingTop }]}>
        <WrapperComponent>
          <ProgressBar
            currentStep={currentIndexInProgressBar}
            totalCount={stepsWithProgressBar.length}
            onSkipPress={() => onContinue('skip')}
            testID={`${testID}-progress-bar`}
          />
        </WrapperComponent>
      </HoliTransition.FadeUp>

      {/* Footer Buttons */}
      <HoliTransition.FadeDown
        visible={showNavigationButtons}
        style={[styles.floatingElement, { bottom: paddingBottom }]}
      >
        <WrapperComponent>
          <HoliBox padding={[Spacing['4xs'], 0]}>
            <NavigationButtons
              onNextPress={() => onContinue('continue')}
              onBackPress={onGoBack}
              {...(activeStepData?.footerNavigation ?? {})}
              testID={`${testID}-nav-buttons`}
            />
          </HoliBox>
        </WrapperComponent>
      </HoliTransition.FadeDown>
    </View>
  )
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  floatingElement: {
    position: 'absolute',
    width: '100%',
  },
  stepContainer: {
    flex: 1,
    width: '100%',
    ...Platform.select({
      web: {
        flexBasis: 0,
      },
    }),
  },
})
