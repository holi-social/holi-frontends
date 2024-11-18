import { Highlight } from '@holi/core/screens/search/typesense/Highlight'
import { SearchHitLink } from '@holi/core/screens/search/typesense/SearchHitLink'
import { SearchHitData, facet18nKey } from '@holi/core/screens/search/typesense/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { Hit } from 'instantsearch.js'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

export type SearchHitProps = {
  hit: Hit<SearchHitData>
}

export const SearchHit = ({ hit }: SearchHitProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const language = useTranslation().i18n.language
  const useTitleEn = language === 'en' && hit.title_en
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
      <View style={{ flexDirection: 'column', rowGap: dimensions.spacingXs }}>
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
          {/* TODO these grow outside the container, how to constrain them? */}
          {/* TODO can we build highlighting with one text component? */}
          {useTitleEn && <Highlight size={'sm'} hit={hit} attribute={'title_en'} />}
          {!useTitleEn && <Highlight size={'sm'} hit={hit} attribute={'title_de'} />}
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
