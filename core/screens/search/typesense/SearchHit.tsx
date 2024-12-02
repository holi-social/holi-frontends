import { SearchHitLink } from '@holi/core/screens/search/typesense/SearchHitLink'
import { SearchHitData, facet18nKey } from '@holi/core/screens/search/typesense/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

export type SearchHitProps = {
  hit: SearchHitData
  language: string
}

export const SearchHit = ({ hit, language }: SearchHitProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const useTitleEn = (language === 'en' && hit.title_en) || (language === 'de' && !hit.title_de)
  return (
    <View style={{ flexDirection: 'row', columnGap: dimensions.spacingSM }}>
      <HoliImage
        source={{
          uri: hit.image_url,
          width: THUMBNAIL_SIZE,
          height: THUMBNAIL_SIZE,
        }}
        label={(useTitleEn ? hit.title_en : hit.title_de) || ''}
        style={styles.imageColumn}
      />
      <View style={{ flexDirection: 'column', flex: 1, rowGap: dimensions.spacingXs }}>
        <View style={{ flexDirection: 'row', columnGap: dimensions.spacingXs }}>
          <Text size={'xs'} variant={'secondary'}>
            {t(facet18nKey[hit.type])}
          </Text>
          <Text size={'xs'} variant={'secondary'}>
            &middot;
          </Text>
          <Text size={'xs'} variant={'secondary'}>
            {hit.location}
          </Text>
        </View>
        <SearchHitLink hit={hit} label={(useTitleEn ? hit.title_en : hit.title_de) || ''}>
          {useTitleEn && <Text size={'sm'}>{hit.title_en}</Text>}
          {!useTitleEn && <Text size={'sm'}>{hit.title_de}</Text>}
        </SearchHitLink>
      </View>
    </View>
  )
}

const THUMBNAIL_SIZE = 48

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    imageColumn: {
      flexBasis: THUMBNAIL_SIZE,
      width: THUMBNAIL_SIZE,
      height: THUMBNAIL_SIZE,
      borderRadius: 8,
      borderColor: theme.colors.black300,
      borderWidth: 1,
      backgroundColor: theme.colors.background20,
    },
  })
