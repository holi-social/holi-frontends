import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Linking, Platform, Pressable, StyleSheet, View } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import ReportList from '@holi/core/screens/report/ReportList'
import { categories } from '@holi/core/screens/report/categories'
import { ReportCategory } from '@holi/core/screens/report/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close, Hearts, Information } from '@holi/icons/src/generated'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ReportType = 'FEED_POST' | 'COMMENT' | 'PROFILE' | 'CHAT' | 'CHAT_ROOM' | 'SPACE' | 'TASK' | 'APPOINTMENT'

export type CreateReportParams = {
  type: ReportType
  id: string
}

const { useParam } = createParamHooks<CreateReportParams>()

const CreateReport = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { navigateBack, navigate } = useRouting()
  const [reportType] = useParam('type')
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const { visible: guidelinesVisible, show: showGuidelinesDrawer, hide: hideGuidelinesDrawer } = useModalState()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      headerTitle: () => <HoliHeading size="s">{t('report.' + reportType + '.title')}</HoliHeading>,
      headerLeft: () => (
        <HeaderBackButton
          icon={Close}
          onPress={() => {
            navigateBack()
          }}
        />
      ),
      headerRight: () => (
        <Pressable onPress={showGuidelinesDrawer}>
          <HoliIcon icon={Information} />
        </Pressable>
      ),
      headerTransparent: true,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [navigateBack, setScreenOptions, showGuidelinesDrawer, t, reportType])

  const handleNextButtonPress = async () => {
    return selectedCategory !== null
  }

  const handleSubmitButtonPress = async () => {
    showGuidelinesDrawer()
    setSubmitted(true)
  }

  const handleCategorySelection = (category: ReportCategory) => {
    setSelectedCategory(category)
  }

  return (
    <View style={styles.wrapper}>
      <View style={[mixins.container, styles.container]}>
        <HoliWizard
          isBackButtonAvailable={true}
          onSubmit={handleSubmitButtonPress}
          onNextPress={handleNextButtonPress}
          showProgress={false}
          safeButtonLabel={t('report.submit.label')}
        >
          <ReportList
            onCategorySelection={handleCategorySelection}
            categories={categories}
            selectedCategory={selectedCategory}
          />
        </HoliWizard>
        <HoliModal show={guidelinesVisible} label={t('report.guidelines.title')} autoHeight>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <HoliHeading>{submitted ? t('report.submitted.title') : t('report.guidelines.title')}</HoliHeading>
              <HoliText style={styles.subline}>
                {submitted ? t('report.submitted.description') : t('report.guidelines.description')}
              </HoliText>
            </View>
            <HoliDivider />
            <View style={styles.icons}>
              <Pressable
                style={styles.iconContainer}
                onPress={() => navigate('/profile/settings/legalDocuments/document?type=communityGuidelines')}
              >
                <HoliIcon icon={Hearts} />
                <HoliText>{t('report.guidelines.communityGuidelines')}</HoliText>
              </Pressable>
              <Pressable
                style={styles.iconContainer}
                onPress={() => Linking.openURL('https://holi.social/help-center/moderation')}
              >
                <HoliIcon icon={Information} />
                <HoliText>{t('report.guidelines.howWeModerate')}</HoliText>
              </Pressable>
            </View>
            <HoliButton
              onPress={submitted ? () => navigateBack() : hideGuidelinesDrawer}
              label={submitted ? t('report.submitted.button') : t('report.guidelines.close')}
              style={styles.button}
            >
              {submitted ? t('report.submitted.button') : t('report.guidelines.close')}
            </HoliButton>
          </View>
        </HoliModal>
      </View>
    </View>
  )
}

export default CreateReport

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    button: {
      marginVertical: 12,
      backgroundColor: theme.colors.brandColorA20,
    },
    wrapper: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.colors.background20,
      ...Platform.select({
        web: {
          height: '100%',
        },
      }),
    },
    defaultLayout: {
      backgroundColor: theme.colors.background10,
      paddingBottom: 0,
      width: '100%',
      minHeight: Platform.OS === 'web' ? ('100vh' as DimensionValue) : ('100%' as DimensionValue),
    },
    container: {
      flex: 1,
      paddingTop: dimensions.topBarHeight + 24,
      width: '100%',
      paddingHorizontal: 0,
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
    },
    modalContainer: {
      padding: 24,
      ...Platform.select({
        web: {
          maxWidth: dimensions.maxScreenWidth,
          alignSelf: 'center',
        },
      }),
    },
    icons: {
      flexDirection: 'column',
      gap: 24,
      paddingVertical: 24,
    },
    iconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    modalHeader: {
      gap: 12,
      paddingBottom: 24,
    },
    subline: {
      color: theme.colors.gray300,
    },
  })
