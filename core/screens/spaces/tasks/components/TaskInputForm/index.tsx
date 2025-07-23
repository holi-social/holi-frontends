import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View, useWindowDimensions } from 'react-native'
import { Image as ReactNativeImage } from 'react-native'

import { CONTENT_IMAGE_MAX_WIDTH, IMAGE_MAX_FILE_SIZE_BYTES } from '@holi/core/constants/constants'
import type { TranslatedFieldErrors } from '@holi/core/errors/hooks'
import PlacesAutocomplete from '@holi/core/geolocation/components/PlacesAutocomplete'
import {
  LOCATION_TYPE_OPTIONS,
  INTERACTION_TYPE_OPTIONS,
  VISIBILITY_TYPE_OPTIONS,
} from '@holi/core/screens/spaces/tasks/consts'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Edit2, LinkM } from '@holi/icons/src/generated'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import HoliImagePicker from '@holi/ui/components/organisms/HoliImagePicker'
import HoliModalSelect from '@holi/ui/components/organisms/HoliModalSelect'
import { Button } from 'holi-bricks/components/button'
import { TermsInput } from '@holi/core/components/TermsInput'

import TimeFrameSection from './sections/TimeFrameSection'
import TimingSection from './sections/TimingSection'
import { Text, TextLink } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { Spacing } from 'holi-bricks/foundations'
import { BorderWidth } from 'holi-bricks/foundations/dimensions/borderWidth'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliKeyboardSafeAreaView from '@holi/ui/components/organisms/HoliKeyboardSafeAreaView'
import { InteractionType as CGInteractionType, LocationType, VisibilityType } from '@holi/api/graphql/graphql-codegen'

import type { TaskFormInput } from './types'
import { useTimeFrame } from '@holi/core/screens/spaces/tasks/components/TaskInputForm/sections/TimeFrameSection/useTimeFrame'
import { createStyleSheet } from 'holi-bricks/styles'
import { colors } from '@holi/ui/styles/globalVars'
import { SelectorCard } from 'holi-bricks/components/selectors'
import { SelectorCardContent } from 'holi-bricks/components/selectors/SelectorCardContent'

const tipsForDescription = [
  {
    title: 'spaces.input.task.tipsForDescription.modal.tip_1.title',
    description: 'spaces.input.task.tipsForDescription.modal.tip_1.description',
    icon: require('@holi/ui/assets/img/tasks/checkmark.svg'),
  },
  {
    title: 'spaces.input.task.tipsForDescription.modal.tip_2.title',
    description: 'spaces.input.task.tipsForDescription.modal.tip_2.description',
    icon: require('@holi/ui/assets/img/tasks/sparkle.svg'),
  },
  {
    title: 'spaces.input.task.tipsForDescription.modal.tip_3.title',
    description: 'spaces.input.task.tipsForDescription.modal.tip_3.description',
    icon: require('@holi/ui/assets/img/tasks/news.svg'),
  },
  {
    title: 'spaces.input.task.tipsForDescription.modal.tip_4.title',
    description: 'spaces.input.task.tipsForDescription.modal.tip_4.description',
    icon: require('@holi/ui/assets/img/tasks/insight.svg'),
  },
  {
    title: 'spaces.input.task.tipsForDescription.modal.tip_5.title',
    description: 'spaces.input.task.tipsForDescription.modal.tip_5.description',
    icon: require('@holi/ui/assets/img/tasks/support.svg'),
  },
]

export interface TaskInputFormProps {
  taskInput: TaskFormInput
  onTaskInputChange: (update: Partial<TaskFormInput>) => void
  validateField: (field: keyof TaskFormInput) => void
  isEdit?: boolean
  fieldErrors?: TranslatedFieldErrors
  isAdmin?: boolean
}

const TaskInputForm: React.FC<TaskInputFormProps> = ({
  taskInput,
  onTaskInputChange,
  validateField,
  isEdit = false,
  fieldErrors = {},
  isAdmin,
}: TaskInputFormProps) => {
  const {
    show: showTipsForDescriptionModal,
    hide: hideTipsForDescriptionModal,
    props: tipsForDescriptionModalProps,
  } = useModalState()
  const {
    show: showVisibility,
    visible: visibleVisibility,
    props: { onDismiss: hideVisibility },
  } = useModalState({
    onDismiss: () => validateField('visibility'),
  })
  const {
    show: showLocationType,
    visible: visibleLocationType,
    props: { onDismiss: hideLocationType },
  } = useModalState({
    onDismiss: () => validateField('locationType'),
  })
  const {
    show: showInteractionType,
    visible: visibleInteractionType,
    props: { onDismiss: hideInteractionType },
  } = useModalState({
    onDismiss: () => validateField('interactionType'),
  })

  const timeFrameSectionProps = useTimeFrame(
    {
      anytime: !taskInput.timeframeStartDate && !taskInput.timeframeEndDate,
      start: new Date(taskInput.timeframeStartDate ?? Date.now()),
      end: new Date(taskInput.timeframeEndDate ?? Date.now()),
    },
    ({ anytime, start, end }) =>
      onTaskInputChange(
        anytime
          ? { timeframeStartDate: undefined, timeframeEndDate: undefined }
          : { timeframeStartDate: start.toISOString().split('T')[0], timeframeEndDate: end.toISOString().split('T')[0] }
      )
  )

  const { t } = useTranslation()
  const { height: deviceHeight } = useWindowDimensions()

  const { visible: skillsFormVisibile, show: showSkillsForm, hide: hideSkillsForm } = useModalState()

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
        {taskInput.thumbnail ? (
          <ReactNativeImage
            source={{ uri: taskInput.thumbnail?.uri ?? taskInput.thumbnail }}
            aria-hidden={true}
            style={styles.thumbnail}
          />
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
            onPickImage={(image) => onTaskInputChange({ thumbnail: image })}
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
        selected={taskInput.visibility}
        options={VISIBILITY_TYPE_OPTIONS.map((option) => ({
          ...option,
          title: t(`spaces.input.task.visibility.${option.id}.title`),
          description: t(`spaces.input.task.visibility.${option.id}.description`),
          disabled: !isAdmin && option.id === VisibilityType.Public ? true : false,
        }))}
        style={styles.marginSeparator}
        title={t('spaces.input.task.section.visibility')}
        onChange={(option) => {
          onTaskInputChange({ visibility: option.id })
          return false
        }}
        placeholder={t('spaces.input.task.visibility.placeholder')}
        label={t('spaces.input.task.visibility.label')}
        isRequired
        show={showVisibility}
        hide={hideVisibility}
        visible={visibleVisibility}
        validationErrorText={fieldErrors.visibility?.[0]}
        modalFooter={
          <Button
            onPress={hideVisibility}
            label={t('spaces.input.task.section.timing.duration.modal.saveButtonLabel')}
            testID="task-visibility-input-save-button"
          />
        }
        testID="task-visibility-input"
      />

      <View style={styles.sectionWrapper}>
        <Text size="lg" testID="task-input-label-name">
          {t('spaces.input.task.section.about')}
        </Text>

        <Stack margin={{ top: '3xs' }}>
          <TextLink size="xs" color="informative" onPress={showTipsForDescriptionModal}>
            {t('spaces.input.task.tipsForDescription.linkTitle')}
          </TextLink>
        </Stack>

        <HoliModal
          label={t('spaces.input.task.tipsForDescription.modal.title')}
          {...tipsForDescriptionModalProps}
          autoHeight={false}
          backgroundColor={colors.background20}
        >
          <ScrollView>
            <HoliContainer>
              <Stack gap="3xs" margin={{ left: '3xs', right: '3xs' }}>
                <Text size="3xl">{t('spaces.input.task.tipsForDescription.modal.title')}</Text>

                <Text size="md" colorOverride={styles.tipDescription.color}>
                  {t('spaces.input.task.tipsForDescription.modal.description')}
                </Text>
              </Stack>

              <Stack margin={{ top: 'md' }} gap="sm">
                {tipsForDescription.map(({ title, description, icon }, idx) =>
                  idx === 0 ? (
                    <SelectorCard
                      key={title}
                      title={t(title)}
                      description={t(description)}
                      imageSource={icon}
                      size="lm"
                      outlined={false}
                      alignItems="flex-start"
                    />
                  ) : (
                    <Stack key={title} direction="row" gap="xs" margin={'3xs'} alignItems="flex-start">
                      <SelectorCardContent title={t(title)} description={t(description)} imageSource={icon} size="lm" />
                    </Stack>
                  )
                )}
              </Stack>

              <Stack margin={{ top: 'md', bottom: 'xs' }}>
                <Button
                  onPress={hideTipsForDescriptionModal}
                  label={t('spaces.input.task.tipsForDescription.modal.close')}
                  testID="task-tipsForDescription-close-button"
                />
              </Stack>
            </HoliContainer>
          </ScrollView>
        </HoliModal>

        <HoliTextInput
          placeholder={t('spaces.input.task.section.about')}
          inputLabel={t('spaces.input.task.name.label')}
          validationErrorText={fieldErrors.name?.[0]}
          value={taskInput.name}
          onChange={(name) => onTaskInputChange({ name })}
          style={styles.marginSeparator}
          aria-label={t('spaces.input.task.name.label')}
          testID="task-name"
          isRequired
          showCharacterCount
          maxNoOfCharacters={128}
          onBlur={() => validateField('name')}
        />

        <HoliTextInput
          placeholder={t('spaces.input.task.description.placeholder')}
          inputLabel={t('spaces.input.task.description.label')}
          value={taskInput.description}
          onChange={(description) => onTaskInputChange({ description })}
          style={styles.marginSeparator}
          aria-label={t('spaces.input.task.description.label')}
          validationErrorText={fieldErrors.description?.[0]}
          testID="task-description"
          isRequired
          showCharacterCount
          noOfVisibleLines={4}
          maxNoOfVisibleLines={8}
          maxNoOfCharacters={1200}
          onBlur={() => validateField('description')}
        />

        <HoliTextInput
          placeholder={t('spaces.input.task.impact.placeholder')}
          inputLabel={t('spaces.input.task.impact.label')}
          value={taskInput.impact}
          onChange={(impact) => onTaskInputChange({ impact })}
          style={styles.marginSeparator}
          aria-label={t('spaces.input.task.impact.label')}
          testID="task-impact"
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

          {!!taskInput.skillsV2?.length && (
            <Stack margin={{ top: 'xs' }} direction="row" wrap="wrap" flexShrink={1} gap="3xs">
              {taskInput.skillsV2.map((skill) => (
                <ChipLabel key={skill} color="blue">
                  {t(`skill.${skill}`)}
                </ChipLabel>
              ))}
            </Stack>
          )}

          <Stack alignSelf="flex-start" margin={{ top: 'xs' }}>
            <Button
              label={t(taskInput.skillsV2 && taskInput.skillsV2.length > 0 ? 'global.edit' : 'global.add')}
              variant="secondary"
              inline
              onPress={showSkillsForm}
              testID="btn-task-edit-skills-modal"
              icon={taskInput.skillsV2 && taskInput.skillsV2.length > 0 ? Edit2 : Add}
            />
          </Stack>
        </Stack>
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 3 }]}>
        <Text size="lg">{t('spaces.input.task.section.location')}</Text>

        <HoliModalSelect
          selected={taskInput.locationType}
          options={LOCATION_TYPE_OPTIONS.map((option) => ({
            ...option,
            title: t(`spaces.input.task.locationType.${option.id}.title`),
          }))}
          title={t('spaces.input.task.locationType.label')}
          label={t('spaces.input.task.locationType.label')}
          placeholder={t('spaces.input.task.locationType.placeholder')}
          description={t('spaces.input.task.locationType.placeholder')}
          style={styles.marginSeparator}
          onChange={(option) => {
            onTaskInputChange({ locationType: option.id })
            return false
          }}
          isRequired
          variant="dense"
          show={showLocationType}
          hide={hideLocationType}
          modalFooter={
            <Button
              onPress={hideLocationType}
              label={t('spaces.input.task.section.timing.duration.modal.saveButtonLabel')}
              testID="task-locationType-input-save-button"
            />
          }
          visible={visibleLocationType}
          validationErrorText={fieldErrors.locationType?.[0]}
          testID="task-locationType"
        />

        {taskInput.locationType && taskInput.locationType !== LocationType.Remote && (
          <PlacesAutocomplete
            label={t('spaces.input.location.label')}
            placeholder={t('spaces.input.location.placeholder')}
            selected={{ id: '', label: taskInput.location ?? '', coordinates: taskInput.geolocation }}
            id="task-location"
            testID="task-location"
            onChange={(geolocation) => {
              if (geolocation?.coordinates) {
                onTaskInputChange({
                  location: geolocation.label,
                  geolocation: geolocation?.coordinates,
                })
              }
            }}
            style={[styles.marginSeparator, { zIndex: 1 }]}
            inputProps={{ autoFocus: !isEdit }}
            helperText={t('spaces.input.location.validation.helper')}
          />
        )}
      </View>

      <View style={[styles.sectionWrapper, { zIndex: 1 }]}>
        <Text size="lg">{t('spaces.input.task.section.interactionType')}</Text>

        <HoliModalSelect
          selected={taskInput.interactionType}
          options={INTERACTION_TYPE_OPTIONS.map((option) => ({
            ...option,
            title: t(`spaces.input.task.interactionType.${option.id}.title`),
            description: t(`spaces.input.task.interactionType.${option.id}.description`),
          }))}
          title={t('spaces.input.task.interactionType.label')}
          label={t('spaces.input.task.interactionType.label')}
          placeholder={t('spaces.input.task.interactionType.placeholder')}
          description={t('spaces.input.task.interactionType.description')}
          style={styles.marginSeparator}
          onChange={(option) => {
            onTaskInputChange({ interactionType: option.id })
            return false
          }}
          isRequired
          show={showInteractionType}
          hide={hideInteractionType}
          modalFooter={
            <Button
              onPress={hideInteractionType}
              label={t('spaces.input.task.section.timing.duration.modal.saveButtonLabel')}
              testID="task-interactionType-input-save-button"
            />
          }
          visible={visibleInteractionType}
          validationErrorText={fieldErrors.interactionType?.[0]}
          testID="task-interactionType"
        />
      </View>

      {taskInput.interactionType === CGInteractionType.Link && (
        <Stack margin={{ top: 'xs' }}>
          <HoliTextInput
            placeholder={t('spaces.input.task.interactionSignupLink.placeholder')}
            inputLabel={t('spaces.input.task.interactionSignupLink.label')}
            value={taskInput.interactionSignupLink}
            onChange={(interactionSignupLink) => onTaskInputChange({ interactionSignupLink })}
            style={styles.marginSeparator}
            aria-label={t('spaces.input.task.interactionSignupLink.label')}
            maxNoOfCharacters={1200}
            onBlur={() => validateField('interactionSignupLink')}
            validationErrorText={fieldErrors.interactionSignupLink?.[0]}
            testID="task-interactionSignupLink"
          />
        </Stack>
      )}

      <View style={styles.sectionWrapper}>
        <TimingSection
          duration={taskInput.duration}
          regularity={taskInput.regularity}
          onChange={onTaskInputChange}
          fieldErrors={fieldErrors}
          validateField={validateField}
        />
      </View>

      <View style={styles.sectionWrapper}>
        <TimeFrameSection {...timeFrameSectionProps} />
      </View>

      <View style={styles.sectionWrapper}>
        <Text size="lg">{t('spaces.input.task.section.contact')}</Text>

        <HoliTextInput
          placeholder={t('spaces.input.task.contactEmail.placeholder')}
          inputLabel={t('spaces.input.task.contactEmail.label')}
          validationErrorText={fieldErrors.contactEmail?.length ? t('global.validation.email.invalid') : undefined}
          isRequired
          value={taskInput.contactEmail}
          onChange={(contactEmail) => onTaskInputChange({ contactEmail })}
          style={styles.marginSeparator}
          aria-label={t('spaces.input.task.contactEmail.label')}
          testID="task-contactEmail"
          maxNoOfCharacters={256}
          onBlur={() => validateField('contactEmail')}
        />

        <HoliTextInput
          placeholder={t('spaces.input.task.contactPhone.placeholder')}
          inputLabel={t('spaces.input.task.contactPhone.label')}
          validationErrorText={fieldErrors.contactPhone?.[0]}
          type="number"
          value={taskInput.contactPhone}
          onChange={(contactPhone) => onTaskInputChange({ contactPhone })}
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
                selected={taskInput.skillsV2 ?? []}
                onSelect={(skillsV2) => onTaskInputChange({ skillsV2 })}
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

const styles = createStyleSheet((theme) => ({
  marginSeparator: {
    marginTop: Spacing.xs,
  },
  sectionWrapper: {
    borderTopWidth: BorderWidth.sm,
    borderTopColor: theme.colors.decorative.greyLight,
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
    backgroundColor: theme.colors.decorative.purpleDefault,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageUploadButton: {
    backgroundColor: theme.colors.decorative.white,
    borderWidth: BorderWidth.sm,
  },
  modalWrapper: {
    flex: 1,
  },
  tipDescription: {
    color: theme.components.selector.text,
  },
}))
