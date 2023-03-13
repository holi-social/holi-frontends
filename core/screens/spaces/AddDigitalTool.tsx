import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DigitalToolInputForm from '@holi/core/screens/spaces/components/DigitalToolInputForm'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type AddDigitalToolParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<AddDigitalToolParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const AddDigitalTool: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { height: deviceHeight } = useWindowDimensions()
  const { setOptions, navigateBack } = useUnifiedNavigation()
  const { t } = useTranslation()
  const onScreenScroll = useScrollYHandler()
  const mixins = useStyleMixins()
  const exitConfirmationTitle = t('spaces.digitalTool.add.close.dialog.title')
  const [url, setUrl] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [saveButtonDisabled, setSaveButtonDisabled] = useState<boolean>(true)
  const [thumbnail, setThumbnail] = useState<ImageInfo | undefined>()
  const [selectedCollection, setSelectedCollection] = useState<HoliSelectOption | undefined>()
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)

  useLayoutEffect(() => {
    setOptions({
      animation: 'slide_from_bottom',
      title: '',
      headerStyle: { backgroundColor: colors.background20 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon="arrow-down-s" onPress={() => setShowConfirmationModal(true)} />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setOptions, t])

  useEffect(() => {
    if (url.length > 0 && title.length > 0) {
      setSaveButtonDisabled(false)
    }
  }, [url, title])

  const onChangeUrl = (url: string) => {
    setUrl(url)
  }

  const onChangeTitle = (title: string) => {
    setTitle(title)
  }

  const onChangeDescription = (description: string) => {
    setDescription(description)
  }

  const onSave = () => {
    //TODO implement api integration
    console.log('Space id -->', spaceIdOrName)
  }

  const Footer = () => {
    return (
      <View style={[mixins.container, styles.footer]}>
        <HoliButton
          label={t('global.dismiss')}
          type="secondary"
          inline
          style={styles.footerButton}
          onPress={() => navigateBack()}
        >
          {t('global.dismiss')}
        </HoliButton>
        <HoliButtonLoading
          disabled={saveButtonDisabled}
          label={t('global.save')}
          onPress={onSave}
          testID="digital-tool-add-modal-save-btn"
          style={styles.footerButton}
        />
      </View>
    )
  }

  return (
    <>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <HoliText size="large">{t('spaces.digitalTool.add.title')}</HoliText>
          <HoliText style={styles.subTitle}>{t('spaces.digitalTool.add.subTitle')}</HoliText>
          <DigitalToolInputForm
            onChangeUrl={onChangeUrl}
            onChangeTitle={onChangeTitle}
            onChangeDescription={onChangeDescription}
            onSelectCollection={setSelectedCollection}
            onChangeThumbnail={setThumbnail}
            url={url}
            title={title}
            description={description}
            selectedCollection={selectedCollection}
            thumbnail={thumbnail}
          />
        </View>
      </DefaultLayout>
      <View>
        <Footer />
      </View>

      <HoliConfirmation
        show={showConfirmationModal}
        label={exitConfirmationTitle}
        title={exitConfirmationTitle}
        description={t('spaces.digitalTool.add.close.dialog.description')}
        onDismiss={() => setShowConfirmationModal(false)}
        dismissText={t('spaces.digitalTool.add.close.dialog.cancel.button.label')}
        confirmText={t('spaces.digitalTool.add.close.dialog.confirm.button.label')}
        testID="exit-add-digitalTool-confirmation"
        onConfirm={() => {
          setShowConfirmationModal(false)
          navigateBack()
        }}
      />
    </>
  )
}

export default AddDigitalTool

const styles = StyleSheet.create({
  defaultLayout: {
    padding: 24,
    backgroundColor: colors.background20,
  },
  contentStyle: {
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    paddingBottom: 132,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
  subTitle: {
    marginBottom: 32,
    marginTop: 16,
    color: colors.foreground20,
  },
  footer: {
    position: 'fixed',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    margin: -7,
    ...Platform.select({
      web: {
        alignSelf: 'center',
      },
    }),
  },
  footerButton: {
    flex: 1,
    margin: 7,
    ...Platform.select({
      web: {
        margin: 0,
      },
    }),
  },
})
