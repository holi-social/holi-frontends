import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { TouchableOpacity, View } from 'react-native'
import {
  BookmarkFill,
  CalendarEventFilled,
  HandHeartFilled,
  HeartsFilled,
  StarSmileFilled,
} from '@holi/icons/src/generated'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useTranslation } from 'react-i18next'
import { createInAppChallengesPath } from '@holi-apps/challenges/helpers/navigation'

const NavBarButton = ({ icon, onPress, label }: { icon: HoliIconType; onPress: () => void; label: string }) => {
  return (
    <TouchableOpacity aria-label={label} onPress={onPress}>
      <Stack
        elevation={200}
        borderRadius="lg"
        borderColor="muted"
        borderWidth="sm"
        backgroundColor="support"
        padding="xs"
        justifyContent="center"
        alignItems="center"
      >
        <HoliIcon icon={icon} size={24} />
      </Stack>
    </TouchableOpacity>
  )
}

export const ActNavBar = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  return (
    <View style={{ overflowX: 'auto' }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        gap="xs"
        margin={{ left: 'xs', right: 'xs', top: 'sm', bottom: 'md' }}
      >
        <NavBarButton
          icon={HeartsFilled}
          onPress={() => navigate('/volunteering')}
          label={t('act.nav.volunteering.title')}
        />
        <NavBarButton
          icon={CalendarEventFilled}
          onPress={() => navigate('/events')}
          label={t('act.nav.events.title')}
        />
        <NavBarButton
          icon={StarSmileFilled}
          onPress={() => navigate(createInAppChallengesPath())}
          label={t('act.nav.challenges.title')}
        />
        <NavBarButton
          icon={HandHeartFilled}
          onPress={() => navigate('/donations')}
          label={t('act.nav.donations.title')}
        />
        <NavBarButton
          icon={BookmarkFill}
          onPress={() => navigate('/profile/settings/favorites')}
          label={t('act.nav.favorites.title')}
        />
      </Stack>
    </View>
  )
}
