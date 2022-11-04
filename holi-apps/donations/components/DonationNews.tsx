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

import { Picture } from '@holi-apps/donations/typings'

type NewsEntry = {
  title: string
  id: string
  publishDate: string
  author?: {
    name: string
    picture?: Picture[]
  }
  body: string
  url: string
}

type DonationNewsProps = {
  totalEntries: number
  news: NewsEntry[]
  style?: ViewStyle | ViewStyle[]
}

const DonationNews: React.VFC<DonationNewsProps> = ({ totalEntries, news, ...props }: DonationNewsProps) => {
  const { t, i18n } = useTranslation()
  const styles = getStyles()
  const [mainNews, ...otherNews] = news

  const author = useMemo(() => {
    if (!mainNews.author) return undefined

    const { name, picture } = mainNews.author

    return {
      name: name || '',
      avatar: picture ? picture.find(({ type }) => type === 'fill')?.url : '',
    }
  }, [mainNews])

  return (
    <View style={[props?.style]}>
      <HoliText bold style={{ marginBottom: 24 }}>
        {t('donations:donationNews.total', { count: totalEntries })}
      </HoliText>
      <View style={{ marginBottom: 24 }}>
        <HoliText size="large" style={{ marginBottom: 24 }}>
          {mainNews.title}
        </HoliText>

        {author ? (
          <HoliMediaHeader
            style={{ marginBottom: 12 }}
            title={author.name}
            author={author}
            date={mainNews.publishDate}
          />
        ) : (
          <HoliText size="small" style={{ color: colors.fontColorGrey, marginBottom: 12 }}>
            {t('donations:donationNews.publishTime', {
              time: getRelativeDateString(mainNews.publishDate, i18n.language),
            })}
          </HoliText>
        )}

        <HoliReadMore numberOfLines={5} style={{ marginBottom: 12 }}>
          {mainNews.body}
        </HoliReadMore>

        {otherNews.length > 0 && (
          <View>
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
              >
                <View style={styles.newsListing}>
                  <View style={{ flex: 1 }}>
                    <HoliText bold size="small">
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
                  <HoliIcon
                    icon="share-box"
                    size={24}
                    style={{ ...(!entry.url && { display: 'none' }), flexShrink: 0 }}
                  />
                </View>
              </HoliButton>
            ))}
          </View>
        )}
      </View>
    </View>
  )
}

export default DonationNews

const getStyles = () =>
  StyleSheet.create({
    newsListing: {
      borderTopWidth: 1,
      borderColor: colors.borderColorGrey,
      paddingTop: 12,
      paddingBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
