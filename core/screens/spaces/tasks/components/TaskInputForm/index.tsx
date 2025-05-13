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
  INTERACTION_TYPE_OPTIONS,
  VISIBILITY_TYPE_OPTIONS,
} from '@holi/core/screens/spaces/tasks/consts'
import { LocationType, VisibilityType } from '@holi/core/screens/spaces/types'
import type { GeolocationPoint } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Edit2, LinkM } from '@holi/icons/src/generated'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import type { HoliImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import HoliModalSelect, { type HoliModalSelectOption } from '@holi/ui/components/organisms/HoliModalSelect'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'
import { TermsInput } from '@holi/core/components/TermsInput'

import TimeFrameSection from './sections/TimeFrameSection'
import TimingSection from './sections/TimingSection'
import type { UseTimeFrameReturnValue } from './sections/TimeFrameSection/useTimeFrame'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/foundations'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import type { UseTimingReturnValue } from '@holi/core/screens/spaces/tasks/components/TaskInputForm/sections/TimingSection/useTiming'
import type { InteractionType as CGInteractionType, InteractionType } from '@holi/api/graphql/graphql-codegen'

export interface TaskInputFormProps {
  name: string
  description: string
  contactEmail: string
  interactionSignupLink?: string
  skills: string[]
  slotsAvailable?: number
  visibility?: HoliModalSelectOption
  locationType?: HoliModalSelectOption
  interactionType?: HoliModalSelectOption
  thumbnail?: HoliImageInfo
  thumbnailBlurhash?: string
  geolocation?: GeolocationPoint
  contactPhone?: string
  selectedLocation?: GeolocationSuggestion
  currentThumbnail?: string
  timingSectionProps: UseTimingReturnValue
  timeFrameSectionProps: UseTimeFrameReturnValue
  onChangeName: (_: string) => void
  onChangeDescription: (_: string) => void
  onChangeVisibility: (_: HoliModalSelectOption) => void
  onChangeLocationType: (_: HoliModalSelectOption) => void
  onChangeInteractionType: (_: HoliModalSelectOption<CGInteractionType>) => void
  onChangeContactEmail: (_: string) => void
  onChangeInteractionSignupLink: (_: string) => void
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
  interactionType,
  contactEmail,
  interactionSignupLink,
  thumbnail,
  currentThumbnail,
  contactPhone,
  skills,
  selectedLocation,
  timeFrameSectionProps,
  timingSectionProps,
  onChangeName,
  onChangeDescription,
  onChangeVisibility,
  onChangeLocationType,
  onChangeInteractionType,
  onChangeContactEmail,
  onChangeInteractionSignupLink,
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
  const [interactionTypeOptions, setInteractionTypeOptions] =
    useState<HoliModalSelectOption<InteractionType>[]>(INTERACTION_TYPE_OPTIONS)

  const [hasInteractedWithEmail, setHasInteractedWithEmail] = useState(false)

  const { show: showVisibility, hide: hideVisibility, visible: visibleVisibility } = useModalState()
  const { show: showLocationType, hide: hideLocationType, visible: visibleLocationType } = useModalState()
  const { show: showInteractionType, hide: hideInteractionType, visible: visibleInteractionType } = useModalState()

  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { visible: skillsFormVisibile, show: showSkillsForm, hide: hideSkillsForm } = useModalState()

  const nameError = fieldErrors?.name?.length ? fieldErrors.name[0] : undefined
  const descriptionError = fieldErrors?.description?.length ? fieldErrors.description[0] : undefined
  const contactPhoneError = fieldErrors?.contactPhone?.length ? fieldErrors.contactPhone[0] : undefined
  const contactEmailError =
    hasInteractedWithEmail && fieldErrors?.contactEmail?.length ? t('global.validation.email.invalid') : undefined
  const interactionSignupLinkError = fieldErrors?.signupLink?.length ? fieldErrors.signupLink[0] : undefined

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

    setInteractionTypeOptions((options) =>
      options.map((option) => ({
        ...option,
        title: t(`spaces.input.task.interactionType.${option.id}.title`),
        description: t(`spaces.input.task.interactionType.${option.id}.description`),
      }))
    )
  }, [t, setVisibilityOptions, setLocationTypeOptions, isAdmin])

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
    if (interactionType) {
      setInteractionTypeOptions((options) =>
        options.map((interactionTypeOption) =>
          interactionTypeOption.title === interactionType.title
            ? { ...interactionTypeOption, selected: true }
            : { ...interactionTypeOption, selected: false }
        )
      )
    }
  }, [visibility, locationType, interactionType])

  const ThumbnailUploader = () => {
    return (
      <Stack
        margin={{ top: 'xs' }}
        padding="xs"
        backgroundColor="support"
        alignItems="center"
        justifyContent="center"
        borderRadius="xs"
        borderWidth="sm"
        borderColor="default"
      >
        {/* TODO: replace with HoliImage component. Image preview currently only working with ReactNativeImage */}
        {thumbnail?.uri ? (
          <ReactNativeImage source={{ uri: thumbnail?.uri ?? '' }} aria-hidden={true} style={styles.thumbnail} />
        ) : currentThumbnail ? (
          <ReactNativeImage source={{ uri: currentThumbnail }} aria-hidden={true} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.thumbnailSkeleton]}>
            <HoliIcon icon={LinkM} size={20} colorOverride={colors.brandColorB30} />
          </View>
        )}
        <Stack alignItems="center" justifyContent="center">
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
        </Stack>
        <Instructions />
      </Stack>
    )
  }

  const Instructions = () => {
    return (
      <Stack margin={{ top: 'xs' }} justifyContent="center">
        <Text size="xs" textAlign="center" color="support">
          {t('spaces.input.coverImage.upload.hint')}
        </Text>
      </Stack>
    )
  }

  return (
    <Stack margin={{ top: 'xs' }}>
      <Text size="lg" testID="task-visibility-title">
        {t('spaces.input.task.section.visibility')}
      </Text>
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
        <Text size="lg" testID="task-input-label-name">
          {t('spaces.input.task.section.about')}
        </Text>
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

        <Stack margin={{ top: 'xs' }}>
          <Text size="lg">{t('spaces.input.task.section.skills.title')}</Text>
          <Stack margin={{ top: '3xs' }}>
            <Text color="support" size="md">
              {t('spaces.input.task.section.skills.description')}
            </Text>
          </Stack>
          {!!skills?.length && (
            <Stack margin={{ top: 'xs' }} direction="row" wrap="wrap" flexShrink={1} gap="3xs">
              {skills.map((skill) => (
                <ChipLabel key={skill} color="blue">
                  {t(`skill.${skill}`)}
                </ChipLabel>
              ))}
            </Stack>
          )}

          <Stack alignSelf="flex-start" margin={{ top: 'xs' }}>
            <Button
              label={t(skills.length > 0 ? 'global.edit' : 'global.add')}
              variant="secondary"
              inline
              onPress={showSkillsForm}
              testID="btn-task-edit-skills-modal"
              icon={skills.length > 0 ? Edit2 : Add}
            />
          </Stack>
        </Stack>
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <Text size="lg">{t('spaces.input.task.section.location')}</Text>
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
        <Text size="lg">{t('spaces.input.task.section.interactionType')}</Text>
        <HoliModalSelect
          options={interactionTypeOptions}
          title={t('spaces.input.task.interactionType.label')}
          label={t('spaces.input.task.interactionType.label')}
          placeholder={t('spaces.input.task.interactionType.placeholder')}
          description={t('spaces.input.task.interactionType.description')}
          style={styles.marginSeparator}
          onChange={onChangeInteractionType}
          isRequired
          testID="task-interactionType"
          show={showInteractionType}
          hide={hideInteractionType}
          visible={visibleInteractionType}
        />
      </View>
      {interactionType?.id === 'LINK' && (
        <Stack margin={{ top: 'xs' }}>
          <HoliTextInput
            placeholder={t('spaces.input.task.interactionSignupLink.placeholder')}
            inputLabel={t('spaces.input.task.interactionSignupLink.label')}
            validationErrorText={interactionSignupLinkError}
            value={interactionSignupLink}
            onChange={onChangeInteractionSignupLink}
            style={styles.marginSeparator}
            aria-label={t('spaces.input.task.interactionSignupLink.label')}
            testID="task-interactionSignupLink"
            maxNoOfCharacters={1200}
          />
        </Stack>
      )}

      <View style={styles.sectionWrapper}>
        <TimingSection {...timingSectionProps} />
      </View>

      <View style={styles.sectionWrapper}>
        <TimeFrameSection {...timeFrameSectionProps} />
      </View>

      <View style={styles.sectionWrapper}>
        <Text size="lg">{t('spaces.input.task.section.contact')}</Text>
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
        <Text size="lg">{t('spaces.input.task.section.thumbnail')}</Text>
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
        <HoliKeyboardSafeAreaView>
          <HoliModalContentWrapper
            actionButtonText={t('global.done')}
            onActionButtonPress={hideSkillsForm}
            hideFooterWhenKeyboardIsOpen={true}
            style={styles.modalWrapper}
            testID="create-task-skills-modal-wrapper"
          >
            <HoliContainer>
              <TermsInput
                title={t('spaces.input.task.section.skills')}
                description={t('spaces.input.task.section.skills.description')}
                searchPlaceholder={t('spaces.input.task.section.skills.search')}
                selected={skills}
                onSelect={onChangeSkills}
                termType="skill"
              />
            </HoliContainer>
          </HoliModalContentWrapper>
        </HoliKeyboardSafeAreaView>
      </HoliModal>
    </Stack>
  )
}

export default TaskInputForm

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    marginSeparator: {
      marginTop: Spacing.xs,
    },
    sectionWrapper: {
      borderTopWidth: BorderWidth.sm,
      borderTopColor: theme.colors.background30,
      paddingTop: Spacing.lg,
      marginTop: Spacing.lg,
    },
    thumbnailTitle: {
      marginTop: Spacing['3xl'],
    },
    thumbnail: {
      aspectRatio: 1,
      width: '20%',
      borderRadius: Spacing['3xs'],
      marginBottom: Spacing.xs,
    },
    thumbnailSkeleton: {
      backgroundColor: theme.colors.brandColorB10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    imageUploadButton: {
      backgroundColor: theme.colors.background10,
      borderWidth: BorderWidth.sm,
    },
    modalWrapper: {
      flex: 1,
    },
  })
