import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import SpaceInviteItem from '@holi/core/screens/spaces/details/components/SpaceInviteItem'
import { Space, SpaceInvite } from '@holi/core/screens/spaces/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type SpaceInvitesProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceInvitesList: React.FC<SpaceInvitesProps> = ({ space, style }) => {
  const { t } = useTranslation()

  // local state created in order to keep the items in the list even after accepting/declining requests
  // (if we use the data from the context directly, a refetch will clear the accepted/declined users from the list)
  const [spaceInvites, setSpaceInvites] = useState<SpaceInvite[]>([])

  const { data } = usePaginationContext<SpaceInvite>()

  const mixins = useStyleMixins()

  useEffect(() => {
    setSpaceInvites(data)
  }, [data])

  return (
    <View style={style}>
      {/* TODO: Include pending email invites on top (non-user invites) */}
      {!spaceInvites.length && (
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
      {!!spaceInvites.length &&
        spaceInvites.map((invite) => <SpaceInviteItem invite={invite} space={space} key={invite.id} />)}
    </View>
  )
}

const styles = StyleSheet.create({
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
})

export default SpaceInvitesList
