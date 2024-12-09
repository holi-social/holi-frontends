import { Button } from 'holi-bricks/components/button/Button'
import { Text } from 'holi-bricks/components/text'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useReportContent from '@holi/core/hooks/useReportContent'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import type { ContentType, ContentType3K } from '@holi/core/queries'
import FormLayout from '@holi/core/components/FormLayout/FormLayout'
import GuidelinesModal from '@holi/core/screens/report/components/GuidelinesModal'
import { ReportReason } from '@holi/core/screens/report/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close, Information } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import Spacing from '@holi/ui/foundations/Spacing'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type CreateReportParams = {
  id: string
  type: ContentType
  type3k: ContentType3K
}

const { useParam } = createParamHooks<CreateReportParams>()

const CreateReport = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { navigateBack } = useRouting()
  const [contentType] = useParam('type')
  const [contentType3k] = useParam('type3k')
  const [id] = useParam('id')
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [details, setDetails] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showTermsError, setShowTermsError] = useState(false)
  const { visible: guidelinesVisible, show: showGuidelinesDrawer, hide: hideGuidelinesDrawer } = useModalState()
  const [isLoadingReport, reportContent] = useReportContent({
    id: id || '',
    contentType3k: contentType3k as ContentType3K,
    contentType: contentType as ContentType,
    successMsg: t('global.report.successMessage'),
    reason: selectedReason as ReportReason,
    details,
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => <Text size="sm">{t('report.' + contentType + '.title')}</Text>,
      headerLeft: () => <HeaderBackButton icon={Close} onPress={navigateBack} />,
      headerRight: () => (
        <Pressable onPress={showGuidelinesDrawer}>
          <HoliIcon icon={Information} />
        </Pressable>
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [navigateBack, setScreenOptions, showGuidelinesDrawer, t, contentType])

  const handleSubmit = async () => {
    if (!termsAccepted) {
      setShowTermsError(true)
      return
    }
    await reportContent()
    navigateBack()
  }

  const handleNext = () => {
    setCurrentStep(1)
  }

  // get the reasons list sorted, so that OTHER is always last
  const reasonsList = Object.values(ReportReason).sort((a, b) => {
    if (a === ReportReason.OTHER) return 1
    if (b === ReportReason.OTHER) return -1
    return 0
  })

  return (
    <View style={styles.wrapper}>
      <FormLayout
        hasSuggestions
        bottomBar={
          <View style={styles.bottomBar}>
            <HoliContainer>
              <View style={styles.buttonContainer}>
                {currentStep === 1 && (
                  <Button
                    label={t('global.back')}
                    disabled={false}
                    variant="secondary"
                    onPress={() => setCurrentStep(0)}
                    inline
                  />
                )}
                <Pressable
                  style={styles.submitButton}
                  onPress={() => currentStep === 1 && !termsAccepted && setShowTermsError(true)}
                >
                  <Button
                    label={currentStep === 0 ? t('global.next') : t('global.report')}
                    onPress={currentStep === 0 ? handleNext : handleSubmit}
                    disabled={isLoadingReport || (currentStep === 0 ? !selectedReason : !termsAccepted)}
                  />
                </Pressable>
              </View>
            </HoliContainer>
          </View>
        }
      >
        {currentStep === 0 ? (
          <>
            <View style={styles.headingContainer}>
              <Text size="xl" headingLevel="2">
                {t('report.reason.title')}
              </Text>
            </View>
            <View style={styles.reasonsContainer}>
              {reasonsList.map((reason) => (
                <Pressable
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  style={[styles.card, selectedReason === reason && styles.selectedCard]}
                >
                  <View style={styles.reasonTextContainer}>
                    <Text size="lg">{t(`report.reason.${reason}.title`)}</Text>
                    <Text size="sm" variant="secondary">
                      {t(`report.reason.${reason}.description`)}
                    </Text>
                  </View>
                  <HoliCheckbox
                    shape="round"
                    checked={selectedReason === reason}
                    onSelect={() => setSelectedReason(reason)}
                    autofocus={false}
                    disabled={false}
                    testID={`${selectedReason === reason ? 'checked-' : ''}${reason}`}
                    aria-label={t(`report.reason.${reason}.title`)}
                  />
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.headingContainer}>
              <Text size="xl" headingLevel="2">
                {t('report.details.title', {
                  subject: t(`report.reason.${selectedReason}.title`).toLowerCase(),
                })}
              </Text>
              <Text size="sm" variant="secondary">
                {t(`report.reason.${selectedReason}.description`)}
              </Text>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailsInputContainer}>
                <Text size="sm">{t('report.details.label')}</Text>
                <HoliTextInput
                  aria-label={t('report.details.placeholder')}
                  placeholder={t('report.details.placeholder')}
                  value={details}
                  onChange={setDetails}
                  noOfVisibleLines={4}
                  maxNoOfVisibleLines={12}
                  maxNoOfCharacters={500}
                  showCharacterCount
                />
              </View>
              {showTermsError && (
                <Text size="sm" variant="error">
                  {t('report.details.termsError')}
                </Text>
              )}
              <Pressable
                style={styles.termsContainer}
                onPress={() => {
                  setTermsAccepted(!termsAccepted)
                  setShowTermsError(false)
                }}
              >
                <HoliCheckbox
                  aria-label={t('report.details.terms')}
                  shape="box"
                  checked={termsAccepted}
                  onSelect={() => setTermsAccepted(!termsAccepted)}
                  testID="terms-checkbox"
                />
                <View style={styles.termsLabel}>
                  <Text size="xs">{t('report.guidelines.checkboxLabel')}</Text>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </FormLayout>

      <GuidelinesModal visible={guidelinesVisible} hide={hideGuidelinesDrawer} />
    </View>
  )
}

export default CreateReport

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background20,
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: '100%',
      width: '100%',
    },
    headingContainer: {
      paddingTop: Platform.OS === 'web' ? Spacing.lg : Spacing.sm,
      gap: Spacing['3xs'],
    },
    reasonsContainer: {
      gap: Spacing['3xs'],
      paddingVertical: Platform.OS === 'web' ? Spacing.lg : Spacing.sm,
    },
    card: {
      padding: Spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.gray100,
      backgroundColor: theme.colors.background10,
      borderRadius: Spacing.xs,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: Spacing.xs,
    },
    selectedCard: {
      borderColor: theme.colors.gray300,
    },
    reasonTextContainer: {
      gap: Spacing['3xs'],
      flex: 1,
    },
    bottomBar: {
      paddingVertical: Spacing.xxs,
      borderTopWidth: 1,
      borderTopColor: theme.colors.gray100,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      gap: Spacing['3xs'],
    },
    submitButton: {
      alignSelf: 'center',
      flex: 1,
      width: '100%',
      flexWrap: 'nowrap',
    },
    detailsContainer: {
      gap: Spacing['3xs'],
      paddingVertical: Platform.OS === 'web' ? Spacing.lg : Spacing.sm,
    },
    detailsInputContainer: {
      gap: Spacing['3xs'],
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      marginTop: Spacing.xs,
    },
    termsLabel: {
      flex: 1,
    },
  })
