import { useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import { ChipAction, ChipLabel } from 'holi-bricks/components/chips'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import InsightsTab from '@holi/core/components/InsightsTab'
import SpacesTab from '@holi/core/components/SpacesTab'
import type { User } from '@holi/core/domain/shared/types'
import { logError } from '@holi/core/errors/helpers'
import type { InsightsByUserIdResponse } from '@holi/core/queries'
import { insightsByUserIdTotalResultsQuery } from '@holi/core/queries'
import MyPostsTab from '@holi/core/screens/individualPosts/components/MyPostsTab'
import UserProfileView from '@holi/core/screens/userprofile/components/UserProfileView'
import { Add, Information } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'
import ProfileCompletionCard from '@holi/core/screens/userprofile/components/ProfileCompletionCard'
import OwnConnectionsTab from '@holi/core/screens/userprofile/components/OwnConnectionsTab'
import { UserTermsRow } from '@holi/core/screens/userprofile/components/UserTermsRow'
import { UserChipTypes } from '@holi/core/screens/userprofile/types'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { CheckmarkGreen, ProgressIndicator1Of3, ProgressIndicator2Of3 } from '@holi/icons/src/generated'
import type { ChipLabelProps } from 'holi-bricks/components/chips/ChipLabel'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'

export type EditModeState = 'profile' | 'engagementLevel' | 'interests' | 'skills'

export enum Tab {
  MY_VOLUNTEERING = 'myVolunteering',
  PROFILE = 'profile',
  POSTS = 'posts',
  INSIGHTS = 'insights',
  SPACES = 'spaces',
  CONNECTIONS = 'connections',
}

interface OwnUserProfileProps {
  user: User
  toggleEditMode: (editModeState: EditModeState) => void
  activeTab: string
  onTabChange: (tabKey: string) => void
}

// TODO --- MY_VOLUNTEER: remove seed data and use the real data from the BE
const seedData = [
  {
    __typename: 'Typesense_Document',
    type: 'task',
    id: '1',
    location: '',
    location_lat_lng: null,
    image_url: '',
    user_full_name: null,
    link_locators: {
      __typename: 'Typesense_DocumentLinkLocators',
      volunteering: null,
      space: 'new-space',
      task: '490531f6-63f1-4e21-93d7-dda96e0b5714',
      profile: null,
    },
    topics_v2: ['democracy-politics', 'animal-welfare', 'food-hunger-relief', 'literacy-education'],
    skills_v2: [],
    source: null,
    organizer_name: 'New space',
    organizer_image_url: '',
    external_url: null,
    commitment_label: 'one-time',
    commitment_duration: null,
    location_type: 'remote',
    title: 'Task 1',
    description: 'Test Test Test',
    favoriteId: '50dea709-79c5-49bd-ab08-bc563ad2c1db',
  },
  {
    __typename: 'Typesense_Document',
    type: 'task',
    id: '2',
    location: '',
    location_lat_lng: null,
    image_url: '',
    user_full_name: null,
    link_locators: {
      __typename: 'Typesense_DocumentLinkLocators',
      volunteering: null,
      space: 'new-space',
      task: '490531f6-63f1-4e21-93d7-dda96e0b5714',
      profile: null,
    },
    topics_v2: ['democracy-politics', 'animal-welfare', 'food-hunger-relief', 'literacy-education'],
    skills_v2: [],
    source: null,
    organizer_name: 'New space',
    organizer_image_url: '',
    external_url: null,
    commitment_label: 'one-time',
    commitment_duration: null,
    location_type: 'remote',
    title: 'Task 2',
    description: 'Test Test Test',
    favoriteId: '50dea709-79c5-49bd-ab08-bc563ad2c1db',
  },
  {
    __typename: 'Typesense_Document',
    type: 'task',
    id: '3',
    location: '',
    location_lat_lng: null,
    image_url: '',
    user_full_name: null,
    link_locators: {
      __typename: 'Typesense_DocumentLinkLocators',
      volunteering: null,
      space: 'new-space',
      task: '490531f6-63f1-4e21-93d7-dda96e0b5714',
      profile: null,
    },
    topics_v2: ['democracy-politics', 'animal-welfare', 'food-hunger-relief', 'literacy-education'],
    skills_v2: [],
    source: null,
    organizer_name: 'New space',
    organizer_image_url: '',
    external_url: null,
    commitment_label: 'one-time',
    commitment_duration: null,
    location_type: 'remote',
    title: 'Task 3',
    description: 'Test Test Test',
    favoriteId: '50dea709-79c5-49bd-ab08-bc563ad2c1db',
  },
]

const statuses: { description: string; chip: ChipLabelProps }[] = [
  {
    description: 'You showed interest - awesome! Now it`s your turn to reach out to the organization and get started.',
    chip: {
      color: 'blue',
      size: 'md',
      iconLeading: ProgressIndicator1Of3,
      children: 'Planned',
    },
  },
  {
    description: 'You`ve reached out and now you`re waiting to hear back. Fingers crossed!',
    chip: {
      color: 'yellow',
      size: 'md',
      iconLeading: ProgressIndicator2Of3,
      children: 'Connected',
    },
  },
  {
    description: 'It`s official: You`re on it! Everything`s set — and your first good deed has been counted.',
    chip: {
      color: 'green',
      size: 'md',
      iconLeading: CheckmarkGreen,
      children: 'Helping',
    },
  },
]

const OwnUserProfile = ({ user, toggleEditMode, activeTab, onTabChange }: PropsWithChildren<OwnUserProfileProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const { styles } = useStyles(stylesheet)

  const { show, hide, props: modalProps } = useModalState()

  const { data: dataInsights } = useQuery<InsightsByUserIdResponse>(insightsByUserIdTotalResultsQuery, {
    variables: { userId: user.id },
    errorPolicy: 'ignore',
    skip: !user?.id,
    onError: (error) => {
      logError(error, 'Failed to load insights for user', {
        location: 'OwnUserProfile.insightsByUserIdTotalResultsQuery',
      })
    },
  })

  const totalInsights = dataInsights?.insightsByUserId?.totalResults ?? 0
  const hasInsights = totalInsights > 0

  const tabs = [
    {
      key: Tab.MY_VOLUNTEERING,
      tabTitle: 'My Volunteering', // TODO --- MY_VOLUNTEER: add translation key from Localizy/Figma
      content: () => (
        <View style={styles.profileContainer}>
          <Stack>
            <Stack alignItems="flex-end">
              <TextLink size="sm" onPress={show} color="purpleDark">
                <Stack direction="row" alignItems="center" gap="4xs">
                  <Text size="lg" color="purpleDark">
                    {/* TODO --- MY_VOLUNTEER: add translation key from Localizy/Figma */}
                    What to the statuses mean?
                  </Text>
                  <HoliIcon icon={Information} colorOverride="purpleDark" />
                </Stack>
              </TextLink>

              <HoliModal label={'What to the statuses mean?'} {...modalProps}>
                <HoliModalContentWrapper actionButtonText={t('modal.close')} onActionButtonPress={hide}>
                  <Stack gap="md" padding={{ bottom: 'md', left: 'md', right: 'md' }}>
                    <Stack gap="3xs">
                      {/* TODO --- MY_VOLUNTEER: add translation key from Localizy/Figma */}
                      <Text size="3xl">What do the statuses mean?</Text>
                      <Text size="md">
                        Wondering what those statuses are all about? Here’s your quick guide – so you always know where
                        you’re at!
                      </Text>
                    </Stack>

                    <Stack gap="xs">
                      {statuses.map(({ description, chip }) => (
                        <Stack key={description} gap="4xs">
                          <ChipLabel {...chip} />
                          <Text size="md">{description}</Text>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </HoliModalContentWrapper>
              </HoliModal>
            </Stack>

            <Stack gap="xxs" padding={{ top: 'xxs' }}>
              {seedData.map((item) => (
                // TODO --- MY_VOLUNTEER: extend the VolunteeringRecoCard or create a new card component to support the new statuses
                <VolunteeringRecoCard
                  engagement={item as unknown as LocalizedTypesenseDocument & { favoriteId: string }}
                  index={0}
                  key={item.id}
                />
              ))}
            </Stack>
          </Stack>
        </View>
      ),
    },
    {
      key: Tab.PROFILE,
      tabTitle: t('profile.tabs.profile'),
      content: () => (
        <View style={styles.profileContainer}>
          <View style={styles.chipRowContainer} key="engagementLevel">
            <HoliText size="small">{t('profile.engagementLevel')}</HoliText>
            {user?.engagementLevel ? (
              <ChipLabel color="white">{t(`user.engagementLevel.title.${user.engagementLevel}`)}</ChipLabel>
            ) : (
              <ChipAction
                id="engagementLevel"
                color="white"
                onPress={() => toggleEditMode('engagementLevel')}
                iconTrailing={Add}
                aria-label={t('profile.engagementLevel.add')}
              />
            )}
          </View>
          <View style={styles.chipRowContainer} key={UserChipTypes.INTERESTS}>
            <UserTermsRow termType="topic" onPressEdit={() => toggleEditMode(UserChipTypes.INTERESTS)} />
          </View>
          <View style={styles.chipRowContainer} key={UserChipTypes.SKILLS}>
            <UserTermsRow termType="skill" onPressEdit={() => toggleEditMode(UserChipTypes.SKILLS)} />
          </View>
        </View>
      ),
    },
    {
      key: Tab.POSTS,
      tabTitle: t('individuals.post.name'),
      content: () => <MyPostsTab />,
    },

    {
      key: Tab.SPACES,
      tabTitle: t('profile.tabs.spaces'),
      content: () => (
        <SpacesTab
          emptyText={t('profile.tabs.spaces.empty')}
          emptyCallToAction={t('profile.tabs.spaces.empty.callToAction')}
          memberId={user.id}
        />
      ),
    },
    {
      key: Tab.CONNECTIONS,
      tabTitle: t('profile.tabs.connections'),
      content: () => <OwnConnectionsTab emptyText={t('user.profile.own.connections.title.empty')} />,
    },
  ]

  if (hasInsights) {
    tabs.splice(1, 0, {
      key: Tab.INSIGHTS,
      tabTitle: t('profile.tabs.insight'),
      content: () => <InsightsTab userId={user.id} />,
    })
  }

  return (
    <>
      <View style={{ backgroundColor: colors.background10 }}>
        <HoliContainer>
          <UserProfileView user={user} showContactFeatures={false} />
          <ProfileCompletionCard
            onPressEdit={() => toggleEditMode('profile')}
            style={styles.profileCard}
            page="profile"
          />
        </HoliContainer>
      </View>
      <HoliTabs
        activeTab={activeTab}
        onChange={onTabChange}
        data={tabs}
        keyExtractor={(item) => item.key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={colors.background20}
        testID="profile-tabs"
      />
    </>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  container: {
    alignItems: 'baseline',
  },
  chipRowContainer: {
    gap: Spacing['3xs'],
  },
  chipFont: {
    color: theme.colors.fill.default,
  },
  profileContainer: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  profileCard: {
    marginVertical: Spacing.xs,
  },
  volunteeringStatusInfo: {
    color: theme.colors.decorative.purpleDark,
  },
}))

export default withProfiler(OwnUserProfile, { name: 'OwnUserProfile' })
