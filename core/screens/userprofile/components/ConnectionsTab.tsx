import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useCallback } from 'react'

import EmptyTab from '@holi/core/components/EmptyTab'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import {
  type Connection,
  connectionsByUserIdQuery,
  type connectionsByUserIdResponse,
} from '@holi/core/domain/shared/queries'
import { Avatar } from 'holi-bricks/components/avatar'
import { Text } from 'holi-bricks/components/text'
import { StyleSheet, View, type FlexAlignType } from 'react-native'
import { useTranslation } from 'react-i18next'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export interface ConnectionsTabProps {
  userId: string
  emptyText: string
  emptyCallToAction?: string
}

const ConnectionsTab = ({ userId, emptyText, emptyCallToAction }: ConnectionsTabProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const { data, refetch } = useQuery<connectionsByUserIdResponse>(connectionsByUserIdQuery, {
    variables: { userId, offset: 0, limit: 10 },
    skip: !userId,
    onError: (error) =>
      logError(error, `Failed to load connections for user ${userId}`, {
        location: 'ConnectionsTab.connectionsByUserIdQuery',
      }),
  })
  useOnRefresh(refetch)

  const connections = data?.connectionsByUserId.data ?? []
  const animKey = !data ? 'loading' : data.connectionsByUserId.totalResults > 0 ? 'ready' : 'empty'

  const handleNavigation = useCallback(
    (id: string) => {
      setTimeout(() => {
        navigate('/profile/' + id)
      })
    },
    [navigate]
  )

  return (
    <HoliTransition.FadeSwitch animKey={animKey}>
      {animKey === 'loading' && (
        <HoliBox padding={[Spacing.xs, 0]}>
          {Array.from({ length: 10 }, (_, index) => index).map((index) => (
            <HoliBox
              key={index}
              padding={[0, 0, 32, 0]}
              layout={{ maxWidth: dimensions.maxScreenWidth, width: '100%', alignSelf: 'center' }}
            >
              <HoliBlockItem loading testID="space-tab-loading" />
            </HoliBox>
          ))}
        </HoliBox>
      )}

      {animKey === 'ready' && (
        <HoliBox padding={[Spacing.xs, 0]}>
          {connections?.map((connection: Connection) => (
            <HoliButton
              transparent
              inline
              label={t('insights.curatorModal.profileLink')}
              key={connection.id}
              onPress={() => handleNavigation(connection.id)}
            >
              <HoliBox
                key={connection.id}
                padding={[0, 0, dimensions.spacingS, 0]}
                layout={{
                  maxWidth: dimensions.maxScreenWidth,
                  width: '100%',
                  alignSelf: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={styles.row}>
                  <Avatar
                    imgPlaceholder={connection.avatarBlurhash}
                    source={connection.avatar}
                    label={connection.fullName}
                    initials={connection.avatarLabel}
                  />
                  <Text size="sm">{connection.fullName}</Text>
                </View>
              </HoliBox>
            </HoliButton>
          ))}
        </HoliBox>
      )}

      {animKey === 'empty' && <EmptyTab text={emptyText} callToAction={emptyCallToAction} />}
    </HoliTransition.FadeSwitch>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as FlexAlignType,
    gap: Spacing['xs'],
  },
})

export default withProfiler(ConnectionsTab, { name: 'ConnectionsTab' })
