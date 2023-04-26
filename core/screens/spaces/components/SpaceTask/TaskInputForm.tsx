import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/location/components/PlacesAutocomplete'
import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import {
  LOCATION_TYPE_OPTIONS,
  REGULARITY_OPTIONS,
  VISIBILITY_TYPE_OPTIONS,
} from '@holi/core/screens/spaces/components/SpaceTask/consts'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { Geolocation, LocationType } from '@holi/core/screens/spaces/types'
import { Skill } from '@holi/core/screens/userprofile/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface TaskInputFormProps {
  name: string
  description: string
  contactEmail: string
  skills: Skill[]
  slotsAvailable?: number
  visibility?: HoliModalSelectOption
  locationType?: HoliModalSelectOption
  regularity?: HoliModalSelectOption
  thumbnail?: ImageInfo
  location?: string
  geolocation?: Geolocation
  contactPhone?: string
  selectedLocation?: GeolocationSuggestion
  currentThumbnail?: string
  onChangeName: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeVisibility: (_: HoliModalSelectOption) => void
  onChangeLocationType: (_: HoliModalSelectOption) => void
  onChangeRegularity: (_: HoliModalSelectOption) => void
  onChangeContactEmail: (_: string) => void
  onChangeSlotsAvailable: (_: number) => void
  onChangeThumbnail: (_: ImageInfo) => void
  onChangeSkills: (_: Skill[]) => void
  onChangeLocation: (_: string) => void
  onChangeGeolocation: (_: Geolocation) => void
  onChangeContactPhone: (_: string) => void
  onChangeSelectedLocation: (_: GeolocationSuggestion) => void
  isEdit?: boolean
  fieldErrors?: TranslatedFieldErrors
}

const TaskInputForm: React.VFC<TaskInputFormProps> = ({
  name,
  description,
  visibility,
  locationType,
  regularity,
  contactEmail,
  thumbnail,
  currentThumbnail,
  contactPhone,
  skills,
  selectedLocation,
  onChangeName,
  onChangeDescription,
  onChangeVisibility,
  onChangeLocationType,
  onChangeRegularity,
  onChangeContactEmail,
  onChangeThumbnail,
  onChangeContactPhone,
  onChangeSkills,
  onChangeSelectedLocation,
  isEdit = false,
  fieldErrors = {},
}: TaskInputFormProps) => {
  const [visibilityOptions, setVisibilityOptions] = useState<HoliModalSelectOption[]>(VISIBILITY_TYPE_OPTIONS)
  const [locationTypeOptions, setLocationTypeOptions] = useState<HoliModalSelectOption[]>(LOCATION_TYPE_OPTIONS)
  const [regularityOptions, setRegularityOptions] = useState<HoliModalSelectOption[]>(REGULARITY_OPTIONS)

  const [nameError, setNameError] = useState<string | undefined>()
  const [descriptionError, setDescriptionError] = useState<string | undefined>()
  const [contactEmailError, setContactEmailError] = useState<string | undefined>()
  const [contactPhoneError, setContactPhoneError] = useState<string | undefined>()

  const { t } = useTranslation()
  const { skills: allSkills } = useContext(SpaceTermContext)
  const { height: deviceHeight } = useWindowDimensions()

  const { visible: skillsFormVisibile, show: showSkillsForm, hide: hideSkillsForm } = useModalState()

  const mixins = useStyleMixins()

  // set options translations
  useEffect(() => {
    setVisibilityOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.input.task.visibility.${option.id}.title`),
        description: t(`spaces.input.task.visibility.${option.id}.description`),
      }))
    )

    setLocationTypeOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.input.task.locationType.${option.id}.title`),
      }))
    )

    setRegularityOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.input.task.regularity.${option.id}.title`),
      }))
    )
  }, [t, setVisibilityOptions, setLocationTypeOptions, setRegularityOptions])

  useEffect(() => {
    setNameError(fieldErrors?.name?.length ? fieldErrors.name[0] : undefined)
    setDescriptionError(fieldErrors?.description?.length ? fieldErrors.description[0] : undefined)
    setContactEmailError(fieldErrors?.contactEmail?.length ? fieldErrors.contactEmail[0] : undefined)
    setContactPhoneError(fieldErrors?.contactPhone?.length ? fieldErrors.contactPhone[0] : undefined)
  }, [fieldErrors])

  useEffect(() => {
    if (visibility) {
      setVisibilityOptions((options) =>
        options.map((visibilityOption) =>
          visibilityOption.title === visibility.title
            ? { ...visibilityOption, selected: true }
            : { ...visibilityOption, selected: false }
        )
      )
    }
    if (locationType) {
      setLocationTypeOptions((options) =>
        options.map((locationTypeOption) =>
          locationTypeOption.title === locationType.title
            ? { ...locationTypeOption, selected: true }
            : { ...locationTypeOption, selected: false }
        )
      )
    }
    if (regularity) {
      setRegularityOptions((options) =>
        options.map((regularityOption) =>
          regularityOption.title === regularity.title
            ? { ...regularityOption, selected: true }
            : { ...regularityOption, selected: false }
        )
      )
    }
  }, [visibility, locationType, regularity])

  const ThumbnailUploader = () => {
    return (
      <View style={styles.thumbnailContainer}>
        {thumbnail?.uri ? (
          <HoliImage
            source={{ uri: thumbnail?.uri ?? '' }}
            label={t('spaces.input.task.thumbnail.label')}
            style={styles.thumbnail}
          />
        ) : currentThumbnail ? (
          <HoliImage
            source={{ uri: currentThumbnail }}
            label={t('spaces.input.task.thumbnail.label')}
            style={styles.thumbnail}
          />
        ) : (
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
      <HoliText style={styles.marginSeparator} size="large" testID="task-visibility-title">
        {t('spaces.input.task.section.visibility')}
      </HoliText>
      <HoliModalSelect
        options={visibilityOptions}
        style={styles.marginSeparator}
        title={t('spaces.input.task.section.visibility')}
        onChange={onChangeVisibility}
        placeholder={t('spaces.input.task.visibility.placeholder')}
        label={t('spaces.input.task.visibility.label')}
        testID="task-visibility-input"
        isRequired
      />
      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('spaces.input.task.section.about')}</HoliText>
        <HoliTextInput
          placeholder={t('spaces.input.task.section.about')}
          inputLabel={t('spaces.input.task.name.label')}
          validationErrorText={nameError}
          value={name}
          onChange={onChangeName}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.name.label')}
          testID="task-name"
          isRequired
          showCharacterCount
          maxNoOfCharacters={128}
          minNoOfCharacters={2}
        />
        <HoliTextInput
          placeholder={t('spaces.input.task.description.placeholder')}
          inputLabel={t('spaces.input.task.description.label')}
          value={description}
          onChange={onChangeDescription}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.description.label')}
          validationErrorText={descriptionError}
          testID="task-description"
          isRequired
          showCharacterCount
          noOfVisibleLines={4}
          maxNoOfVisibleLines={8}
          maxNoOfCharacters={1200}
        />

        <View style={[styles.marginSeparator, styles.skillsSection]}>
          <HoliText>{t('spaces.input.task.section.skills.title')}</HoliText>
          <HoliText style={styles.skillsDescription}>{t('spaces.input.task.section.skills.description')}</HoliText>
          {!!skills?.length && (
            <View style={styles.listContainer}>
              {skills.map((skill, index) => (
                <HoliChip
                  key={`skill_${index}`}
                  text={`${skill.title}`}
                  label={`${skill.title}`}
                  disabled
                  style={styles.chip}
                  testID="task-edit-skills-chip"
                />
              ))}
            </View>
          )}
          <HoliButton
            label={t('global.edit')}
            type="secondary"
            inline
            onPress={showSkillsForm}
            testID="btn-task-edit-skills-modal"
            style={styles.skillsButton}
          >
            <HoliText style={styles.skillsButtonText}>{t(skills.length > 0 ? 'global.edit' : 'global.add')}</HoliText>
            <HoliIcon icon={skills.length > 0 ? 'edit-2' : 'add'} />
          </HoliButton>
        </View>
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <HoliText size="large">{t('spaces.input.task.section.location')}</HoliText>
        <HoliModalSelect
          options={locationTypeOptions}
          title={t('spaces.input.task.locationType.label')}
          label={t('spaces.input.task.locationType.label')}
          placeholder={t('spaces.input.task.locationType.placeholder')}
          description={t('spaces.input.task.locationType.placeholder')}
          style={styles.marginSeparator}
          onChange={onChangeLocationType}
          isRequired
          testID="task-locationType"
          variant="dense"
        />

        {locationType && locationType.id !== LocationType.REMOTE && (
          <PlacesAutocomplete
            label={t('spaces.input.location.label')}
            placeholder={t('spaces.input.location.placeholder')}
            selected={selectedLocation}
            value={selectedLocation?.label}
            id="task-location"
            testID="task-location"
            onChange={onChangeSelectedLocation}
            onSubmit={onChangeSelectedLocation}
            style={[styles.marginSeparator, { zIndex: 1 }]}
            inputProps={{ autoFocus: !isEdit }}
            helperText={selectedLocation ? undefined : t('spaces.input.location.validation.helper')}
            withCoordinates
          />
        )}
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 1 }]}>
        <HoliText size="large">{t('spaces.input.task.section.involvement')}</HoliText>
        <HoliModalSelect
          options={regularityOptions}
          title={t('spaces.input.task.regularity.label')}
          label={t('spaces.input.task.regularity.label')}
          placeholder={t('spaces.input.task.regularity.placeholder')}
          description={t('spaces.input.task.regularity.placeholder')}
          style={styles.marginSeparator}
          onChange={onChangeRegularity}
          isRequired
          testID="task-regularity"
          variant="dense"
        />
      </View>

      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('spaces.input.task.section.contact')}</HoliText>
        <HoliTextInput
          placeholder={t('spaces.input.task.contactEmail.placeholder')}
          inputLabel={t('spaces.input.task.contactEmail.label')}
          validationErrorText={contactEmailError}
          isRequired
          value={contactEmail}
          onChange={onChangeContactEmail}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.contactEmail.label')}
          testID="task-contactEmail"
          maxNoOfCharacters={256}
        />
        <HoliTextInput
          placeholder={t('spaces.input.task.contactPhone.placeholder')}
          inputLabel={t('spaces.input.task.contactPhone.label')}
          validationErrorText={contactPhoneError}
          type="number"
          value={contactPhone}
          onChange={onChangeContactPhone}
          style={styles.marginSeparator}
          accessibilityLabel={t('spaces.input.task.contactPhone.label')}
          testID="task-contactPhone"
          maxNoOfCharacters={100}
        />
      </View>
      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('spaces.input.task.section.thumbnail')}</HoliText>
        <ThumbnailUploader />
      </View>

      <HoliModal
        show={skillsFormVisibile}
        onDismiss={hideSkillsForm}
        testID="task-skills-modal"
        label={t('spaces.input.task.skills')}
        autoHeight={false}
        // Smaller devices use the whole screen and
        // larger ones should have more space above for clicking the backdrop pane
        relativeHeight={deviceHeight > 750 ? 0.85 : 1}
      >
        <HoliKeyboardSaveView>
          <HoliModalContentWrapper
            actionButtonText={t('global.done')}
            onActionButtonPress={hideSkillsForm}
            hideFooterWhenKeyboardIsOpen={true}
            style={[styles.modalWrapper, mixins.container]}
            testID="create-task-skills-modal-wrapper"
          >
            <SpaceTermsInput
              title={t('spaces.input.task.section.skills')}
              description={t('spaces.input.task.section.skills.description')}
              searchPlaceholder={t('spaces.input.task.section.skills.search')}
              selected={skills}
              onSelect={onChangeSkills}
              terms={allSkills}
            />
          </HoliModalContentWrapper>
        </HoliKeyboardSaveView>
      </HoliModal>
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
  skillsSection: {
    paddingBottom: 0,
    borderTopColor: 'transparent',
  },
  skillsDescription: {
    color: colors.foreground20,
    marginTop: 8,
  },
  skillsButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 16,
  },
  skillsButtonText: {
    marginRight: 6,
  },
  listContainer: {
    marginTop: 16,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  chip: {
    backgroundColor: colors.background10,
    marginRight: 8,
    marginBottom: 8,
  },
  modalWrapper: {
    flex: 1,
  },
})
