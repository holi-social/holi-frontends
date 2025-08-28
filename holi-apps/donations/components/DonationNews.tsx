import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliMediaAuthorHeader, { type Author } from '@holi/core/components/HoliMediaAuthorHeader'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ShareBox } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import type { News } from '@holi-apps/donations/typings'

type DonationNewsProps = {
  totalEntries: number
  news: News[]
  style?: ViewStyle | ViewStyle[]
}

const DonationNews: React.FC<DonationNewsProps> = ({ totalEntries, news, ...props }: DonationNewsProps) => {
  const { t, i18n } = useTranslation()
  const [mainNews, ...otherNews] = news
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const author: Author | undefined = useMemo(() => {
    if (!mainNews || !mainNews.author) return undefined
    const { name, picture } = mainNews.author
    return {
      fullName: name,
      avatar: picture ? picture.find(({ type }) => type === 'fill')?.url : '',
      id: '',
      avatarLabel: '',
      avatarDefaultColor: '',
    }
  }, [mainNews])

  return (
    <View style={[props?.style]}>
      <HoliText bold style={{ marginBottom: totalEntries === 0 ? 0 : 24 }} testID="donations-news-count">
        {t('donations.donationNews.total', { count: totalEntries })}
      </HoliText>
      {mainNews && (
        <HoliLink label={t('donations.donationNews.readArticle')} href={mainNews.url} external>
          <View testID="donation-news-spotlight" style={{ marginBottom: 24 }}>
            <HoliText size="large" style={{ marginBottom: 12 }}>
              {mainNews.title}
            </HoliText>

            {author ? (
              <HoliMediaAuthorHeader author={author} date={mainNews.publishDate} style={{ marginBottom: 24 }} />
            ) : (
              <HoliText size="small" style={{ color: colors.foreground20, marginBottom: 24 }}>
                {t('donations.donationNews.publishTime', {
                  time: getRelativeDateString(mainNews.publishDate, i18n.language),
                })}
              </HoliText>
            )}

            <HoliReadMore numberOfLines={5}>{mainNews.body}</HoliReadMore>
          </View>
        </HoliLink>
      )}

      {otherNews.length > 0 && (
        <View testID="donations-news-other">
          <HoliText bold style={{ marginBottom: 12 }}>
            {t('donations.donationNews.moreUpdates')}
          </HoliText>

          {
            /** FIXME convert to VirtualizedList, FlatList or SectionList */
            otherNews.map((entry) => (
              <HoliLink
                key={entry.id}
                label={t('donations.donationNews.readArticle')}
                href={entry.url}
                external
                testID="donations-news-other-item"
              >
                <View style={styles.newsListing}>
                  <View style={{ flex: 1 }}>
                    <HoliText bold size="small" style={{ marginBottom: 6 }}>
                      {entry.title}
                    </HoliText>
                    {!!entry.publishDate && (
                      <HoliText size="small" style={{ color: colors.foreground20 }}>
                        {t('donations.donationNews.publishTime', {
                          time: getRelativeDateString(entry.publishDate, i18n.language),
                        })}
                      </HoliText>
                    )}
                  </View>
                  {!!entry.url && <HoliIcon icon={ShareBox} style={{ flexShrink: 0 }} />}
                </View>
              </HoliLink>
            ))
          }
        </View>
      )}
    </View>
  )
}

export default DonationNews

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    newsListing: {
      borderTopWidth: 1,
      borderColor: theme.colors.background30,
      paddingTop: 18,
      marginTop: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
