import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import SpaceInviteItem from '@holi/core/screens/spaces/details/components/SpaceInviteItem'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import type { Space, SpaceInvite } from '@holi/api/graphql/graphql-codegen'

type SpaceInvitesProps = {
  space: Pick<Space, 'id' | 'name'>
  style?: StyleProp<ViewStyle>
}

const SpaceInvitesList: React.FC<SpaceInvitesProps> = ({ space, style }) => {
  const { t } = useTranslation()

  // local state created in order to keep the items in the list even after taking an action
  // (if we use the data from the context directly, a refetch will clear the withdrawn users from the list)
  const [spaceInvites, setSpaceInvites] = useState<SpaceInvite[]>([])

  const { data } = usePaginationContext<SpaceInvite>()

  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  useEffect(() => {
    setSpaceInvites(data as SpaceInvite[])
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
        spaceInvites.map((invite) => (
          <SpaceInviteItem invitedUser={invite.invitedUser} space={space} key={invite.id} />
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

export default SpaceInvitesList
