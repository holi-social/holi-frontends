import type React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { isMaliciousUrlError, logError } from '@holi/core/errors/helpers'
import { validateUrl, withProtocol } from '@holi/core/helpers/url'
import SpaceLinksForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLinkForm'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import {
  type Space,
  ExternalLinkType,
  SpaceByIdDocument,
  useAddExternalLinkMutation,
} from '@holi/api/graphql/graphql-codegen'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

interface CreateSpaceLinksProps {
  space: Pick<Space, 'id'>
  onDismiss: () => void
}

const CreateSpaceLinks: React.FC<CreateSpaceLinksProps> = ({ space, onDismiss }: CreateSpaceLinksProps) => {
  const { openToast } = useToast()
  const [url, setUrl] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [type, setType] = useState<ExternalLinkType>(ExternalLinkType.Other || '')
  const [validationErrorTextUrl, setValidationErrorTextUrl] = useState<string | undefined>()
  const [validationErrorTextName, setValidationErrorTextName] = useState('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const { t } = useTranslation()
  const { track } = useTracking()

  const [addLinkToSpace] = useAddExternalLinkMutation({
    onCompleted: () => {
      openToast(t('spaces.input.publicLinks.add.success'), HoliToastType.SUCCESS)
      track(TrackingEvent.Spaces.Profile.externalLinkAdded(space.id))
      onDismiss()
    },
    onError: (e) => {
      if (isMaliciousUrlError(e)) {
        setValidationErrorTextUrl(t('global.maliciousUrl.error'))
      } else {
        setValidationErrorTextUrl(t('global.validation.url.invalid'))
      }
      logError(e, 'Failed to add link to space', {
        location: 'CreateSpaceLinks.addExternalLinkMutation',
        spaceId: space.id,
      })
    },
    refetchQueries: [{ query: SpaceByIdDocument, variables: { idOrName: space.id } }],
  })

  useEffect(() => {
    if (url.length > 0 && name.length > 0 && !validationErrorTextUrl) {
      setSaveButtonDisabled(false)
    } else {
      setSaveButtonDisabled(true)
    }
  }, [name, url, t, validationErrorTextUrl])

  useEffect(() => {
    const linkTypes = Object.values(ExternalLinkType)
    linkTypes.forEach((type) => {
      if (url.toUpperCase().includes(type)) {
        setType(type)
      }
    })
  }, [url])

  useEffect(() => {
    // Check if the input URL is in a valid format
    if (url.length > 0 && !validateUrl(url)) {
      setValidationErrorTextUrl(t('global.validation.url.invalid'))
    } else {
      setValidationErrorTextUrl(undefined)
    }
  }, [t, url])

  const onSave = async () => {
    if (!url) {
      setValidationErrorTextUrl(t('spaces.input.publicLinks.validation.url.mandatory'))
      return
    }
    if (!name) {
      setValidationErrorTextName(t('spaces.input.publicLinks.validation.name.mandatory'))
      return
    }

    return addLinkToSpace({
      variables: {
        input: {
          spaceId: space.id,
          url: withProtocol(url),
          name: name,
          type: type,
        },
      },
    })
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.pageView}>
      <SafeArea style={styles.safeArea}>
        <HoliKeyboardSaveView>
          <ScrollView keyboardShouldPersistTaps="handled">
            <EditSpaceModalWithFooter
              onDismiss={onDismiss}
              onSave={onSave}
              saveButtonDisabled={saveButtonDisabled}
              scrollable={false}
            >
              <SpaceLinksForm
                title={t('spaces.input.publicLinks.title')}
                onChangeUrl={setUrl}
                onChangeName={setName}
                url={url}
                name={name}
                validationErrorTextUrl={validationErrorTextUrl}
                validationErrorTextName={validationErrorTextName}
              />
            </EditSpaceModalWithFooter>
          </ScrollView>
        </HoliKeyboardSaveView>
      </SafeArea>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  pageView: {
    paddingTop: 0,
    height: '100%', // prevents double scrollbars
    overflow: 'hidden',
    ...Platform.select({
      android: {
        paddingBottom: 0,
      },
    }),
  },
  safeArea: {
    flex: 1,
  },
})

export default CreateSpaceLinks
