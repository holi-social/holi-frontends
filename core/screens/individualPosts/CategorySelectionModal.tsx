import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { FeedPostCategories } from '@holi/core/screens/individualPosts/useFeedPostCategories'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export const CategorySelectionModal: React.FC<{
  show: boolean
  categories: FeedPostCategories
  onCategorySelection: (categoryId: string) => void
}> = (props) => {
  const { t } = useTranslation()
  const { navigateBack } = useRouting()
  const { theme } = useTheme()
  const windowWidth = Dimensions.get('window').width
  const styles = useMemo(() => getModalStyles(theme, windowWidth), [theme, windowWidth])

  return (
    <HoliModal show={props.show} label={''} relativeHeight={1} autoHeight={false} style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <HeaderBackButton
            icon={Close}
            onPress={() => navigateBack()}
            tintColor={theme.colors.black300}
            style={styles.backButton}
          />
          <HoliHeading level="1" size="s">
            {t('individuals.post.input.title')}
          </HoliHeading>
        </View>
        <HoliText size="large" style={styles.modalTitle}>
          {t('individuals.post.input.category.title')}
        </HoliText>
        <View style={styles.categoryContainer}>
          {props.categories.map((category) => (
            <Pressable
              key={category.name}
              style={({ hovered }) => [styles.category, hovered ? styles.categoryHovered : styles.category]}
              onPress={() => props.onCategorySelection(category.id)}
            >
              <View style={styles.categoryContent}>
                <HoliLocalImage imageSource={category.image} width={40} height={40} isSvg label={''} />
                <HoliText bold>{category.name}</HoliText>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </HoliModal>
  )
}

const getModalStyles = (theme: HoliTheme, windowWidth: number) =>
  StyleSheet.create({
    // modal styles
    category: {
      padding: 16,
      backgroundColor: theme.colors.background10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      height: 72,
    },
    categoryContainer: {
      display: windowWidth > dimensions.breakpointXl ? 'grid' : 'flex',
      gridTemplateColumns: windowWidth > dimensions.breakpointXl ? '1fr 1fr' : 'none',
      flexDirection: windowWidth > dimensions.breakpointXl ? 'row' : 'column',
      flexWrap: windowWidth > dimensions.breakpointXl ? 'wrap' : 'nowrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    categoryHovered: {
      padding: 16,
      backgroundColor: theme.colors.background10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.black300,
      height: 72,
    },
    categoryContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    modal: {
      backgroundColor: theme.colors.background20,
      paddingHorizontal: 16,
      paddingTop: 0,
    },
    modalContent: {
      paddingTop: Platform.OS === 'web' ? 0 : 36,
      width: '100%',
      maxWidth: dimensions.maxScreenWidth,
      alignSelf: 'center',
    },
    modalTitle: {
      marginVertical: 24,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 16,
      backgroundColor: theme.colors.background20,
    },
    backButton: {
      position: 'absolute',
      left: 4,
    },
  })
