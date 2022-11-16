import { useQuery } from '@apollo/client'
import React, { memo, useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import OwnProfileView, { EditModeState } from '@holi/core/screens/userprofile/components/OwnProfileView'
import UserChipForm from '@holi/core/screens/userprofile/components/UserChipForm'
import UserEngagementLevelForm from '@holi/core/screens/userprofile/components/UserEngagementLevelForm'
import UserProfileForm from '@holi/core/screens/userprofile/components/UserProfileForm'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import {
  SdgsQueryResult,
  SkillsQueryResult,
  TopicsQueryResult,
  sdgsQuery,
  skillsQuery,
  topicsQuery,
} from './queries.ts'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const OwnProfile: React.VFC<ScreenProps> = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState<EditModeState>()
  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])
  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const { isLoggedIn } = useContext(AuthContext)
  const { user } = useContext(UserContext)

  const { loading: topicsLoading, data: topicsData, error: topicsError } = useQuery<TopicsQueryResult>(topicsQuery)
  const { loading: skillsLoading, data: skillsData, error: skillsError } = useQuery<SkillsQueryResult>(skillsQuery)
  const { loading: sdgsLoading, data: sdgsData, error: sdgsError } = useQuery<SdgsQueryResult>(sdgsQuery)
  const loading = topicsLoading || skillsLoading || sdgsLoading
  const error = topicsError || skillsError || sdgsError

  const mixins = useStyleMixins()

  const profileTitle = isLoggedIn && user && user.firstName ? '' : t('profile.title')
  useNavigationHeader(navigation, {
    headerLeft: () => <BackButton />,
    title: profileTitle,
    headerRight: () =>
      isLoggedIn && (
        <HoliButton inline transparent label={t('profile.edit')} onPress={editProfile} style={styles.headerEditButton}>
          <HoliText size="small" bold style={{ color: colors.fontColorGrey }}>
            {t('profile.edit')}
          </HoliText>
        </HoliButton>
      ),
  })

  const toggleEditMode = useCallback((editMode: EditModeState) => {
    setEditMode(editMode)
    setShowModal(true)
  }, [])
  const editProfile = useCallback(() => {
    toggleEditMode('profile')
  }, [toggleEditMode])

  const autoHeightFor: Record<EditModeState, boolean> = {
    profile: true,
    engagementLevel: false,
    interests: false,
    skills: false,
    sdgs: false,
  }

  // TODO sort sdgs, skills and interests (as it was before)
  // TODO style loading and error states
  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        {loading && <HoliText>Loading...</HoliText>}
        {error && <HoliText>Error loading data</HoliText>}
        {!loading && user ? (
          <>
            <HoliModal
              show={showModal}
              onDismiss={closeModal}
              testID="user-profile-modal"
              label={t(`profile.${editMode}.edit`)}
              autoHeight={autoHeightFor[editMode]}
              // Smaller devides use the whole screen and
              // larger ones should have more space above for clicking the backdrop pane
              minRelativeHeight={!autoHeightFor[editMode] && deviceHeight > 750 ? 0.85 : 0}
            >
              {editMode === 'profile' && <UserProfileForm user={user} onCancel={closeModal} onSubmit={closeModal} />}
              {editMode === 'engagementLevel' && (
                <UserEngagementLevelForm user={user} onCancel={closeModal} onSubmit={closeModal} autoHeight={false} />
              )}
              {editMode === 'interests' && (
                <UserChipForm
                  user={user}
                  onCancel={closeModal}
                  onSubmit={closeModal}
                  keyInUserObject={'interests'}
                  availableTerms={topicsData.topics}
                  autoHeight={autoHeightFor[editMode]}
                />
              )}
              {editMode === 'skills' && (
                <UserChipForm
                  user={user}
                  onCancel={closeModal}
                  onSubmit={closeModal}
                  keyInUserObject={'skills'}
                  availableTerms={skillsData.skills}
                  autoHeight={autoHeightFor[editMode]}
                />
              )}
              {editMode === 'sdgs' && (
                <UserChipForm
                  user={user}
                  onCancel={closeModal}
                  onSubmit={closeModal}
                  keyInUserObject={'sdgs'}
                  availableTerms={sdgsData.sdgs}
                  autoHeight={autoHeightFor[editMode]}
                />
              )}
            </HoliModal>
            <OwnProfileView toggleEditMode={toggleEditMode} user={user} />
          </>
        ) : (
          <View style={[mixins.container, styles.container]}>
            <HoliText>{t('user.profileView.noUser')}</HoliText>
          </View>
        )}
      </LoginProtection>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'baseline',
  },
  headerEditButton: {
    marginLeft: 24,
    marginRight: Platform.OS === 'web' ? 24 : 0,
  },
})

export default memo(OwnProfile)
