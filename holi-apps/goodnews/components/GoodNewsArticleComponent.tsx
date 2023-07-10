import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Linking, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { setScalingParams } from '@holi/ui/components/atoms/HoliImage/resizing'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { commonStyles } from '@holi-apps/goodnews/common_styles'
import { relativeArticleImageHeightScaling } from '@holi-apps/goodnews/imageConfig'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'
import PartnerInfoRow from '@holi-apps/volunteering/components/PartnerInfoRow'
import PartnerModal from '@holi-apps/volunteering/components/PartnerModal'
import { PartnerProps } from '@holi-apps/volunteering/types'

const GOODNEWS_IMG_SOURCES_MAPPING: {
  [name: string]: PartnerProps
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

  const { show: showPartnerModal, hide: closeModal, visible: show } = useModalState()
  const partner = GOODNEWS_IMG_SOURCES_MAPPING['goodnews.eu']

  const { imageWidth, imageHeight } = useWindowDimensionsWithImageScaling({
    relativeHeight: relativeArticleImageHeightScaling,
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
        <HoliBox padding={[0, 0, 16, 0]}>
          <PartnerInfoRow
            rowText={t('goodnews:app.subline')}
            showOutlinkIcon={false}
            partner={partner}
            onPress={showPartnerModal}
          />
        </HoliBox>
        <PartnerModal
          headline={t('goodnews:listing.partnerModal.headline')}
          text={t('goodnews:listing.partnerModal.text')}
          buttonText={t('goodnews:listing.partnerModal.link.text')}
          partner={partner}
          show={show}
          onDismiss={closeModal}
        />
        <HoliText size="small" style={styles.source}>
          {article.source}
        </HoliText>
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
