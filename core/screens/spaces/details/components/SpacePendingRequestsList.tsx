import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import SpacePendingRequestsItem from '@holi/core/screens/spaces/details/components/SpacePendingRequestItem'
import { Space, SpaceMembershipRequest } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowDownS, ArrowUpS } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpacePendingRequestsProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpacePendingRequestsList: React.FC<SpacePendingRequestsProps> = ({ space }) => {
  const [listVisible, setListVisible] = useState(true)
  const { t } = useTranslation()

  // local state created in order to keep the items in the list even after accepting/declining requests
  // (if we use the data from the context directly, a refetch will clear the accepted/declined users from the list)
  const [spaceMembershipRequests, setSpaceMembershipRequests] = useState<SpaceMembershipRequest[]>([])

  const { data } = usePaginationContext<SpaceMembershipRequest>()

  const mixins = useStyleMixins()

  useEffect(() => {
    // only update the list if there are new requests (e.g. page changed)
    if (data.length > spaceMembershipRequests.length) {
      setSpaceMembershipRequests(data)
    }
  }, [data, spaceMembershipRequests.length])

  return (
    <ScrollView>
      {!!spaceMembershipRequests.length && (
        <HoliButton
          inline
          transparent
          contentStyle={styles.headerButton}
          label={t('spaces.collaborators.pending.requests')}
          onPress={() => setListVisible((visible) => !visible)}
        >
          <HoliHeading level="3" style={styles.heading}>
            {t('spaces.collaborators.pending.requests')}
          </HoliHeading>
          <HoliIcon icon={listVisible ? ArrowDownS : ArrowUpS} />
        </HoliButton>
      )}
      {!spaceMembershipRequests.length && (
        <View style={[mixins.container, styles.emptyContainer]}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_space_manage_collaborators_empty.svg')}
            width={250}
            height={180}
            label={t('spaces.collaborators.pending.requests.empty.title')}
            isSvg={true}
            resizeMode="contain"
          />
          <HoliText size={'small'} style={styles.emptyTitle}>
            {t('spaces.collaborators.pending.requests.empty.title')}
          </HoliText>
          <HoliText size={'large'} style={styles.emptyDescription}>
            {t('spaces.collaborators.pending.requests.empty.description')}
          </HoliText>
        </View>
      )}
      {!!spaceMembershipRequests.length && (
        <View style={[styles.list, !listVisible && styles.hideList]}>
          {spaceMembershipRequests.map((request) => (
            <SpacePendingRequestsItem membershipRequest={request} space={space} key={request.id} />
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  headerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  emptyContainer: {
    padding: 24,
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background10,
  },
  emptyTitle: {
    marginTop: 24,
    textAlign: 'center',
  },
  emptyDescription: {
    marginTop: 8,
    textAlign: 'center',
  },
  heading: {
    marginTop: 8,
  },
  list: {
    marginTop: 12,
  },
  hideList: {
    display: 'none', // display none instead of conditional rendering in order to keep the state of the list items
  },
})

export default SpacePendingRequestsList
