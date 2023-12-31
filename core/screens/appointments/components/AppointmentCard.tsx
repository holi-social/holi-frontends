import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useDeleteAppointment from '@holi/core/hooks/spaces/useDeleteAppointment'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Space } from '@holi/core/screens/spaces/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete, Edit2, GlobeFilled, LockFilled, More, Time } from '@holi/icons/src/generated'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { localizeDate } from '@holi/ui/helper/date'
import { colors } from '@holi/ui/styles/globalVars'

import { INVITE_ONLY_TYPE } from './AppointmentInputForm'

type AppointmentCardProps = {
  appointment: Appointment
  space: Space
  isAdmin?: boolean
  showFullView?: boolean
}

const IMAGE_ASPECT_RATIO = 327 / 210

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  space,
  isAdmin,
  showFullView = true,
}: AppointmentCardProps) => {
  const { t, i18n } = useTranslation()
  const { navigate } = useRouting()
  const { userId } = useAuth()
  const [imageError, setImageError] = useState(false)
  const [isLoadingDeleteAppointment, deleteAppointment] = useDeleteAppointment({
    id: appointment.id,
    spaceId: space.id,
    successMsg: t('appointment.delete.success'),
  })

  const currentLanguage = (i18n.language || '').split('-')[0]
  const date = localizeDate(new Date(appointment.startDateTime), currentLanguage, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })

  const startTime = localizeDate(
    new Date(appointment.startDateTime),
    currentLanguage,
    {
      hour: 'numeric',
      minute: '2-digit',
    },
    true
  )

  const endTime = localizeDate(
    new Date(appointment.endDateTime),
    currentLanguage,
    {
      hour: 'numeric',
      minute: '2-digit',
    },
    true
  )

  const goToDetailView = () => navigate(`/spaces/${space.name}/appointments/${appointment.id}`)
  const isAppointmentCreator = appointment?.creator.id === userId

  return (
    <View key={appointment.id} style={styles.appointmentItem} testID="space-appointment-tile">
      <View style={styles.imageContainer}>
        {!imageError && !!appointment.thumbnail && (
          <HoliButton
            transparent
            label={appointment.title}
            onPress={goToDetailView}
            disabled={showFullView}
            style={styles.clickOverlay}
          >
            <HoliImage
              label={t('spaces.appointments.thumbnail.label')}
              source={{ uri: appointment.thumbnail }}
              style={showFullView ? styles.imageShowFullView : styles.image}
              onError={() => setImageError(true)}
              {...(appointment.thumbnailBlurhash ? { blurhash: appointment.thumbnailBlurhash } : {})}
            />
          </HoliButton>
        )}
        <View style={styles.header}>
          <View style={[styles.inviteOnly, appointment.thumbnail ? styles.tagWithImage : {}]}>
            <HoliIcon
              icon={appointment.inviteOnly ? LockFilled : GlobeFilled}
              color={colors.foreground30}
              size={14}
              style={styles.iconGroupIcon}
            />
            <HoliText size="extrasmall">
              {t(
                `appointment.card.${
                  appointment.inviteOnly ? INVITE_ONLY_TYPE.INVITE_ONLY : INVITE_ONLY_TYPE.PUBLIC
                }.title`
              )}
            </HoliText>
          </View>
          {(isAdmin || isAppointmentCreator) && !showFullView && (
            <HoliActionDrawer.Drawer
              label={t('global.moreOptions')}
              testID="btn-appointment-more-options"
              buttonElement={
                <View style={appointment.thumbnail ? styles.optionsWithImage : null}>
                  <HoliIcon icon={More} color={colors.foreground30} />
                </View>
              }
            >
              <HoliActionDrawer.Action
                icon={Edit2}
                title={t('global.edit')}
                testID="btn-to-edit-appointment"
                handleAction={() => navigate(`/spaces/${space.name}/appointments/${appointment.id}/edit`)}
              />
              <HoliActionDrawer.Action
                isLoading={isLoadingDeleteAppointment}
                icon={Delete}
                title={t('global.delete')}
                variant="danger"
                testID="btn-to-delete-appointment"
                showConfirmation
              >
                <HoliActionDrawer.Confirmation
                  title={t('appointment.delete.confirmation.title')}
                  description={t('appointment.delete.confirmation.description')}
                  testID="appointment-delete"
                  handleConfirmation={deleteAppointment}
                  buttonType="warning"
                  hasDismissBtn
                  requireLogin
                />
              </HoliActionDrawer.Action>
            </HoliActionDrawer.Drawer>
          )}
        </View>
      </View>

      <View style={[styles.detailContainer, appointment.thumbnail ? styles.detailContainerWithImage : {}]}>
        <HoliButton
          transparent
          label={appointment.title}
          onPress={goToDetailView}
          disabled={showFullView}
          style={[styles.clickOverlay, { flex: 1 }]}
        >
          <HoliText ellipsizeMode="tail" bold {...(showFullView ? {} : { numberOfLines: 2 })}>
            {appointment.title}
          </HoliText>
        </HoliButton>
      </View>
      <HoliButton
        transparent
        label={appointment.title}
        onPress={goToDetailView}
        disabled={showFullView}
        style={styles.clickOverlay}
      >
        <View style={styles.iconsContainer}>
          <View style={styles.iconGroupContainer}>
            <HoliIcon icon={Time} size={12} color={colors.foreground20} style={styles.iconGroupIcon} />
            <HoliText style={styles.iconGroupText} size="extrasmall">
              {date} ∙ {startTime} {t('global.until')} {endTime}
            </HoliText>
          </View>
        </View>
      </HoliButton>

      {showFullView && (
        <View style={styles.descriptionContainer}>
          <HoliText color="gray300" size="small">
            {appointment.description}
          </HoliText>
          <HoliRichTextOutput
            text={appointment.description}
            color="gray300"
            size="small"
            allowAllLinks
            testID="appointment-description"
          />

          <View style={styles.avatar}>
            <HoliAvatar
              imageSrc={appointment.creator.avatar}
              imageBlurhash={appointment.creator.avatarBlurhash}
              label={appointment.creator.fullName || t('user.profileView.anonymous')}
              initials={appointment.creator.avatarLabel || ''}
              defaultColor={appointment.creator.avatarDefaultColor || ''}
              size="large"
              testID="appointment-contact-avatar"
            />
            <HoliText style={styles.avatarName}>
              {appointment.creator.fullName || t('user.profileView.anonymous')}
            </HoliText>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    width: '100%',
    top: 8,
  },
  inviteOnly: {
    padding: 2,
    paddingRight: 4,
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagWithImage: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    marginLeft: 6,
  },
  optionsWithImage: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    marginRight: 6,
  },
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    flex: 1,
  },
  detailContainerWithImage: {
    marginTop: 0,
  },
  clickOverlay: {
    position: 'relative',
    pointerEvents: 'auto',
  },
  descriptionContainer: {
    marginVertical: 16,
  },
  image: {
    borderRadius: 8,
    height: 166,
    justifyContent: 'center',
  },
  imageShowFullView: {
    borderRadius: 8,
    width: '100%',
    aspectRatio: IMAGE_ASPECT_RATIO,
    height: Platform.OS === 'web' ? '100%' : 'auto',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  appointmentItem: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    padding: 8,
    flexShrink: 1,
  },
  iconsContainer: {
    marginTop: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconGroupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  iconGroupIcon: {
    marginRight: 4,
  },
  iconGroupText: {
    color: colors.foreground20,
    marginRight: 8,
  },
  avatar: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarName: {
    marginLeft: 16,
  },
})

export default memo(AppointmentCard)
