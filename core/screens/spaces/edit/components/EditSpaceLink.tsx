import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { validateUrl, withProtocol } from '@holi/core/helpers/url'
import SpaceLinksForm from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLinkForm'
import EditSpaceModalWithFooter from '@holi/core/screens/spaces/edit/components/EditSpaceModalWithFooter'
import { UpdateExternalLinkResponse, updateExternalLinkMutation } from '@holi/core/screens/spaces/edit/mutations'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceLink, SpaceLinkType } from '@holi/core/screens/spaces/types'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'

interface EditSpaceLinkProps {
  link: SpaceLink
  space: Space
  onDismiss: () => void
}

const EditSpaceLink: React.FC<EditSpaceLinkProps> = ({ space, link, onDismiss }: EditSpaceLinkProps) => {
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const [url, setUrl] = useState<string>(link.url || '')
  const [name, setName] = useState<string>(link.name || '')
  const [type, setType] = useState<string>(SpaceLinkType.OTHER || '')
  const [validationErrorTextUrl, setValidationErrorTextUrl] = useState<string | undefined>()
  const [validationErrorTextName, setValidationErrorTextName] = useState('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)
  const { t } = useTranslation()

  const [updateLink] = useMutation<UpdateExternalLinkResponse>(updateExternalLinkMutation, {
    onCompleted: () => {
      openToast(t('spaces.input.publicLinks.update.success'), HoliToastType.SUCCESS)
      onDismiss()
    },
    onError: (e) => {
      displayError(e, 'Failed to update external link for space', {
        location: 'EditSpaceLink.updateLink',
        spaceId: space.id,
        linkId: link.id,
      })
    },
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: space.id } }],
  })

  useEffect(() => {
    if (url.length > 0 && name.length > 0 && !validationErrorTextUrl) {
      setSaveButtonDisabled(false)
    } else {
      setSaveButtonDisabled(true)
    }
  }, [name, url, t, validationErrorTextUrl])

  useEffect(() => {
    const linkTypes = Object.values(SpaceLinkType)
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

    return updateLink({
      variables: {
        input: {
          id: link.id,
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
                title={t('spaces.input.publicLinks.edit.label')}
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

export default EditSpaceLink
