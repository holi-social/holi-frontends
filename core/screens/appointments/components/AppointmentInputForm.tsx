import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { Image as ReactNativeImage } from 'react-native'

import { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import SpaceTermsInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceTermsInput'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import {
  LOCATION_TYPE_OPTIONS,
  REGULARITY_OPTIONS,
  VISIBILITY_TYPE_OPTIONS,
} from '@holi/core/screens/spaces/tasks/consts'
import { LocationType, VisibilityType } from '@holi/core/screens/spaces/types'
import { Skill } from '@holi/core/screens/userprofile/types'
import { GeolocationPoint } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Edit2, LinkM } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import HoliModalSelect, { HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export interface AppointmentInputFormProps {
  name: string
  description: string
  contactEmail: string
  skills: Skill[]
  slotsAvailable?: number
  visibility?: HoliModalSelectOption
  locationType?: HoliModalSelectOption
  regularity?: HoliModalSelectOption
  thumbnail?: HoliImageInfo
  thumbnailBlurhash?: string
  geolocation?: GeolocationPoint
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
  onChangeThumbnail: (_: HoliImageInfo) => void
  onChangeSkills: (_: Skill[]) => void
  onChangeGeolocation: (_: GeolocationPoint) => void
  onChangeContactPhone: (_: string) => void
  onChangeSelectedLocation: (_: GeolocationSuggestion) => void
  isEdit?: boolean
  fieldErrors?: TranslatedFieldErrors
  isAdmin?: boolean
}

const AppointmentInputForm: React.VFC<AppointmentInputFormProps> = ({
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
  isAdmin,
}: AppointmentInputFormProps) => {
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
        title: t(`appointments.input.visibility.${option.id}.title`),
        description: t(`appointments.input.visibility.${option.id}.description`),
        disabled: !isAdmin && option.id === VisibilityType.PUBLIC ? true : false,
      }))
    )

    setLocationTypeOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`appointments.input.locationType.${option.id}.title`),
      }))
    )

    setRegularityOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`appointments.input.regularity.${option.id}.title`),
      }))
    )
  }, [t, setVisibilityOptions, setLocationTypeOptions, setRegularityOptions, isAdmin])

  useEffect(() => {
    setNameError(fieldErrors?.name?.length ? fieldErrors.name[0] : undefined)
    setDescriptionError(fieldErrors?.description?.length ? fieldErrors.description[0] : undefined)
    setContactEmailError(fieldErrors?.contactEmail?.length ? t('global.validation.email.invalid') : undefined)
    setContactPhoneError(fieldErrors?.contactPhone?.length ? fieldErrors.contactPhone[0] : undefined)
  }, [fieldErrors, t])

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
        {/* TODO: replace with HoliImage component. Image preview currently only working with ReactNativeImage */}
        {thumbnail?.uri ? (
          <ReactNativeImage
            source={{ uri: thumbnail?.uri ?? '' }}
            aria-label={t('appointments.input.thumbnail.label')}
            style={styles.thumbnail}
          />
        ) : currentThumbnail ? (
          <ReactNativeImage
            source={{ uri: currentThumbnail }}
            aria-label={t('appointments.input.thumbnail.label')}
            style={styles.thumbnail}
          />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailSkeleton]}>
            <HoliIcon icon={LinkM} size={20} color={colors.brandColorB30} />
          </View>
        )}
        <View style={styles.uploadButtonContainer}>
          <HoliImagePicker
            maxFileSizeInMB={10}
            buttonProps={{
              label: t('appointments.input.upload.button.label'),
              testID: 'space-upload-image-btn',
              style: styles.imageUploadButton,
            }}
            onPickImage={onChangeThumbnail}
          >
            <HoliText>{t('appointments.input.upload.button.label')}</HoliText>
          </HoliImagePicker>
        </View>
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
      <HoliText style={styles.marginSeparator} size="large" testID="appointment-visibility-title">
        {t('appointments.input.section.visibility')}
      </HoliText>
      <HoliModalSelect
        options={visibilityOptions}
        style={styles.marginSeparator}
        title={t('appointments.input.section.visibility')}
        onChange={onChangeVisibility}
        placeholder={t('appointments.input.visibility.placeholder')}
        label={t('appointments.input.visibility.label')}
        testID="appointment-visibility-input"
        isRequired
      />
      <View style={styles.sectionWrapper}>
        <HoliText size="large" testID="appointment-input-label-name">
          {t('appointments.input.section.about')}
        </HoliText>
        <HoliTextInput
          placeholder={t('appointments.input.section.about')}
          inputLabel={t('appointments.input.name.label')}
          validationErrorText={nameError}
          value={name}
          onChange={onChangeName}
          style={styles.marginSeparator}
          aria-label={t('appointments.input.name.label')}
          testID="appointment-name"
          isRequired
          showCharacterCount
          maxNoOfCharacters={128}
        />
        <HoliTextInput
          placeholder={t('appointments.input.description.placeholder')}
          inputLabel={t('appointments.input.description.label')}
          value={description}
          onChange={onChangeDescription}
          style={styles.marginSeparator}
          aria-label={t('appointments.input.description.label')}
          validationErrorText={descriptionError}
          testID="appointment-description"
          isRequired
          showCharacterCount
          noOfVisibleLines={4}
          maxNoOfVisibleLines={8}
          maxNoOfCharacters={1200}
        />

        <View style={[styles.marginSeparator, styles.skillsSection]}>
          <HoliText>{t('appointments.input.section.skills.title')}</HoliText>
          <HoliText style={styles.skillsDescription}>{t('appointments.input.section.skills.description')}</HoliText>
          {!!skills?.length && (
            <View style={styles.listContainer}>
              {skills.map((skill, index) => (
                <HoliChip
                  key={`skill_${index}`}
                  text={`${skill.title}`}
                  label={`${skill.title}`}
                  disabled
                  style={styles.chip}
                  testID="appointment-edit-skills-chip"
                />
              ))}
            </View>
          )}
          <HoliButton
            label={t('global.edit')}
            type="secondary"
            inline
            onPress={showSkillsForm}
            testID="btn-appointment-edit-skills-modal"
            style={styles.skillsButton}
          >
            <HoliText style={styles.skillsButtonText}>{t(skills.length > 0 ? 'global.edit' : 'global.add')}</HoliText>
            <HoliIcon icon={skills.length > 0 ? Edit2 : Add} />
          </HoliButton>
        </View>
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <HoliText size="large">{t('appointments.input.section.location')}</HoliText>
        <HoliModalSelect
          options={locationTypeOptions}
          title={t('appointments.input.locationType.label')}
          label={t('appointments.input.locationType.label')}
          placeholder={t('appointments.input.locationType.placeholder')}
          description={t('appointments.input.locationType.placeholder')}
          style={styles.marginSeparator}
          onChange={onChangeLocationType}
          isRequired
          testID="appointment-locationType"
          variant="dense"
        />

        {locationType && locationType.id !== LocationType.REMOTE && (
          <PlacesAutocomplete
            label={t('spaces.input.location.label')}
            placeholder={t('spaces.input.location.placeholder')}
            selected={selectedLocation}
            value={selectedLocation?.label}
            id="appointment-location"
            testID="appointment-location"
            onChange={onChangeSelectedLocation}
            onSubmit={onChangeSelectedLocation}
            style={[styles.marginSeparator, { zIndex: 1 }]}
            inputProps={{ autoFocus: !isEdit }}
            helperText={selectedLocation ? undefined : t('spaces.input.location.validation.helper')}
          />
        )}
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 1 }]}>
        <HoliText size="large">{t('appointments.input.section.involvement')}</HoliText>
        <HoliModalSelect
          options={regularityOptions}
          title={t('appointments.input.regularity.label')}
          label={t('appointments.input.regularity.label')}
          placeholder={t('appointments.input.regularity.placeholder')}
          description={t('appointments.input.regularity.placeholder')}
          style={styles.marginSeparator}
          onChange={onChangeRegularity}
          isRequired
          testID="appointment-regularity"
          variant="dense"
        />
      </View>

      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('appointments.input.section.contact')}</HoliText>
        <HoliTextInput
          placeholder={t('appointments.input.contactEmail.placeholder')}
          inputLabel={t('appointments.input.contactEmail.label')}
          validationErrorText={contactEmailError}
          isRequired
          value={contactEmail}
          onChange={onChangeContactEmail}
          style={styles.marginSeparator}
          aria-label={t('appointments.input.contactEmail.label')}
          testID="appointment-contactEmail"
          maxNoOfCharacters={256}
        />
        <HoliTextInput
          placeholder={t('appointments.input.contactPhone.placeholder')}
          inputLabel={t('appointments.input.contactPhone.label')}
          validationErrorText={contactPhoneError}
          type="number"
          value={contactPhone}
          onChange={onChangeContactPhone}
          style={styles.marginSeparator}
          aria-label={t('appointments.input.contactPhone.label')}
          testID="appointment-contactPhone"
          maxNoOfCharacters={100}
        />
      </View>
      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('appointments.input.section.thumbnail')}</HoliText>
        <ThumbnailUploader />
      </View>

      <HoliModal
        show={skillsFormVisibile}
        onDismiss={hideSkillsForm}
        testID="appointment-skills-modal"
        label={t('appointments.input.skills')}
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
            testID="create-appointment-skills-modal-wrapper"
          >
            <SpaceTermsInput
              title={t('appointments.input.section.skills')}
              description={t('appointments.input.section.skills.description')}
              searchPlaceholder={t('appointments.input.section.skills.search')}
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

export default AppointmentInputForm

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
