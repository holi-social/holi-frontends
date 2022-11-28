import { useQuery } from '@apollo/client'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { displayError } from '@holi/core/errors/helpers'
import DiscoverSpacesView from '@holi/core/screens/spaces/components/DiscoverSpacesView'
import { topicsQuery } from '@holi/core/screens/spaces/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import { TopicsQueryResult } from '@holi/core/screens/userprofile/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type DiscoverSpacesProps = {
  style?: StyleProp<ViewStyle>
}

const DiscoverSpaces: React.VFC<DiscoverSpacesProps> = ({ style }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { loading, data, error } = useQuery<TopicsQueryResult>(topicsQuery)

  const topics = data?.topics.data || []

  const { user } = useContext(UserContext)

  if (error) {
    displayError(error, t('spaces.spaceListing.error'))
  }

  if (loading) {
    // TODO: replace with proper loading indicator
    return (
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
      </View>
    )
  }

  return <DiscoverSpacesView style={style} user={user} topics={topics} />
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
})

export default DiscoverSpaces
