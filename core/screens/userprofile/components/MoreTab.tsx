import React from 'react'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { AccountCircle, ArrowRight, BookmarkLine, Comment, Parent, Spaces } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useTranslation } from 'react-i18next'

export const MoreTab = () => {
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const subpages = [
    { name: 'favorites', icon: BookmarkLine, url: '/profile/settings/favorites' },
    { name: 'profile', icon: AccountCircle, url: '/profile/settings/aboutMe' },
    { name: 'posts', icon: Comment, url: '/profile/settings/posts' },
    { name: 'spaces', icon: Spaces, url: '/profile/settings/spaces' },
    { name: 'connections', icon: Parent, url: '/profile/settings/connections' },
  ]

  return (
    <Stack padding={{ top: '4xs', bottom: '4xs' }} backgroundColor="support" margin={{ top: 'xs' }} borderRadius={'md'}>
      {subpages.map((subpage, index) => (
        <Stack
          key={subpage.name}
          direction="row"
          padding={{ top: 'xxs', bottom: 'xxs', left: 'xs', right: 'xs' }}
          borderColor="support"
          borderStyle="solid"
          borderWidth={index != 0 ? { top: 'sm' } : {}}
          justifyContent="space-between"
          onPress={() => navigate(`${subpage.url}`)}
        >
          <Stack direction="row" gap="xxs">
            <HoliIcon icon={subpage.icon} color="main" />
            <Stack justifyContent="center">
              <Text textAlign="center">{t(`profile.tabs.more.link.${subpage.name}`)}</Text>
            </Stack>
          </Stack>
          <HoliIcon icon={ArrowRight} />
        </Stack>
      ))}
    </Stack>
  )
}
