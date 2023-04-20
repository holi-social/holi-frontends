import { useQuery } from '@apollo/client'
import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import SpaceUpdateInputForm from '@holi/core/screens/spaces/components/SpaceUpdateInputForm'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'
import { ImageInfo } from '@holi/ui/components/organisms/HoliImagePicker/types'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type CreateUpdateParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<CreateUpdateParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const CreateUpdate: React.VFC<ScreenProps> = () => {
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { setOptions, navigateBack } = useUnifiedNavigation()
  const { height: deviceHeight } = useWindowDimensions()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [image, setImage] = useState<ImageInfo | undefined>()

  const {
    data,
    error: errorSpace,
    loading: loadingSpace,
  } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceIdOrName },
  })

  const space = data?.spaceById
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  useLayoutEffect(() => {
    !loadingSpace &&
      isMember &&
      setOptions({
        animation: 'slide_from_bottom',
        title: t('spaces.createUpdate.title'),
        headerStyle: { backgroundColor: colors.background20 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-left" />,
        navigationCustomOptions: {
          footerShown: false,
        },
      })
  }, [setOptions, t, loadingSpace, isMember])

  const onChangeTitle = (title: string) => {
    setTitle(title)
  }

  const onChangeContent = (content: string) => {
    setContent(content)
  }

  const onChangeImage = (image: ImageInfo | undefined) => {
    setImage(image)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loadingSpace || errorSpace || !space || !isMember) {
    return <></>
  }

  const onSave = () => {
    console.log('on save')
  }

  const Footer = () => {
    return (
      <View style={styles.footerContainer}>
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
            disabled={false} //{saveButtonDisabled || !inputValid}
            label={t('global.save')}
            onPress={onSave}
            testID="digital-tool-add-modal-save-btn"
            style={styles.footerButton}
          />
        </View>
      </View>
    )
  }

  return (
    <>
      <DefaultScrollHeaderLayout style={styles.defaultLayout} contentStyle={styles.contentStyle} headerOverlap>
        <View
          style={[mixins.container, styles.container, { minHeight: deviceHeight, paddingTop: vars.topBarHeight + 40 }]}
        >
          <SpaceUpdateInputForm
            onChangeTitle={onChangeTitle}
            onChangeContent={onChangeContent}
            onUploadImage={onChangeImage}
            title={title}
            content={content}
            image={image}
          />
        </View>
      </DefaultScrollHeaderLayout>

      <Footer />
    </>
  )
}

export default CreateUpdate

const styles = StyleSheet.create({
  defaultLayout: {
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
    backgroundColor: 'red',
  },
  subTitle: {
    marginBottom: 32,
    marginTop: 16,
    color: colors.foreground20,
  },
  footerContainer: {
    width: '100%',
  },
  footer: {
    backgroundColor: 'green',
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // FIXME: gap not supported in current react-native version for mobile
    //  using negative margin on parent and margin on children for mobile
    //  remove workaround when updated to RN 0.71.0
    gap: 10,
    margin: -7,
    ...Platform.select({
      web: {
        position: 'fixed',
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
