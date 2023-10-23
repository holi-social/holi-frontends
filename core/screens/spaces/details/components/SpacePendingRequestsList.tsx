import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { Space, SpaceMembershipRequest } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import SpacePendingRequestsItem from './SpacePendingRequestItem'

type SpacePendingRequestsProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpacePendingRequestsList: React.FC<SpacePendingRequestsProps> = ({ space }) => {
  const { t } = useTranslation()

  // local state created in order to keep the items in the list even after accepting/declining requests
  // (if we use the data from the context directly, a refetch will clear the accepted/declined users from the list)
  const [spaceMembershipRequests, setSpaceMembershipRequests] = useState<SpaceMembershipRequest[]>([])

  const { data } = usePaginationContext<SpaceMembershipRequest>()

  useEffect(() => {
    // only update the list if there are new requests (e.g. page changed)
    if (data.length > spaceMembershipRequests.length) {
      setSpaceMembershipRequests(data)
    }
  }, [data, spaceMembershipRequests.length])

  return (
    <ScrollView>
      <HoliHeading level="3" style={styles.heading}>
        {t('spaces.collaborators.pending.requests')}
      </HoliHeading>
      <View style={styles.list}>
        {!spaceMembershipRequests.length && (
          <HoliText style={styles.muted}>{t('spaces.collaborators.pending.requests.empty')}</HoliText>
        )}
        {!!spaceMembershipRequests.length &&
          spaceMembershipRequests.map((request) => (
            <SpacePendingRequestsItem membershipRequest={request} space={space} key={request.id} />
          ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  heading: {
    marginTop: 12,
  },
  list: {
    marginTop: 12,
  },
  muted: {
    color: colors.foreground20,
  },
})

export default SpacePendingRequestsList
