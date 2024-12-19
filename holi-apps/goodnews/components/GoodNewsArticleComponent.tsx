import type React from 'react'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Linking, Platform, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import InfoModal, { type InfoModalItemProps } from '@holi/core/components/InfoModal'
import { ShareBox } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { setScalingParams } from '@holi/ui/components/atoms/HoliImage/resizing'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { getCommonStyles } from '@holi-apps/goodnews/common_styles'
import { relativeArticleImageHeightScaling } from '@holi-apps/goodnews/imageConfig'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import { Button } from 'holi-bricks/components/button'

export const GOODNEWS_IMG_SOURCES_MAPPING: {
  [name: string]: InfoModalItemProps
} = {
  'goodnews.eu': {
    logo: {
      src: require('@holi/ui/assets/img/goodnews/goodnews-logo.png'),
      width: 40,
      height: 40,
      isSvg: false,
    },
    wordmark: {
      src: require('@holi/ui/assets/img/goodnews/goodnews-wordmark.png'),
      width: 161,
      height: 24,
      isSvg: false,
    },
    url: 'https://goodnews.eu',
  },
}

type GoodNewsArticleComponentProps = {
  article: GoodNewsArticle
  style?: StyleProp<ViewStyle>
  accessible?: boolean
}

const GoodNewsArticleComponent: React.FC<GoodNewsArticleComponentProps> = ({
  article,
  accessible = true,
  style,
}: GoodNewsArticleComponentProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const commonStyles = useMemo(() => getCommonStyles(theme), [theme])

  const partnerModalState = useModalState()
  const partner = GOODNEWS_IMG_SOURCES_MAPPING['goodnews.eu']

  const { imageWidth, imageHeight } = useWindowDimensionsWithImageScaling({
    relativeHeight: relativeArticleImageHeightScaling,
  })
  const { uri: scaledImageUri } = setScalingParams({ uri: article.pictureUrl, width: imageWidth, height: imageHeight })

  return (
    <View
      style={[mixins.container, styles.container, style]}
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
        <PartnerInfoRow
          rowText={t('goodnews:app.subline')}
          showOutlinkIcon={false}
          partners={{ 'goodnews.eu': partner }}
          onPress={partnerModalState.show}
        />
        <HoliGap size="s" />
        <InfoModal
          items={{ 'goodnews.eu': partner }}
          shown={partnerModalState.visible}
          onDismiss={partnerModalState.hide}
          i18nPrefix={'goodnews:listing.partnerModal'}
        />
        <HoliText size="small" style={styles.source}>
          {article.source}
        </HoliText>
        <HoliHeading level="1" size="l">
          {article.headline}
        </HoliHeading>
        <HoliGap size="xs" />
        <HoliText numberOfLines={3}>{article.teaserText}</HoliText>
        <HoliGap size="xs" />
        {/* TODO refactoring to modify <HoliLink /> so that it works as/with a button, too */}
        <Button
          label={t('goodnews:button.readArticle')}
          onPress={() => Linking.openURL(article.articleUrl)}
          testID="btn-to-article-external"
          variant="secondary"
          size="md"
          icon={ShareBox}
        />
      </View>
    </View>
  )
}

export default memo(GoodNewsArticleComponent)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexGrow: 1,
      paddingHorizontal: 0,
    },
    /* HEADER CONTAINER */
    headerBackgroundImage: {
      justifyContent: 'flex-end',
      alignContent: 'stretch',
      flexGrow: 500,
      flexShrink: 1,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.foreground30,
    },
    pictureCredit: {
      color: theme.colors.light,
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
    externalLinkButtonText: {
      paddingRight: 6,
    },
  })
