import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Geolocation, LocationType, Regularity, VisibilityType } from '@holi/core/screens/spaces/types'
import { Skill } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { colors } from '@holi/ui/styles/globalVars'

// TODO: try to make this programmatically
const VISIBILITY_TYPE_OPTIONS: HoliSelectOption[] = [
  {
    id: VisibilityType.PUBLIC,
    title: 'Public', // TODO: check translation
    selected: false,
  },
  {
    id: VisibilityType.MEMBERS,
    title: 'Members', // TODO: check translation
    selected: false,
  },
]

const LOCATION_TYPE_OPTIONS: HoliSelectOption[] = [
  {
    id: LocationType.HYBRID,
    title: 'Hybrid', // TODO: check translation
    selected: false,
  },
  {
    id: LocationType.ONSITE,
    title: 'On-site', // TODO: check translation
    selected: false,
  },
  {
    id: LocationType.REMOTE,
    title: 'Remote', // TODO: check translation
    selected: false,
  },
]

const REGULARITY_OPTIONS: HoliSelectOption[] = [
  {
    id: Regularity.ONE_TIME,
    title: 'One time', // TODO: check translation
    selected: false,
  },
  {
    id: Regularity.PROJECT_BASED,
    title: 'Project based', // TODO: check translation
    selected: false,
  },
  {
    id: Regularity.REGULARLY,
    title: 'Regularly', // TODO: check translation
    selected: false,
  },
]

export interface TaskInputFormProps {
  name: string
  description: string
  contactEmail: string
  skills: Skill[]
  slotsAvailable?: number
  visibility?: HoliSelectOption //  maybe VisibilityType
  locationType?: HoliSelectOption // maybe LocationType
  regularity?: HoliSelectOption // maybe Regularity
  thumbnail?: ImageInfo | undefined
  location?: string
  geolocation?: Geolocation
  contactPhone?: string
  onChangeName: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeVisibility: (_: HoliSelectOption) => void
  onChangeLocationType: (_: HoliSelectOption) => void
  onChangeRegularity: (_: HoliSelectOption) => void
  onChangeContactEmail: (_: string) => void
  onChangeSlotsAvailable: (_: number) => void
  onChangeThumbnail: (_: ImageInfo) => void
  onChangeSkills: (_: Skill[]) => void
  onChangeLocation: (_: string) => void
  onChangeGeolocation: (_: Geolocation) => void
  onChangeContactPhone: (_: string) => void
  isEdit?: boolean
}

const TaskInputForm: React.VFC<TaskInputFormProps> = ({
  name,
  description,
  visibility,
  locationType,
  regularity,
  contactEmail,
  thumbnail,
  contactPhone,
  onChangeName,
  onChangeDescription,
  onChangeVisibility,
  onChangeLocationType,
  onChangeRegularity,
  onChangeContactEmail,
  onChangeThumbnail,
  onChangeContactPhone,
  isEdit = false,
}: TaskInputFormProps) => {
  const [visibilityOptions, setVisibilityOptions] = useState<HoliSelectOption[]>(VISIBILITY_TYPE_OPTIONS)
  const [locationTypeOptions, setLocationTypeOptions] = useState<HoliSelectOption[]>(LOCATION_TYPE_OPTIONS)
  const [regularityOptions, setRegularityOptions] = useState<HoliSelectOption[]>(REGULARITY_OPTIONS)
  const { t } = useTranslation()

  useEffect(() => {
    if (visibility) {
      const updatedVisibilitysList = VISIBILITY_TYPE_OPTIONS.map((visibilityOption) =>
        visibilityOption.title === visibility.title
          ? { ...visibilityOption, selected: true }
          : { ...visibilityOption, selected: false }
      )
      setVisibilityOptions(updatedVisibilitysList)
    }
    if (locationType) {
      const updatedLocationTypeList = LOCATION_TYPE_OPTIONS.map((locationTypeOption) =>
        locationTypeOption.title === locationType.title
          ? { ...locationTypeOption, selected: true }
          : { ...locationTypeOption, selected: false }
      )
      setLocationTypeOptions(updatedLocationTypeList)
    }
    if (regularity) {
      const updatedRegularityList = REGULARITY_OPTIONS.map((regularityOption) =>
        regularityOption.title === regularity.title
          ? { ...regularityOption, selected: true }
          : { ...regularityOption, selected: false }
      )
      setRegularityOptions(updatedRegularityList)
    }
  }, [visibility, locationType, regularity])

  const ThumbnailUploader = () => {
    return (
      <View style={styles.thumbnailContainer}>
        {(thumbnail && (
          <HoliImage
            source={{ uri: thumbnail?.uri ?? '' }}
            label={t('spaces.input.task.thumbnail.label')}
            style={styles.thumbnail}
          />
        )) || (
          <View style={[styles.thumbnail, styles.thumbnailSkeleton]}>
            <HoliIcon icon={'link-m'} size={20} style={{ color: colors.brandColorB30 }} />
          </View>
        )}
        <HoliImagePicker
          maxFileSizeInMB={8}
          buttonProps={{
            label: t('spaces.input.task.upload.button.label'),
            transparent: true,
            inline: true,
          }}
          onPickImage={onChangeThumbnail}
        >
          <View style={styles.uploadButtonContainer}>
            <HoliButton
              label={t('spaces.input.task.upload.button.label')}
              testID="space-upload-image-btn"
              style={styles.imageUploadButton}
            >
              <HoliText>{t('spaces.input.task.upload.button.label')}</HoliText>
            </HoliButton>
          </View>
        </HoliImagePicker>
        <Instructions />
      </View>
    )
  }

  const Instructions = () => {
    return (
      <View style={styles.instructionsContainer}>
        <HoliText size="extrasmall" style={styles.instructions}>
          {t('spaces.input.coverImage.upload.hint')}
        </HoliText>
      </View>
    )
  }

  return (
    <>
      <HoliText style={styles.marginSeparator} size="large">
        {t('spaces.input.task.section.visibility')}
      </HoliText>
      <HoliSelect
        options={visibilityOptions}
        inputLabel={t('spaces.input.task.visibility.label')}
        accessibilityLabel={t('spaces.input.task.visibility.label')}
        placeholder={t('spaces.input.task.visibility.placeholder')}
        style={[styles.marginSeparator, { zIndex: 3 }]}
        onChange={onChangeVisibility}
        isRequired
        id="task-visibility-input"
        testID="task-visibility-input"
      />
      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('spaces.input.task.section.about')}</HoliText>
        <HoliTextInput
          placeholder={t('spaces.input.task.section.about')}
          inputLabel={t('spaces.input.task.name.label')}
          validationErrorText={''} // TODO: check this
          value={name}
          onChange={onChangeName}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.name.label')}
          testID="task-name-input"
          isRequired
          maxNoOfCharacters={128}
          minNoOfCharacters={2}
        />
        <HoliTextInput
          placeholder={t('spaces.input.task.description.placeholder')}
          inputLabel={t('spaces.input.task.description.label')}
          validationErrorText={''} // TODO: check this
          value={description}
          onChange={onChangeDescription}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.description.label')}
          testID="task-description-input"
          isRequired
          maxNoOfCharacters={1200}
        />
        {/* TODO: Skills */}
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 2 }]}>
        <HoliText size="large">{t('spaces.input.task.section.location')}</HoliText>
        <HoliSelect
          options={locationTypeOptions}
          inputLabel={t('spaces.input.task.locationType.label')}
          accessibilityLabel={t('spaces.input.task.locationType.label')}
          placeholder={t('spaces.input.task.locationType.placeholder')}
          style={styles.marginSeparator}
          onChange={onChangeLocationType}
          isRequired
          id="task-locationType-input"
          testID="task-locationType-input"
        />
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 1 }]}>
        <HoliText size="large">{t('spaces.input.task.section.involvement')}</HoliText>
        <HoliSelect
          options={regularityOptions}
          inputLabel={t('spaces.input.task.regularity.label')}
          accessibilityLabel={t('spaces.input.task.regularity.label')}
          placeholder={t('spaces.input.task.regularity.placeholder')}
          style={styles.marginSeparator}
          onChange={onChangeRegularity}
          isRequired
          id="task-regularity-input"
          testID="task-regularity-input"
        />
        {/* TODO: Compensation */}
      </View>

      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('spaces.input.task.section.contact')}</HoliText>
        <HoliTextInput
          placeholder={t('spaces.input.task.contactEmail.placeholder')}
          inputLabel={t('spaces.input.task.contactEmail.label')}
          validationErrorText={''} // TODO: check
          isRequired
          value={contactEmail}
          onChange={onChangeContactEmail}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.contactEmail.label')}
          testID="digital-tool-title"
          maxNoOfCharacters={256}
        />
        <HoliTextInput
          placeholder={t('spaces.input.task.contactPhone.placeholder')}
          inputLabel={t('spaces.input.task.contactPhone.label')}
          validationErrorText={''} // TODO: check
          value={contactPhone}
          onChange={onChangeContactPhone}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.contactPhone.label')}
          testID="digital-tool-title"
          maxNoOfCharacters={100}
        />
      </View>
      {!isEdit && (
        <View style={styles.sectionWrapper}>
          <HoliText size="large">{t('spaces.input.task.section.thumbnail')}</HoliText>
          <ThumbnailUploader />
        </View>
      )}
    </>
  )
}

export default TaskInputForm

const styles = StyleSheet.create({
  marginSeparator: {
    marginTop: 16,
  },
  sectionWrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.background30,
    paddingTop: 32,
    marginTop: 32,
  },
  thumbnailTitle: {
    marginTop: 56,
  },
  thumbnailContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  thumbnail: {
    aspectRatio: 1,
    width: '20%',
    borderRadius: 8,
    marginBottom: 16,
  },
  thumbnailSkeleton: {
    backgroundColor: colors.brandColorB10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadButton: {
    backgroundColor: colors.background10,
    borderWidth: 1,
  },
  instructionsContainer: {
    marginTop: 16,
    justifyContent: 'center',
  },
  instructions: {
    justifyContent: 'center',
    textAlign: 'center',
    color: colors.foreground20,
  },
})
