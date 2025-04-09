import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { Image as ReactNativeImage } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import type { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete, { type GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import {
  LOCATION_TYPE_OPTIONS,
  REGULARITY_OPTIONS,
  VISIBILITY_TYPE_OPTIONS,
} from '@holi/core/screens/spaces/tasks/consts'
import { LocationType, VisibilityType } from '@holi/core/screens/spaces/types'
import type { GeolocationPoint } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Edit2, LinkM } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import HoliModalSelect, { type HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { Button } from 'holi-bricks/components/button'
import { TermsInput } from '@holi/core/components/TermsInput'

import TimeFrameSection from './sections/TimeFrameSection'
import type { UseTimeFrameReturnValue } from './sections/TimeFrameSection/useTimeFrame'

export interface TaskInputFormProps {
  name: string
  description: string
  contactEmail: string
  skills: string[]
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
  /* TODO TASK TIMING: make the timeFrameSectionProps required after implementing the Task Timing feature in the BE */
  timeFrameSectionProps?: UseTimeFrameReturnValue
  onChangeName: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeVisibility: (_: HoliModalSelectOption) => void
  onChangeLocationType: (_: HoliModalSelectOption) => void
  onChangeRegularity: (_: HoliModalSelectOption) => void
  onChangeContactEmail: (_: string) => void
  onChangeSlotsAvailable: (_: number) => void
  onChangeThumbnail: (_: HoliImageInfo) => void
  onChangeSkills: (_: string[]) => void
  onChangeGeolocation: (_: GeolocationPoint) => void
  onChangeContactPhone: (_: string) => void
  onChangeSelectedLocation: (_?: GeolocationSuggestion) => void
  isEdit?: boolean
  fieldErrors?: TranslatedFieldErrors
  isAdmin?: boolean
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({
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
  timeFrameSectionProps,
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
}: TaskInputFormProps) => {
  const [visibilityOptions, setVisibilityOptions] = useState<HoliModalSelectOption[]>(VISIBILITY_TYPE_OPTIONS)
  const [locationTypeOptions, setLocationTypeOptions] = useState<HoliModalSelectOption[]>(LOCATION_TYPE_OPTIONS)
  const [regularityOptions, setRegularityOptions] = useState<HoliModalSelectOption[]>(REGULARITY_OPTIONS)

  const [nameError, setNameError] = useState<string | undefined>()
  const [descriptionError, setDescriptionError] = useState<string | undefined>()
  const [contactEmailError, setContactEmailError] = useState<string | undefined>()
  const [contactPhoneError, setContactPhoneError] = useState<string | undefined>()
  const [hasInteractedWithEmail, setHasInteractedWithEmail] = useState(false)

  const { show: showRegularity, hide: hideRegularity, visible: visibleRegularity } = useModalState()
  const { show: showVisibility, hide: hideVisibility, visible: visibleVisibility } = useModalState()
  const { show: showLocationType, hide: hideLocationType, visible: visibleLocationType } = useModalState()

  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { visible: skillsFormVisibile, show: showSkillsForm, hide: hideSkillsForm } = useModalState()

  const mixins = useStyleMixins()

  // set options translations
  useEffect(() => {
    setVisibilityOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.input.task.visibility.${option.id}.title`),
        description: t(`spaces.input.task.visibility.${option.id}.description`),
        disabled: !isAdmin && option.id === VisibilityType.PUBLIC ? true : false,
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
  }, [t, setVisibilityOptions, setLocationTypeOptions, setRegularityOptions, isAdmin])

  useEffect(() => {
    setNameError(fieldErrors?.name?.length ? fieldErrors.name[0] : undefined)
    setDescriptionError(fieldErrors?.description?.length ? fieldErrors.description[0] : undefined)
    setContactPhoneError(fieldErrors?.contactPhone?.length ? fieldErrors.contactPhone[0] : undefined)
    setContactEmailError(
      hasInteractedWithEmail && fieldErrors?.contactEmail?.length ? t('global.validation.email.invalid') : undefined
    )
  }, [fieldErrors, hasInteractedWithEmail, t])

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
          <ReactNativeImage source={{ uri: thumbnail?.uri ?? '' }} aria-hidden={true} style={styles.thumbnail} />
        ) : currentThumbnail ? (
          <ReactNativeImage source={{ uri: currentThumbnail }} aria-hidden={true} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailSkeleton]}>
            <HoliIcon icon={LinkM} size={20} color={colors.brandColorB30} />
          </View>
        )}
        <View style={styles.uploadButtonContainer}>
          <HoliImagePicker
            fileSizeLimitation={{
              type: 'resize',
              limitBytes: IMAGE_MAX_FILE_SIZE_BYTES,
              resizeWidth: CONTENT_IMAGE_MAX_WIDTH,
            }}
            buttonProps={{
              label: t('spaces.input.task.upload.button.label'),
              testID: 'space-upload-image-btn',
              style: styles.imageUploadButton,
            }}
            onPickImage={onChangeThumbnail}
          />
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
        show={showVisibility}
        hide={hideVisibility}
        visible={visibleVisibility}
      />
      <View style={styles.sectionWrapper}>
        <HoliText size="large" testID="task-input-label-name">
          {t('spaces.input.task.section.about')}
        </HoliText>
        <HoliTextInput
          placeholder={t('spaces.input.task.section.about')}
          inputLabel={t('spaces.input.task.name.label')}
          validationErrorText={nameError}
          value={name}
          onChange={onChangeName}
          style={styles.marginSeparator}
          aria-label={t('spaces.input.task.name.label')}
          testID="task-name"
          isRequired
          showCharacterCount
          maxNoOfCharacters={128}
        />
        <HoliTextInput
          placeholder={t('spaces.input.task.description.placeholder')}
          inputLabel={t('spaces.input.task.description.label')}
          value={description}
          onChange={onChangeDescription}
          style={styles.marginSeparator}
          aria-label={t('spaces.input.task.description.label')}
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
              {skills.map((skill) => (
                <ChipLabel key={skill} color="blue">
                  {t(`skill.${skill}`)}
                </ChipLabel>
              ))}
            </View>
          )}
          <View style={styles.skillsButton}>
            <Button
              label={t(skills.length > 0 ? 'global.edit' : 'global.add')}
              variant="secondary"
              inline
              onPress={showSkillsForm}
              testID="btn-task-edit-skills-modal"
              icon={skills.length > 0 ? Edit2 : Add}
            />
          </View>
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
          show={showLocationType}
          hide={hideLocationType}
          visible={visibleLocationType}
        />

        {locationType && locationType.id !== LocationType.REMOTE && (
          <PlacesAutocomplete
            label={t('spaces.input.location.label')}
            placeholder={t('spaces.input.location.placeholder')}
            selected={selectedLocation}
            id="task-location"
            testID="task-location"
            onChange={onChangeSelectedLocation}
            style={[styles.marginSeparator, { zIndex: 1 }]}
            inputProps={{ autoFocus: !isEdit }}
            helperText={t('spaces.input.location.validation.helper')}
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
          show={showRegularity}
          hide={hideRegularity}
          visible={visibleRegularity}
        />
      </View>

      {/* TODO TASK TIMING: remove the condition after implementing the Task Timing feature in the BE */}
      {timeFrameSectionProps && (
        <View style={styles.sectionWrapper}>
          <TimeFrameSection {...timeFrameSectionProps} />
        </View>
      )}

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
          aria-label={t('spaces.input.task.contactEmail.label')}
          testID="task-contactEmail"
          maxNoOfCharacters={256}
          onBlur={() => setHasInteractedWithEmail(true)}
        />
        <HoliTextInput
          placeholder={t('spaces.input.task.contactPhone.placeholder')}
          inputLabel={t('spaces.input.task.contactPhone.label')}
          validationErrorText={contactPhoneError}
          type="number"
          value={contactPhone}
          onChange={onChangeContactPhone}
          style={styles.marginSeparator}
          aria-label={t('spaces.input.task.contactPhone.label')}
          testID="task-contactPhone"
          maxNoOfCharacters={100}
        />
      </View>

      <View style={styles.sectionWrapper}>
        <HoliText size="large">{t('spaces.input.task.section.thumbnail')}</HoliText>
        <ThumbnailUploader />
      </View>

      <HoliModal
        shown={skillsFormVisibile}
        onDismiss={hideSkillsForm}
        testID="task-skills-modal"
        label={t('spaces.input.task.section.skills')}
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
            <TermsInput
              title={t('spaces.input.task.section.skills')}
              description={t('spaces.input.task.section.skills.description')}
              searchPlaceholder={t('spaces.input.task.section.skills.search')}
              selected={skills}
              onSelect={onChangeSkills}
              termType="skill"
            />
          </HoliModalContentWrapper>
        </HoliKeyboardSaveView>
      </HoliModal>
    </>
  )
}

export default TaskInputForm

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    marginSeparator: {
      marginTop: 16,
    },
    sectionWrapper: {
      borderTopWidth: 1,
      borderTopColor: theme.colors.background30,
      paddingTop: 32,
      marginTop: 32,
    },
    thumbnailTitle: {
      marginTop: 56,
    },
    thumbnailContainer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: theme.colors.background10,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    thumbnail: {
      aspectRatio: 1,
      width: '20%',
      borderRadius: 8,
      marginBottom: 16,
    },
    thumbnailSkeleton: {
      backgroundColor: theme.colors.brandColorB10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    uploadButtonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageUploadButton: {
      backgroundColor: theme.colors.background10,
      borderWidth: 1,
    },
    instructionsContainer: {
      marginTop: 16,
      justifyContent: 'center',
    },
    instructions: {
      justifyContent: 'center',
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
    skillsSection: {
      paddingBottom: 0,
      borderTopColor: 'transparent',
    },
    skillsDescription: {
      color: theme.colors.foreground20,
      marginTop: 8,
    },
    skillsButton: {
      alignSelf: 'flex-start',
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
      gap: 8,
    },
    modalWrapper: {
      flex: 1,
    },
  })
