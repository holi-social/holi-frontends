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
import { Close, Information } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
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
  const { visible: guidelinesVisible, show: showGuidelinesDrawer, hide: hideGuidelinesDrawer } = useModalState()
  const [isLoadingReport, reportContent] = useReportContent({
    id: id || '',
    contentType3k: contentType3k as ContentType3K,
    contentType: contentType as ContentType,
    successMsg: t('global.report.successMessage'),
    reason: selectedReason as ReportReason,
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
    await reportContent()
    navigateBack()
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
              <HoliButtonLoading
                label={t('global.report')}
                inline
                onPress={handleSubmit}
                loading={isLoadingReport}
                disabled={!selectedReason}
                style={styles.submitButton}
              />
            </HoliContainer>
          </View>
        }
      >
        <HoliContainer noPadding={Platform.OS === 'web'}>
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
    submitButton: {
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
    },
  })
