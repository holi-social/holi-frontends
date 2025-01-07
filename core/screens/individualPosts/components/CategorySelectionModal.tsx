import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'

import type { FeedPostCategories } from '@holi/core/screens/individualPosts/useFeedPostCategories'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export const CategorySelectionModal: React.FC<{
  visible: boolean
  categories: FeedPostCategories | null
  selectedCategoryId: string | null
  onCategorySelection: (categoryId: string) => void
  handleModalClose: () => void
}> = ({ categories, selectedCategoryId, visible, onCategorySelection, handleModalClose }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const windowWidth = Dimensions.get('window').width

  const styles = useMemo(() => getStyles(theme, windowWidth), [theme, windowWidth])

  return (
    <HoliModal
      shown={visible}
      label={t('individuals.post.onboarding.label')}
      onDismiss={() => handleModalClose()}
      style={styles.modal}
    >
      <HoliModalContentWrapper
        actionButtonText={t('global.save')}
        onActionButtonPress={() => handleModalClose()}
        testID={'post-onboard-content'}
        headlineAlign="center"
      >
        <HoliContainer>
          <HoliGap size={'xs'} />
          <HoliText size="large">{t('individuals.post.input.category.title')}</HoliText>
          <HoliGap />
          <View style={styles.categoryContainer}>
            {categories?.map((category) => (
              <Pressable
                key={category.name}
                style={[styles.category, selectedCategoryId === category.id && styles.categorySelected]}
                onPress={() => onCategorySelection(category.id)}
              >
                <View style={styles.categoryContent}>
                  <HoliLocalImage
                    imageSource={category.image as StaticImageData}
                    width={40}
                    height={40}
                    isSvg
                    label={category.name}
                  />
                  <HoliText bold>{category.name}</HoliText>
                </View>
              </Pressable>
            ))}
          </View>
          <HoliGap size="l" />
        </HoliContainer>
      </HoliModalContentWrapper>
    </HoliModal>
  )
}

const getStyles = (theme: HoliTheme, windowWidth: number) =>
  StyleSheet.create({
    modal: {
      backgroundColor: theme.colors.background30,
    },
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
      gap: dimensions.spacingS,
    },
    categorySelected: {
      borderColor: theme.colors.black300,
    },
    categoryContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
  })
