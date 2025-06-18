import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import NotificationBanner from '@holi/core/screens/notifications/components/NotificationBanner'
import SpacePendingRequestsItem from '@holi/core/screens/spaces/details/components/SpacePendingRequestItem'
import { useSpaceMembershipStatus } from '@holi/core/screens/spaces/hooks/useSpaceMembershipStatus'
import type { Space, SpaceMember, SpaceMembershipRequest } from '@holi/api/graphql/graphql-codegen'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpacePendingRequestsProps = {
  space: Pick<Space, 'id' | 'name'>
  style?: StyleProp<ViewStyle>
  initiallySelectedUserId?: string
  spaceMembers?: Pick<SpaceMember, 'id' | 'user'>[]
}

const SpacePendingRequestsList: React.FC<SpacePendingRequestsProps> = ({
  space,
  initiallySelectedUserId,
  spaceMembers,
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  // local state created in order to keep the items in the list even after accepting/declining requests
  // (if we use the data from the context directly, a refetch will clear the accepted/declined users from the list)
  const [spaceMembershipRequests, setSpaceMembershipRequests] = useState<SpaceMembershipRequest[]>([])
  const { data } = usePaginationContext<SpaceMembershipRequest>()
  const { user, showBanner, status, loading } = useSpaceMembershipStatus(initiallySelectedUserId || '', spaceMembers)

  const mixins = useStyleMixins()

  useEffect(() => {
    setSpaceMembershipRequests(data as SpaceMembershipRequest[])
  }, [data])

  return (
    <View>
      {initiallySelectedUserId && showBanner && !loading ? (
        <NotificationBanner
          spaceName={space.name}
          status={status as 'accepted' | 'cancelled' | 'deleted'}
          showBanner={showBanner}
          style={{ marginBottom: 12 }}
          member={user}
        />
      ) : null}
      {!spaceMembershipRequests.length && (
        <View style={[mixins.container, styles.emptyContainer]}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_space_manage_collaborators_empty.svg')}
            width={250}
            height={180}
            label={t('spaces.collaborators.pending.generic.empty.title')}
            isSvg={true}
            resizeMode="contain"
          />
          <HoliText size={'small'} style={styles.emptyTitle}>
            {t('spaces.collaborators.pending.generic.empty.title')}
          </HoliText>
          <HoliText size={'large'} style={styles.emptyDescription}>
            {t('spaces.collaborators.pending.generic.empty.description')}
          </HoliText>
        </View>
      )}
      {!!spaceMembershipRequests.length &&
        spaceMembershipRequests.map((request) => (
          <SpacePendingRequestsItem
            membershipRequest={request}
            space={space}
            key={request.id}
            initiallyOpen={request.user.id === initiallySelectedUserId}
          />
        ))}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    emptyContainer: {
      padding: 24,
      marginTop: 8,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background10,
    },
    emptyTitle: {
      marginTop: 24,
      textAlign: 'center',
    },
    emptyDescription: {
      marginTop: 8,
      textAlign: 'center',
    },
  })

export default SpacePendingRequestsList
