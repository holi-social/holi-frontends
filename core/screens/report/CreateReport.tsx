import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, StyleSheet, View } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useReportContent from '@holi/core/hooks/useReportContent'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { ContentType, ContentType3K } from '@holi/core/queries'
import FormLayout from '@holi/core/screens/individualPosts/components/FormLayout/FormLayout'
import GuidelinesModal from '@holi/core/screens/report/components/GuidelinesModal'
import { ReportReason } from '@holi/core/screens/report/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowLeft, Close, Information } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
      headerTitle: () => <HoliHeading size="s">{t('report.' + contentType + '.title')}</HoliHeading>,
      headerLeft: () => <HeaderBackButton icon={Close} onPress={navigateBack} />,
      headerRight: () => (
        <Pressable onPress={showGuidelinesDrawer}>
          <HoliIcon icon={Information} />
        </Pressable>
      ),
      headerTransparent: false,
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
                  <HoliButton
                    label={t('global.back')}
                    disabled={false}
                    onPress={() => setCurrentStep(0)}
                    inline
                    testID="holi-wizard-back-btn"
                    style={styles.backButton}
                  >
                    <HoliIcon icon={ArrowLeft} color={theme.colors.foreground30} />
                  </HoliButton>
                )}
                <Pressable
                  style={styles.submitButton}
                  onPress={() => currentStep === 1 && !termsAccepted && setShowTermsError(true)}
                >
                  <HoliButtonLoading
                    label={currentStep === 0 ? t('global.next') : t('global.report')}
                    inline
                    onPress={currentStep === 0 ? handleNext : handleSubmit}
                    loading={currentStep === 1 && isLoadingReport}
                    disabled={currentStep === 0 ? !selectedReason : !termsAccepted}
                    style={styles.submitButton}
                  />
                </Pressable>
              </View>
            </HoliContainer>
          </View>
        }
      >
        <HoliContainer noPadding={Platform.OS === 'web'}>
          {currentStep === 0 ? (
            <>
              <View style={styles.headingContainer}>
                <HoliHeading size="m" weight="300">
                  {t('report.reason.title')}
                </HoliHeading>
              </View>
              <View style={styles.reasonsContainer}>
                {reasonsList.map((reason) => (
                  <Pressable
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    style={[styles.card, selectedReason === reason && styles.selectedCard]}
                  >
                    <View style={styles.reasonTextContainer}>
                      <HoliText bold>{t(`report.reason.${reason}.title`)}</HoliText>
                      <HoliText color={'gray300'}>{t(`report.reason.${reason}.description`)}</HoliText>
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
                <HoliHeading size="m" weight="300">
                  {t('report.details.title', { subject: t(`report.reason.${selectedReason}.title`).toLowerCase() })}
                </HoliHeading>
                <HoliText color="gray300" style={styles.description}>
                  {t(`report.reason.${selectedReason}.description`)}
                </HoliText>
              </View>
              <View style={styles.detailsContainer}>
                <View style={styles.detailsInputContainer}>
                  <HoliText>{t('report.details.label')}</HoliText>
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
                  <HoliText color="error200" style={styles.errorText} size="small">
                    {t('report.details.termsError')}
                  </HoliText>
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
                  <HoliText style={styles.termsText}>{t('report.guidelines.checkboxLabel')}</HoliText>
                </Pressable>
              </View>
            </>
          )}
        </HoliContainer>
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
    backButton: {
      borderRadius: Spacing['3xl'] / 2,
      paddingHorizontal: 13,
      flexWrap: 'nowrap',
      backgroundColor: theme.colors.background10,
    },
    submitButton: {
      alignSelf: 'center',
      flex: 1,
      width: '100%',
    },
    description: {
      marginTop: Spacing.xs,
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
    termsText: {
      flex: 1,
    },
    errorText: {
      marginBottom: -Spacing.xs,
    },
  })
