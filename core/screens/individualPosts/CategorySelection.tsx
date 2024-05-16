import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Pressable, StyleSheet, View } from 'react-native'

import { FeedPostCategories } from '@holi/core/screens/individualPosts/useFeedPostCategories'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export const CategorySelection: React.FC<{
  loading: boolean
  categories: FeedPostCategories | null
  onCategorySelection: (categoryId: string) => void
}> = (props) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const windowWidth = Dimensions.get('window').width
  const styles = useMemo(() => getStyles(theme, windowWidth), [theme, windowWidth])

  if (props.loading) {
    return (
      <HoliContainer>
        <HoliGap size={'xs'} />
        <HoliText size="large">{t('individuals.post.input.category.title')}</HoliText>
        <HoliGap />
        <HoliSkeleton height={72} width={'100%'} borderRadius={12} />
        <HoliGap size={'s'} />
        <HoliSkeleton height={72} width={'100%'} borderRadius={12} />
        <HoliGap size={'s'} />
        <HoliSkeleton height={72} width={'100%'} borderRadius={12} />
        <HoliGap size={'s'} />
        <HoliSkeleton height={72} width={'100%'} borderRadius={12} />
        <HoliGap size={'s'} />
      </HoliContainer>
    )
  }

  return (
    <HoliContainer>
      <HoliGap size={'xs'} />
      <HoliText size="large">{t('individuals.post.input.category.title')}</HoliText>
      <HoliGap />
      <View style={styles.categoryContainer}>
        {props.categories?.map((category) => (
          <Pressable
            key={category.name}
            style={({ hovered }) => [styles.category, hovered ? styles.categoryHovered : styles.category]}
            onPress={() => props.onCategorySelection(category.id)}
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
    </HoliContainer>
  )
}

const getStyles = (theme: HoliTheme, windowWidth: number) =>
  StyleSheet.create({
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
  })
