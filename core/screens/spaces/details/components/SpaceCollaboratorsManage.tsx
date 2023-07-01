import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import createParam from '@holi/core/navigation/hooks/useParam'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceCollaboratorsManageParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<SpaceCollaboratorsManageParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceCollaboratorsManage: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const mixins = useStyleMixins()
  const { openToast } = useToast()

  const handleNotImplemented = () => {
    openToast(t('global.comingSoon'), HoliToastType.SUCCESS)
  }

  return (
    <DefaultLayout style={[mixins.container, styles.defaultLayout]}>
      <View style={[mixins.container]}>
        <HoliLink label="Collaborators" href={`/spaces/${spaceIdOrName}/collaborators/manage`}>
          <View style={styles.link}>
            <View style={styles.container}>
              <HoliIcon icon="team" style={styles.icon} />
              <HoliText>{'Collaborators'}</HoliText>
            </View>
            <HoliIcon icon="arrow-right-s" />
          </View>
        </HoliLink>

        <HoliLink
          label="Roles and Permissions"
          href={`/spaces/${spaceIdOrName}/collaborators/`}
          onPress={handleNotImplemented}
        >
          <View style={styles.link}>
            <View style={styles.container}>
              <HoliIcon icon="contacts" style={styles.icon} />
              <HoliText>{'Roles and Permissions'}</HoliText>
            </View>
            <HoliIcon icon="arrow-right-s" />
          </View>
        </HoliLink>

        <HoliLink label="Help" href={`/spaces/${spaceIdOrName}/collaborators/`} onPress={handleNotImplemented}>
          <View style={styles.link}>
            <View style={styles.container}>
              <HoliIcon icon="help" style={styles.icon} />
              <HoliText>{'Help'}</HoliText>
            </View>
            <HoliIcon icon="arrow-right-s" />
          </View>
        </HoliLink>

        <HoliLink label="Welcome intro" href={`/spaces/${spaceIdOrName}/collaborators/`} onPress={handleNotImplemented}>
          <View style={styles.link}>
            <View style={styles.container}>
              <HoliIcon icon="chat-heart" style={styles.icon} />
              <HoliText>{'Welcome intro'}</HoliText>
            </View>
            <HoliIcon icon="arrow-right-s" />
          </View>
        </HoliLink>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingTop: vars.topBarHeight,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginTop: 20,
    marginBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
})

export default SpaceCollaboratorsManage
