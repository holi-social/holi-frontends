import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { ReportCategory } from '@holi/core/screens/report/types'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import useWizard from '@holi/ui/components/organisms/HoliWizard/useWizard'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type ReportListProps = {
  categories: ReportCategory[]
  selectedCategory: ReportCategory | null
  onCategorySelection: (category: ReportCategory) => void
}

const ReportList = ({ categories, onCategorySelection, selectedCategory }: ReportListProps) => {
  const { t } = useTranslation()
  const { setNextButtonEnabled } = useWizard()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const handleCategorySelect = (category: ReportCategory) => {
    onCategorySelection(category)
  }

  useEffect(() => {
    if (selectedCategory) {
      setNextButtonEnabled(true)
    } else {
      setNextButtonEnabled(false)
    }
  }, [selectedCategory, setNextButtonEnabled])

  return (
    <View style={styles.container}>
      <HoliHeading>{t('report.post.create.heading')}</HoliHeading>
      <View style={styles.cardContainer}>
        {categories.map((category) => (
          <View key={category.id} style={styles.card}>
            <View style={styles.textContainer}>
              <HoliText bold>{category.title}</HoliText>
              <HoliText color={'gray300'}>{category.description}</HoliText>
            </View>
            <HoliCheckbox
              aria-label={category.title}
              shape="round"
              onSelect={() => handleCategorySelect(category)}
              checked={selectedCategory === category}
              style={styles.checkbox}
            />
          </View>
        ))}
      </View>
    </View>
  )
}

export default ReportList

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      ...Platform.select({
        native: {
          paddingTop: Spacing['3xl'],
        },
      }),
      marginHorizontal: -Spacing.xs,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing['4xs'],
      backgroundColor: '#FFFFFF',
      borderRadius: Spacing.xxs,
      paddingHorizontal: Spacing.xs,
      paddingVertical: Spacing.xxs,
      borderWidth: 1,
      borderColor: '#BFBEBE',
    },
    cardContainer: {
      paddingTop: Spacing.md,
      gap: 10,
      paddingBottom: Spacing['3xl'],
    },
    checkbox: {
      right: Spacing.xs,
      top: Spacing.xxs,
      position: 'absolute',
      marginLeft: Spacing['3xs'],
      color: theme.colors.foreground30,
    },
    textContainer: {
      flex: 1,
      marginRight: Spacing.xxl,
      ...Platform.select({
        web: {
          flexWrap: 'wrap',
        },
      }),
    },
  })
