import { Highlight } from '@holi/core/screens/search/Highlight'
import { SearchHitLink } from '@holi/core/screens/search/SearchHitLink'
import { SearchHitData, SearchHitTypes } from '@holi/core/screens/search/types'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { Hit } from 'instantsearch.js'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

export type SearchHitProps = {
  hit: Hit<SearchHitData>
}

export const SearchHit = ({ hit }: SearchHitProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <View style={{ flexDirection: 'row', columnGap: dimensions.spacingSM }}>
      <HoliImage
        source={{
          uri: hit.image_url,
          width: THUMBNAIL_SIZE,
          height: THUMBNAIL_SIZE,
        }}
        label={hit.title_de ?? hit.title_en ?? ''}
        style={styles.imageColumn}
      />
      <View style={{ flexDirection: 'column', rowGap: dimensions.spacingXs }}>
        <View style={{ flexDirection: 'row', columnGap: dimensions.spacingXs }}>
          <Text size={'xs'} variant={'secondary'}>
            {SearchHitTypes[hit.type]}
          </Text>
          <Text size={'xs'} variant={'secondary'}>
            &middot;
          </Text>
          <Text size={'xs'} variant={'secondary'}>
            {hit.location_de ?? hit.location_en}
          </Text>
        </View>
        <SearchHitLink hit={hit}>
          {/* TODO these grow outside the container, how to constrain them? */}
          {/* TODO can we build highlighting with one text component? */}
          {hit.title_de && <Highlight size={'sm'} hit={hit} attribute={'title_de'} />}
          {hit.title_en && !hit.title_de && <Highlight size={'sm'} hit={hit} attribute={'title_en'} />}
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
