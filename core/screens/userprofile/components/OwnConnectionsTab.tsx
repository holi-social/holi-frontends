import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useCallback, useMemo, useState, useEffect } from 'react'

import EmptyTab from '@holi/core/components/EmptyTab'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type Connection, myConnectionsQuery, type MyConnectionsResponse } from '@holi/core/domain/shared/queries'
import { Avatar } from 'holi-bricks/components/avatar'
import { Text } from 'holi-bricks/components/text'
import { Platform, StyleSheet, View, type FlexAlignType } from 'react-native'
import { useTranslation } from 'react-i18next'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Chat3, Flag, User, UserUnfollow } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useChatInitialized } from '@holi/chat/src/client/chatState'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { chatServerName } from '@holi/core/helpers/config'
import { getOrCreatePrivateRoom } from '@holi/chat/src/store'
import { useUserConnection } from '@holi/core/helpers'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { ButtonIcon } from 'holi-bricks/components/button'
import { Stack } from 'holi-bricks/components/stack'
import { Image } from 'holi-bricks/components/image'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

export interface ConnectionsTabProps {
  emptyText: string
  emptyCallToAction?: string
}

const ConnectionsTab = ({ emptyText, emptyCallToAction }: ConnectionsTabProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { track } = useTracking()
  const { navigate } = useRouting()
  const { openToast } = useToast()
  const { disconnect } = useUserConnection()
  const { user: loggedInUser } = useLoggedInUser()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)

  const [selectedConnection, setSelectedConnection] = useState<Connection>()
  const { visible: connectionsModalVisible, show: connectionsModalShow, hide: connectionsModalHide } = useModalState()
  const {
    visible: revokeConfirmationVisible,
    show: revokeConfirmationShow,
    hide: revokeConfirmationHide,
  } = useModalState()
  const {
    visible: reportConfirmationVisible,
    show: reportConfirmationShow,
    hide: reportConfirmationHide,
  } = useModalState()

  const chatFeatureFlag = useFeatureFlagWithMaintenance(FeatureFlagKey.CHAT)
  const isChatInitialized = useChatInitialized()
  const identity = selectedConnection?.identity

  const { data, refetch } = useQuery<MyConnectionsResponse>(myConnectionsQuery, {
    variables: { offset: 0, limit: 100 },
    onError: (error) =>
      logError(error, 'Failed to load connections for user', { location: 'ConnectionsTab.myConnectionsQuery' }),
  })
  useOnRefresh(refetch)

  const [connections, setConnections] = useState<Connection[]>(data?.myConnections.data ?? [])

  useEffect(() => {
    if (data?.myConnections.data) {
      setConnections(data.myConnections.data)
    }
  }, [data])

  const animKey = !data ? 'loading' : data.myConnections.totalResults > 0 ? 'ready' : 'empty'

  const onSelectConnection = useCallback(
    (connection: Connection) => {
      setSelectedConnection(connection)
      connectionsModalShow()
    },
    [connectionsModalShow]
  )

  const revokeConnection = useCallback(() => {
    if (selectedConnection && loggedInUser) {
      disconnect(selectedConnection?.id || '')
      track(TrackingEvent.UserConnectionRevoked(loggedInUser.id, selectedConnection.id))
      setConnections((prevConnections) =>
        prevConnections.filter((connection) => connection.id !== selectedConnection.id)
      )
      connectionsModalHide()
      revokeConfirmationHide()
      openToast(t('user.profile.connections.confirmation.success'), HoliToastType.SUCCESS)
      setSelectedConnection(undefined)
    }
  }, [disconnect, selectedConnection, loggedInUser, track, openToast, connectionsModalHide, revokeConfirmationHide, t])

  const handleNavigation = useCallback(
    (id: string) => {
      connectionsModalHide()
      setTimeout(() => {
        navigate('/profile/' + id)
      })
    },
    [connectionsModalHide, navigate]
  )

  const handleChat = async () => {
    if (!identity) {
      logError(new HoliError('Can not create a chat without a user identity'), 'Failed to open chat', {
        location: 'StartChatButton.handleChat',
      })
      return
    }

    try {
      // TODO: the correct Matrix identity should come from Okuna
      const fullIdentity = '@' + identity + ':' + chatServerName
      const { room_id } = await getOrCreatePrivateRoom([fullIdentity])

      if (!room_id) {
        openToast(t('chat.room.error.noRoom'), HoliToastType.ERROR)
        return
      }
      connectionsModalHide()
      setSelectedConnection(undefined)
      navigate('/chat/rooms/' + room_id)
    } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
      openToast(t('chat.room.error.openRoom'), HoliToastType.ERROR)
    }
  }

  const handleReport = () => {
    connectionsModalHide()
    reportConfirmationHide()
    navigateWithAuth(`/report/${selectedConnection?.id}/${ContentType.USER}/${ContentType3K.USER}`)
    setSelectedConnection(undefined)
  }

  if (rewardsPhaseTwoEnabled) {
    return (
      <>
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
            <Stack padding={{ top: 'sm', bottom: 'sm' }}>
              <Stack padding={{ bottom: 'sm' }}>
                <Text size="xxl">32 connections</Text>
              </Stack>
              <Stack>
                {connections?.map((connection: Connection) => (
                  <Stack
                    key={connection.id}
                    onPress={() => onSelectConnection(connection)}
                    width="100%"
                    maxWidth="lg"
                    alignSelf="center"
                    direction="row"
                    alignItems="center"
                    gap="3xs"
                    padding={{ top: '3xs', bottom: '3xs' }}
                  >
                    <Avatar
                      imgPlaceholder={connection.avatarBlurhash}
                      source={connection.avatar}
                      label={connection.fullName}
                      initials={connection.avatarLabel}
                    />
                    <Stack direction="row" justifyContent="space-between" flex={1} alignItems="center">
                      <Text textAlign="center">{connection.fullName}</Text>
                      <ButtonIcon
                        icon={Chat3}
                        label="start chat with connection"
                        onPress={() => onSelectConnection(connection)}
                        variant="secondary"
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          )}

          {animKey === 'empty' && (
            <Stack
              backgroundColor="support"
              borderRadius="md"
              padding={{ top: 'lg', bottom: 'xl', left: 'md', right: 'md' }}
              borderColor="default"
              borderWidth="sm"
              gap="md"
              alignItems="center"
            >
              <Image
                source={require('@holi/ui/assets/img/illustrations/connections.svg')}
                alt={''}
                width={231}
                height={164}
                resizeMode="contain"
              />
              <Stack gap="3xs">
                <Text textAlign="center">{t('user.profile.own.connections.tagline.empty')}</Text>
                <Text size="xxl" textAlign="center">
                  {t('user.profile.own.connections.title.empty')}
                </Text>
              </Stack>
            </Stack>
          )}

          <HoliModal
            shown={connectionsModalVisible}
            label={selectedConnection?.fullName || ''}
            onDismiss={connectionsModalHide}
            style={styles.modal}
            headerStyle={styles.modalHeader}
          >
            <HoliContainer>
              <Avatar
                source={selectedConnection?.avatar}
                imgPlaceholder={selectedConnection?.avatarBlurhash}
                label={selectedConnection?.fullName || selectedConnection?.avatarLabel || ''}
                initials={selectedConnection?.avatarLabel || ''}
                size="lg"
              />
              <View style={styles.details}>
                <Text size="lg">{selectedConnection?.fullName}</Text>
                {selectedConnection?.pronouns ? (
                  <Text size="xs" colorOverride="grey">
                    ({selectedConnection.pronouns})
                  </Text>
                ) : null}
                <HoliGap size="sm" />
                <HoliDivider />
                <HoliGap size="m" />
                <HoliButton
                  contentStyle={styles.actionItem}
                  inline
                  transparent
                  label={t('spaces.collaborators.permissions.viewProfile')}
                  onPress={() => handleNavigation(selectedConnection?.id || '')}
                  testID={'connections-view-profile-btn'}
                >
                  <HoliIcon icon={User} colorOverride={styles.actionItemIcon.color} />
                  <HoliText style={styles.actionItemText}>{t('spaces.collaborators.permissions.viewProfile')}</HoliText>
                </HoliButton>
                {chatFeatureFlag.isOn && isChatInitialized && (
                  <HoliButton
                    contentStyle={styles.actionItem}
                    inline
                    transparent
                    label={t('chat.room.sendButton.label')}
                    onPress={handleChat}
                    testID={'connections-send-message-btn'}
                  >
                    <HoliIcon icon={Chat3} colorOverride={styles.actionItemIcon.color} />
                    <HoliText style={styles.actionItemText}>{t('chat.room.sendButton.label')}</HoliText>
                  </HoliButton>
                )}
                <HoliButton
                  contentStyle={styles.actionItem}
                  inline
                  transparent
                  label={t('user.profileView.connection.confirmation.title.CONNECTED')}
                  onPress={revokeConfirmationShow}
                  testID={'connections-revoke-connection-btn'}
                >
                  <HoliIcon icon={UserUnfollow} colorOverride={styles.actionItemIcon.color} />
                  <HoliText style={styles.actionItemText}>
                    {t('user.profileView.connection.confirmation.title.CONNECTED')}
                  </HoliText>
                </HoliButton>
                <HoliButton
                  contentStyle={styles.actionItem}
                  inline
                  transparent
                  label={t('spaces.invite.connections.report')}
                  onPress={reportConfirmationShow}
                  testID={'connections-report-user-btn'}
                >
                  <HoliIcon icon={Flag} colorOverride={styles.actionItemIcon.color} />
                  <HoliText style={styles.actionItemText}>{t('spaces.invite.connections.report')}</HoliText>
                </HoliButton>
              </View>

              <HoliConfirmation
                show={revokeConfirmationVisible}
                label={t('user.profile.connections.confirmation.title')}
                title={t('user.profile.connections.confirmation.title')}
                description={t('user.profile.connections.confirmation.description', {
                  name: selectedConnection?.fullName,
                })}
                primaryButtonVariant="danger"
                primaryText={t('user.profile.connections.confirmation.confirm')}
                secondaryText={t('user.profile.connections.confirmation.dismiss')}
                onPrimary={revokeConnection}
                onDismiss={revokeConfirmationHide}
                testID="connections-revoke-user-confirmation"
              />

              <HoliConfirmation
                show={reportConfirmationVisible}
                label={t('user.profileView.report.confirmation.title', { name: selectedConnection?.fullName })}
                title={t('user.profileView.report.confirmation.title', { name: selectedConnection?.fullName })}
                description={t('user.profileView.report.confirmation.description', {
                  name: selectedConnection?.fullName || t('user.profileView.anonymous'),
                })}
                onPrimary={handleReport}
                onDismiss={reportConfirmationHide}
                testID="connections-report-user-confirmation"
              />
            </HoliContainer>
          </HoliModal>
        </HoliTransition.FadeSwitch>
      </>
    )
  }

  // to be deleted when rewards phase 2 is fully rolled out
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
              onPress={() => onSelectConnection(connection)}
            >
              <HoliBox
                key={connection.id}
                padding={[0, 0, Spacing.xs, 0]}
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

      <HoliModal
        shown={connectionsModalVisible}
        label={selectedConnection?.fullName || ''}
        onDismiss={connectionsModalHide}
        style={styles.modal}
        headerStyle={styles.modalHeader}
      >
        <HoliContainer>
          <Avatar
            source={selectedConnection?.avatar}
            imgPlaceholder={selectedConnection?.avatarBlurhash}
            label={selectedConnection?.fullName || selectedConnection?.avatarLabel || ''}
            initials={selectedConnection?.avatarLabel || ''}
            size="lg"
          />
          <View style={styles.details}>
            <Text size="lg">{selectedConnection?.fullName}</Text>
            {selectedConnection?.pronouns ? (
              <Text size="xs" colorOverride="grey">
                ({selectedConnection.pronouns})
              </Text>
            ) : null}
            <HoliGap size="sm" />
            <HoliDivider />
            <HoliGap size="m" />
            <HoliButton
              contentStyle={styles.actionItem}
              inline
              transparent
              label={t('spaces.collaborators.permissions.viewProfile')}
              onPress={() => handleNavigation(selectedConnection?.id || '')}
              testID={'connections-view-profile-btn'}
            >
              <HoliIcon icon={User} colorOverride={styles.actionItemIcon.color} />
              <HoliText style={styles.actionItemText}>{t('spaces.collaborators.permissions.viewProfile')}</HoliText>
            </HoliButton>
            {chatFeatureFlag.isOn && isChatInitialized && (
              <HoliButton
                contentStyle={styles.actionItem}
                inline
                transparent
                label={t('chat.room.sendButton.label')}
                onPress={handleChat}
                testID={'connections-send-message-btn'}
              >
                <HoliIcon icon={Chat3} colorOverride={styles.actionItemIcon.color} />
                <HoliText style={styles.actionItemText}>{t('chat.room.sendButton.label')}</HoliText>
              </HoliButton>
            )}
            <HoliButton
              contentStyle={styles.actionItem}
              inline
              transparent
              label={t('user.profileView.connection.confirmation.title.CONNECTED')}
              onPress={revokeConfirmationShow}
              testID={'connections-revoke-connection-btn'}
            >
              <HoliIcon icon={UserUnfollow} colorOverride={styles.actionItemIcon.color} />
              <HoliText style={styles.actionItemText}>
                {t('user.profileView.connection.confirmation.title.CONNECTED')}
              </HoliText>
            </HoliButton>
            <HoliButton
              contentStyle={styles.actionItem}
              inline
              transparent
              label={t('spaces.invite.connections.report')}
              onPress={reportConfirmationShow}
              testID={'connections-report-user-btn'}
            >
              <HoliIcon icon={Flag} colorOverride={styles.actionItemIcon.color} />
              <HoliText style={styles.actionItemText}>{t('spaces.invite.connections.report')}</HoliText>
            </HoliButton>
          </View>

          <HoliConfirmation
            show={revokeConfirmationVisible}
            label={t('user.profile.connections.confirmation.title')}
            title={t('user.profile.connections.confirmation.title')}
            description={t('user.profile.connections.confirmation.description', { name: selectedConnection?.fullName })}
            primaryButtonVariant="danger"
            primaryText={t('user.profile.connections.confirmation.confirm')}
            secondaryText={t('user.profile.connections.confirmation.dismiss')}
            onPrimary={revokeConnection}
            onDismiss={revokeConfirmationHide}
            testID="connections-revoke-user-confirmation"
          />

          <HoliConfirmation
            show={reportConfirmationVisible}
            label={t('user.profileView.report.confirmation.title', { name: selectedConnection?.fullName })}
            title={t('user.profileView.report.confirmation.title', { name: selectedConnection?.fullName })}
            description={t('user.profileView.report.confirmation.description', {
              name: selectedConnection?.fullName || t('user.profileView.anonymous'),
            })}
            onPrimary={handleReport}
            onDismiss={reportConfirmationHide}
            testID="connections-report-user-confirmation"
          />
        </HoliContainer>
      </HoliModal>
    </HoliTransition.FadeSwitch>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as FlexAlignType,
      gap: Spacing['xs'],
    },
    modal: {
      paddingBottom: Spacing['lg'],
    },
    modalHeader: {
      paddingBottom: Platform.OS === 'ios' ? 0 : Spacing['xs'],
    },
    details: {
      marginTop: Spacing['xs'],
    },
    actionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    actionItemText: {
      color: theme.colors.foreground30,
      paddingLeft: 10,
    },
    actionItemIcon: {
      color: theme.colors.foreground30,
    },
  })

export default withProfiler(ConnectionsTab, { name: 'ConnectionsTab' })
