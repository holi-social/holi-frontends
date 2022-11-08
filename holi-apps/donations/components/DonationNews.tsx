import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View, ViewStyle } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'

import { News } from '@holi-apps/donations/typings'

type DonationNewsProps = {
  totalEntries: number
  news: News[]
  style?: ViewStyle | ViewStyle[]
}

const DonationNews: React.VFC<DonationNewsProps> = ({ totalEntries, news, ...props }: DonationNewsProps) => {
  const { t, i18n } = useTranslation()
  const styles = getStyles()
  const [mainNews, ...otherNews] = news

  const author = useMemo(() => {
    if (!mainNews || !mainNews.author) return undefined

    const { name, picture } = mainNews.author

    return {
      name: name,
      avatar: picture ? picture.find(({ type }) => type === 'fill')?.url : '',
    }
  }, [mainNews])

  return (
    <View style={[props?.style]}>
      <HoliText bold style={{ marginBottom: totalEntries === 0 ? 0 : 24 }} testID="donations-news-count">
        {t('donations:donationNews.total', { count: totalEntries })}
      </HoliText>
      {mainNews && (
        <View testID="donation-news-spotlight" style={{ marginBottom: 24 }}>
          <HoliButton
            label={t('donations:donationNews.readArticle')}
            transparent
            disabled={!mainNews.url}
            onPress={() => mainNews.url && Linking.openURL(mainNews.url)}
          >
            <HoliText size="large" style={{ marginBottom: 12 }}>
              {mainNews.title}
            </HoliText>

            {author ? (
              <HoliMediaHeader
                style={{ marginBottom: 24 }}
                title={author.name}
                author={author}
                date={mainNews.publishDate}
              />
            ) : (
              <HoliText size="small" style={{ color: colors.fontColorGrey, marginBottom: 24 }}>
                {t('donations:donationNews.publishTime', {
                  time: getRelativeDateString(mainNews.publishDate, i18n.language),
                })}
              </HoliText>
            )}
          </HoliButton>

          <HoliReadMore numberOfLines={5}>{mainNews.body}</HoliReadMore>
        </View>
      )}

      {otherNews.length > 0 && (
        <View testID="donations-news-other">
          <HoliText bold style={{ marginBottom: 12 }}>
            {t('donations:donationNews.moreUpdates', { count: totalEntries - 1 })}
          </HoliText>

          {otherNews.map((entry) => (
            <HoliButton
              key={entry.id}
              label={t('donations:donationNews.readArticle')}
              transparent
              disabled={!entry.url}
              onPress={() => entry.url && Linking.openURL(entry.url)}
              testID="donations-news-other-item"
            >
              <View style={styles.newsListing}>
                <View style={{ flex: 1 }}>
                  <HoliText bold size="small" style={{ marginBottom: 6 }}>
                    {entry.title}
                  </HoliText>
                  {entry.publishDate && (
                    <HoliText size="small" style={{ color: colors.fontColorGrey }}>
                      {t('donations:donationNews.publishTime', {
                        time: getRelativeDateString(entry.publishDate, i18n.language),
                      })}
                    </HoliText>
                  )}
                </View>
                {entry.url && <HoliIcon icon="share-box" size={24} style={{ flexShrink: 0 }} />}
              </View>
            </HoliButton>
          ))}
        </View>
      )}
    </View>
  )
}

export default DonationNews

const getStyles = () =>
  StyleSheet.create({
    newsListing: {
      borderTopWidth: 1,
      borderColor: colors.borderColorGrey,
      paddingTop: 18,
      marginTop: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
