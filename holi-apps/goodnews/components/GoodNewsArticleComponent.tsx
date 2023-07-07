import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Linking, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { setScalingParams } from '@holi/ui/components/atoms/HoliImage/resizing'
import { useImageScalingWindowDimensions } from '@holi/ui/components/atoms/HoliImage/useImageScalingWindowDimensions'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { commonStyles } from '@holi-apps/goodnews/common_styles'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsArticleComponentProps = {
  article: GoodNewsArticle
  style?: StyleProp<ViewStyle>
  accessible?: boolean
}

const GoodNewsArticleComponent: React.VFC<GoodNewsArticleComponentProps> = ({
  article,
  accessible = true,
  style,
}: GoodNewsArticleComponentProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { imageWidth, imageHeight } = useImageScalingWindowDimensions({
    relativeHeight: Platform.OS === 'web' ? 0.75 : 0.5,
  })
  const { uri: scaledImageUri } = setScalingParams({ uri: article.pictureUrl, width: imageWidth, height: imageHeight })

  return (
    <View
      style={[styles.container, style]}
      testID={'goodnews-detailview-container'}
      accessibilityElementsHidden={!accessible}
      importantForAccessibility={accessible ? 'yes' : 'no-hide-descendants'}
    >
      {/** TODO replace ImageBackground with a holi component that has all image sizing features like HoliImage */}
      <ImageBackground source={{ uri: scaledImageUri }} resizeMode="cover" style={styles.headerBackgroundImage}>
        {!!article.pictureCredit && (
          <HoliText size="extrasmall" style={[styles.pictureCredit, commonStyles.headerTextShadow]}>
            {article.pictureCredit}
          </HoliText>
        )}
      </ImageBackground>
      <View style={[mixins.container, styles.contentContainer]} testID="goodnews-list-item">
        {!!article.source && (
          <HoliText size="small" style={styles.source}>
            {article.source}
          </HoliText>
        )}
        <HoliHeading level="1" size="large" style={styles.headline}>
          {article.headline}
        </HoliHeading>
        <HoliText style={styles.teaserText}>{article.teaserText}</HoliText>
        {/* TODO refactoring to modify <HoliLink /> so that it works as/with a button, too */}
        <HoliButton
          label={t('goodnews:button.readArticle')}
          onPress={() => Linking.openURL(article.articleUrl)}
          testID="btn-to-article-external"
          type="secondary"
        >
          <HoliText style={styles.externalLinkButtonText} selectable={false}>
            {t('goodnews:button.readArticle')}
          </HoliText>
          {/* TODO external link (part of HoliLink) ? */}
          <HoliIcon icon={'share-box'} />
        </HoliButton>
      </View>
    </View>
  )
}

export default memo(GoodNewsArticleComponent)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
  },
  /* HEADER CONTAINER */
  headerBackgroundImage: {
    justifyContent: 'flex-end',
    alignContent: 'stretch',
    flexGrow: 500,
    flexShrink: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.foreground30,
  },
  pictureCredit: {
    color: colors.background10,
    paddingBottom: 8,
    paddingRight: 16,
    alignSelf: 'flex-end',
  },
  /* CONTENT CONTAINER */
  contentContainer: {
    flexGrow: 1,
    paddingTop: 16,
    paddingBottom: 14,
    ...Platform.select({
      web: {
        paddingHorizontal: 24,
      },
    }),
  },
  source: {
    paddingBottom: 8,
  },
  headline: {
    paddingBottom: 8,
    fontWeight: '400',
  },
  teaserText: {
    paddingBottom: 28,
  },
  externalLinkButtonText: {
    paddingRight: 6,
  },
})
