import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Image, StyleSheet, View, ViewStyle } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { colors } from '@holi/ui/styles/globalVars'

type NewsEntry = {
  title: string
  id: string
  publishDate: string
  author: {
    name: string
    avatar?: string
  }
  body: string
  url?: string
  picture?: string
  source?: string
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

  return (
    <View style={[props?.style]}>
      <HoliText bold style={{ marginBottom: 24 }}>
        {t('donations:donationNews.total', { count: totalEntries })}
      </HoliText>
      <View style={{ marginBottom: 24 }}>
        <HoliText size="large" style={{ marginBottom: 24 }}>
          {mainNews.title}
        </HoliText>

        <HoliMediaHeader title={mainNews.author.name} author={mainNews.author} date={mainNews.publishDate} />

        <HoliReadMore numberOfLines={5} style={{ marginBottom: 12 }}>
          {mainNews.body}
        </HoliReadMore>

        {mainNews.picture && (
          <View style={styles.mainImageBox}>
            <Image source={{ uri: mainNews.picture }} style={styles.mainImage} />
            {mainNews.source && (
              <HoliText size="small" style={styles.mainSource}>
                {mainNews.source}
              </HoliText>
            )}
          </View>
        )}

        {otherNews.length > 0 && (
          <View>
            <HoliText bold style={{ marginBottom: 12 }}>
              {t('donations:donationNews.moreUpdates', { count: totalEntries - 1 })}
            </HoliText>
            {otherNews.map((entry) => (
              <HoliButton
                key={entry.id}
                label={'some label' /* TODO LABEL */}
                transparent
                disabled={!entry.url}
                onPress={() => entry.url && Linking.openURL(entry.url)}
              >
                <View style={styles.newsListing}>
                  <View style={{ maxWidth: '90%' /* TODO: check for better width / grow */ }}>
                    <HoliText bold size="small">
                      {entry.title}
                    </HoliText>
                    {entry.publishDate && 
                    <HoliText size="small" style={{ color: colors.fontColorGrey }}>
                      {t('donations:donationNews.publishTime', { time: entry.publishDate })}
                    </HoliText>
                    }
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
    mainImageBox: {
      borderRadius: 12,
      width: '100%',
      borderColor: colors.borderColorGrey,
      borderWidth: 1,
      overflow: 'hidden',
      marginBottom: 24,
    },
    mainImage: {
      backgroundColor: colors.backgroundColorGreyLight,
      aspectRatio: 327 / 206,
      width: '100%',
    },
    mainSource: {
      color: colors.fontColorGrey,
      padding: 12,
    },
    newsListing: {
      borderTopWidth: 1,
      borderColor: colors.borderColorGrey,
      paddingTop: 12,
      paddingBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
