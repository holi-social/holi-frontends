import React from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, Linking, Platform, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { GoodNewsArticle } from '@holi-apps/goodnews/types'

type GoodNewsArticleComponentProps = {
  article: GoodNewsArticle
}

const GoodNewsArticleComponent: React.VFC<GoodNewsArticleComponentProps> = (props: GoodNewsArticleComponentProps) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const article = props.article

  return (
    <View
      style={{
        flex: 1,
        flexGrow: 1,
      }}
    >
      <ImageBackground source={{ uri: article.pictureUrl }} resizeMode="cover" style={styles.headerBackgroundImage}>
        <HoliText style={[styles.pictureCredit, styles.pictureCreditShadow]}>{article.pictureCredit}</HoliText>
      </ImageBackground>
      <View style={[mixins.container, styles.textContent]} testID="goodnews-list-item">
        <HoliText size={'small'} style={{ paddingBottom: 8 }}>
          {article.source || ''}
        </HoliText>
        <HoliText size={'extralarge'} style={{ paddingBottom: 8 }}>
          {article.headline}
        </HoliText>
        <HoliText size={'large'} style={{ paddingBottom: 16 }}>
          {article.teaserText}
        </HoliText>
        {/* TODO refactoring to modify <HoliLink /> so that it works as/with a button, too */}
        <HoliButton
          label={t('goodnews:button.readArticle')}
          onPress={() => Linking.openURL(article.articleUrl)}
          testID="btn-to-article-external"
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
  /* HEADER AREA */
  headerBackgroundImage: {
    justifyContent: 'flex-end',
    alignContent: 'stretch',
    flexGrow: 500,
    flexShrink: 1,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.borderColorBlack,
  },
  pictureCreditShadow: {
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  pictureCredit: {
    color: colors.fontColorWhite,
    paddingBottom: 9,
    paddingRight: 16,
    alignSelf: 'flex-end',
  },
  /* CONTENT AREA */
  textContent: {
    flexGrow: 1,
    backgroundColor: colors.backgroundColorGreyLight,
    paddingTop: 16,
    paddingBottom: 24,
    ...Platform.select({ web: { paddingHorizontal: 20 } }),
  },
  externalLinkButtonText: {
    paddingRight: 6,
  },
})
