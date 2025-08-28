import { useMutation } from '@apollo/client'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { type Space, type ExternalLink, SpaceByIdDocument } from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceLinkInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLinkInput'
import CreateSpaceLinks from '@holi/core/screens/spaces/create/components/CreateSpaceLink'
import EditSpaceLink from '@holi/core/screens/spaces/edit/components/EditSpaceLink'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { deleteSpaceLinkMutation } from '@holi/core/screens/spaces/edit/mutations'
import { Add } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'

interface EditSpaceLinksProps {
  space: Pick<Space, 'id' | 'links'>
  onDismiss: () => void
}

const EditSpaceLinks = ({ space, onDismiss }: EditSpaceLinksProps) => {
  const { openToast } = useToast()
  const [selectedLink, setSelectedLink] = useState<ExternalLink>(undefined as unknown as ExternalLink)
  const { visible: visibleEdit, show: showEdit, hide: hideEdit } = useModalState()
  const { visible: visibleCreate, show: showCreate, hide: hideCreate } = useModalState()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const [deleteLink] = useMutation(deleteSpaceLinkMutation, {
    onCompleted: () => {
      openToast(t('spaces.input.publicLinks.delete.success'), HoliToastType.SUCCESS)
    },
    refetchQueries: [{ query: SpaceByIdDocument, variables: { idOrName: space.id } }],
  })

  const onEdit = (link: ExternalLink) => {
    setSelectedLink(link)
    showEdit()
  }

  const onDelete = (linkId: string) => {
    deleteLink({
      variables: {
        id: linkId,
      },
      onError: (error) =>
        displayError(error, 'Failed to delete link', {
          displayMessage: t('spaces.input.publicLinks.delete.error'),
          location: 'EditSpaceLinks.onDelete',
          spaceId: space.id,
          linkId,
        }),
    })
  }

  // on web the modal should be fullscreen
  const extraModalProps =
    Platform.OS === 'web'
      ? {
          relativeHeight: 1,
          autoHeight: false,
        }
      : {}

  return (
    <EditSpaceModal
      scrollable={false}
      footer={
        <View style={styles.doneButton}>
          <Button label={t('global.done')} onPress={onDismiss} />
        </View>
      }
    >
      <HoliText style={styles.subTitle}>{t('spaces.input.publicLinks.manage.subtitle')}</HoliText>
      <View style={styles.buttonContainer}>
        <Button
          label={t('spaces.input.publicLinks.add.label')}
          variant="secondary"
          onPress={showCreate}
          inline
          icon={Add}
        />
      </View>

      <View style={styles.wrapper}>
        {space.links?.map((link) => (
          <SpaceLinkInput key={link.id} link={link} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </View>
      <HoliModal
        shown={visibleCreate}
        onDismiss={hideCreate}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        headerStyle={styles.header}
        style={styles.modal}
        {...extraModalProps}
      >
        <CreateSpaceLinks space={space} onDismiss={hideCreate} />
      </HoliModal>
      <HoliModal
        shown={visibleEdit}
        onDismiss={hideEdit}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={styles.modal}
        headerStyle={styles.header}
        {...extraModalProps}
      >
        <EditSpaceLink space={space} link={selectedLink} onDismiss={hideEdit} />
      </HoliModal>
    </EditSpaceModal>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    header: {
      backgroundColor: theme.colors.background20,
    },
    subTitle: {
      marginTop: 24,
      marginBottom: 32,
      color: theme.colors.foreground20,
    },
    doneButton: {
      maxWidth: dimensions.maxButtonWidth,
      marginHorizontal: 'auto',
      width: '100%',
    },
    modal: {
      backgroundColor: theme.colors.background20,
    },
    wrapper: {
      paddingBottom: Platform.OS === 'web' ? 0 : 100,
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: 32,
    },
    buttonText: {
      marginRight: 6,
    },
  })

export default EditSpaceLinks
