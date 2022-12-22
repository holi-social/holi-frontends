import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Linking, Platform, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { commonStyles } from '@holi-apps/goodnews/common_styles'
import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsArticleComponentProps = {
  article: GoodNewsArticle
}

const GoodNewsArticleComponent: React.VFC<GoodNewsArticleComponentProps> = (props: GoodNewsArticleComponentProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const article = props.article

  return (
    <View style={styles.container} testID={'goodnews-article-component'}>
      <ImageBackground source={{ uri: article.pictureUrl }} resizeMode="cover" style={styles.headerBackgroundImage}>
        <HoliText size="extrasmall" style={[styles.pictureCredit, commonStyles.headerTextShadow]}>
          {article.pictureCredit}
        </HoliText>
      </ImageBackground>
      <View style={[mixins.container, styles.contentContainer]} testID="goodnews-list-item">
        {article.source && (
          <HoliText size="small" style={styles.source}>
            {article.source}
          </HoliText>
        )}
        <HoliText size="extralarge" style={styles.headline}>
          {article.headline}
        </HoliText>
        <HoliText style={styles.teaserText}>{article.teaserText}</HoliText>
        {/* TODO refactoring to modify <HoliLink /> so that it works as/with a button, too */}
        <HoliButton
          label={t('goodnews:button.readArticle')}
          onPress={() => Linking.openURL(article.articleUrl)}
          testID="btn-to-article-external"
          type="secondary"
        >
          <HoliText style={styles.externalLinkButtonText}>{t('goodnews:button.readArticle')}</HoliText>
          {/* TODO external link (part of HoliLink) ? */}
          <HoliIcon icon={'share-box'} />
        </HoliButton>
      </View>
    </View>
  )
}

export default GoodNewsArticleComponent

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
    borderColor: colors.borderColorBlack,
  },
  pictureCredit: {
    color: colors.fontColorWhite,
    paddingBottom: 8,
    paddingRight: 16,
    alignSelf: 'flex-end',
  },
  /* CONTENT CONTAINER */
  contentContainer: {
    flexGrow: 1,
    backgroundColor: colors.backgroundColorGreyLight,
    paddingTop: 16,
    paddingBottom: 14,
    ...Platform.select({ web: { paddingHorizontal: 24 } }),
  },
  source: { paddingBottom: 8 },
  headline: { paddingBottom: 8 },
  teaserText: { paddingBottom: 28 },
  externalLinkButtonText: {
    paddingRight: 6,
  },
})
