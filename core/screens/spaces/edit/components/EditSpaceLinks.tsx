import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import SpaceLinkInput from '@holi/core/screens/spaces/components/SpaceInputs/SpaceLinkInput'
import CreateSpaceLinks from '@holi/core/screens/spaces/create/components/CreateSpaceLink'
import EditSpaceLink from '@holi/core/screens/spaces/edit/components/EditSpaceLink'
import EditSpaceModal from '@holi/core/screens/spaces/edit/components/EditSpaceModal'
import { deleteSpaceLinkMutation } from '@holi/core/screens/spaces/edit/mutations'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { Space, SpaceLink } from '@holi/core/screens/spaces/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

interface EditSpaceLinksProps {
  space: Space
  onDismiss: () => void
}

const EditSpaceLinks: React.VFC<EditSpaceLinksProps> = ({ space, onDismiss }: EditSpaceLinksProps) => {
  const { openToast } = useToast()
  const [selectedLink, setSelectedLink] = useState<SpaceLink>(undefined as unknown as SpaceLink)
  const { visible: visibleEdit, show: showEdit, hide: hideEdit } = useModalState()
  const { visible: visibleCreate, show: showCreate, hide: hideCreate } = useModalState()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const [deleteLink] = useMutation(deleteSpaceLinkMutation, {
    onCompleted: () => {
      openToast(t('spaces.input.socialLinks.delete.success'), HoliToastType.SUCCESS)
    },
    onError: (error) => displayError(error, t('spaces.input.socialLinks.delete.error')),
    refetchQueries: [{ query: spaceByIdQuery, variables: { idOrName: space.id } }],
  })

  const onSave = () => {
    openToast(t('spaces.edit.success'), HoliToastType.SUCCESS)
    onDismiss()
  }

  const onEdit = (link: SpaceLink) => {
    setSelectedLink(link)
    showEdit()
  }

  const onDelete = (linkId: string) => {
    deleteLink({
      variables: {
        id: linkId,
      },
    })
  }

  return (
    <EditSpaceModal onDismiss={onDismiss} onSave={onSave} scrollable={false}>
      <HoliText style={styles.title} size="extralarge">
        {t('spaces.input.socialLinks.manage.title')}
      </HoliText>
      <HoliText style={styles.subTitle}>{t('spaces.input.socialLinks.manage.subtitle')}</HoliText>
      <View style={styles.buttonContainer}>
        <HoliButton
          label={t('spaces.input.socialLinks.add.label')}
          type="secondary"
          style={styles.button}
          onPress={showCreate}
          inline
        >
          <HoliText>{t('spaces.input.socialLinks.add.label')}</HoliText>
        </HoliButton>
      </View>

      <View style={styles.wrapper}>
        {space.links?.map((link) => (
          <SpaceLinkInput key={link.id} link={link} onDelete={onDelete} onEdit={onEdit} />
        ))}
      </View>
      <HoliModal
        show={visibleCreate}
        onDismiss={hideCreate}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={styles.modal}
      >
        <CreateSpaceLinks space={space} onDismiss={hideCreate} />
      </HoliModal>
      <HoliModal
        show={visibleEdit}
        onDismiss={hideEdit}
        testID="more-options-modal"
        label={t('global.moreOptions')}
        style={styles.modal}
      >
        <EditSpaceLink space={space} link={selectedLink} onDismiss={hideEdit} />
      </HoliModal>
    </EditSpaceModal>
  )
}

const styles = StyleSheet.create({
  title: {
    marginTop: 40,
  },
  subTitle: {
    marginBottom: 32,
    marginTop: 16,
    color: colors.foreground20,
  },
  modal: {
    backgroundColor: colors.background20,
    paddingHorizontal: 16,
  },
  wrapper: {
    paddingBottom: Platform.OS === 'web' ? 0 : 100,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginBottom: 32,
  },
})

export default EditSpaceLinks
