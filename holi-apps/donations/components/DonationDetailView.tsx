import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, StyleSheet, View } from 'react-native'

import HoliHead from '@holi/core/components/HoliHead'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe, ShareBox } from '@holi/icons/src/generated'
import { useWindowDimensionsWithImageScaling } from '@holi/ui/components/atoms/HoliImage/useWindowDimensionsWithImageScaling'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import DonationInitiativeButton from '@holi-apps/donations/components/DonationInitiativeButton'
import DonationProgress from '@holi-apps/donations/components/DonationProgress'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { HtmlRenderer } from 'holi-bricks/components/html-renderer'
import { Image } from 'holi-bricks/components/image'
import { getPlaceholderImage } from 'holi-bricks/components/image/helpers'
import { Text } from 'holi-bricks/components/text'
import { useDonationDetails } from '@holi-apps/donations/hooks/useDonationDetails'

interface DonationDetailViewProps {
  projectId: string
}

const UTM_PARAMS = '?utm_source=holi&utm_medium=detailpage&utm_campaign=holi'
const IMAGE_HEIGHT = 420

export const DonationDetailView = ({ projectId }: DonationDetailViewProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const mixins = useStyleMixins()

  const { windowHeight, windowWidth } = useWindowDimensionsWithImageScaling()

  const { isLoading, project } = useDonationDetails({
    projectId,
    onError: (error) =>
      displayError(error, 'Failed to load donation project', {
        location: 'DonationsAppProjectDetail.useSingleTypesenseDocumentQuery',
        projectId,
      }),
    onNotFound: () => {
      replaceRoute('/404')
    },
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('donations.app.name'),
    })
  }, [setScreenOptions, t])

  if (!projectId || isLoading || !project) {
    return <HoliLoader testID="loader" />
  }

  const placeholderImage = getPlaceholderImage(project.title)
  const imageWidth = Math.min(windowWidth, IMAGE_HEIGHT * 2)

  return (
    <>
      <HoliHead
        title={project.title}
        description={project.summary}
        ogTitle={project.title}
        ogDescription={project.summary}
        ogImage={project.image_url}
      />
      <View
        style={{ alignItems: 'center', flex: 1, backgroundColor: colors.background30 }}
        testID="donations-detailview-container"
      >
        <ScrollViewRefreshable style={{ backgroundColor: colors.background30 }}>
          <View style={[mixins.container, styles.container, { minHeight: windowHeight }]}>
            <Image
              source={project.image_url ?? placeholderImage}
              width={imageWidth}
              height={imageWidth / 2}
              alt={project.title}
              fallbackSource={placeholderImage}
              stretch={Platform.OS === 'web'}
            />
            <View style={styles.header}>
              <Text size="3xl" headingLevel="1" testID="donations-project-title">
                {project.title}
              </Text>
              <View style={styles.location}>
                <HoliIcon icon={Globe} size={20} />
                <Text size="sm" margin={{ left: '3xs' }}>
                  {project.location}, {project.location_country}
                </Text>
              </View>
            </View>
            <DonationProgress
              progressPercentage={project.donation_progress_percentage ?? 0}
              openAmountInCents={project.donation_open_amount_in_cents ?? 0}
              size="large"
              style={styles.card}
              testID="donations-project-progress"
            />
            <View style={[styles.card, { paddingVertical: 24 }]} testID="donations-project-description">
              <DonationInitiativeButton project={project} />
              <Text size="xxl" margin={{ top: 'md', bottom: 'md' }}>
                &ldquo;{project.summary}&rdquo;
              </Text>
              <HtmlRenderer content={project.description} />
            </View>
          </View>
        </ScrollViewRefreshable>

        <View style={[mixins.container, styles.donateButtonContainer]}>
          <HoliLink
            label={t('donations.projectDetail.donate')}
            href={`${project.external_url}${UTM_PARAMS}`}
            testID="donations-project-detail-donate-btn"
            external
          >
            <ButtonTracked
              label={t('donations.projectDetail.donate')}
              onPress={() => Linking.openURL(`${project?.external_url}${UTM_PARAMS}`)}
              trackingEvent={TrackingEvent.Donations.pressed(project.id)}
              icon={ShareBox}
            />
          </HoliLink>
        </View>
      </View>
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingBottom: 132,
      paddingHorizontal: 0,
      ...Platform.select({
        native: {
          maxWidth: '100%',
        },
      }),
    },
    donateButtonContainer: {
      bottom: 40,
      justifyContent: 'center',
      alignItems: 'stretch',
      paddingHorizontal: 16,
      width: '100%',
      maxWidth: dimensions.maxButtonWidth,
      ...Platform.select({
        native: {
          position: 'absolute',
        },
        default: {
          position: 'fixed',
        },
      }),
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 40,
      paddingBottom: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      backgroundColor: theme.colors.background10,
    },
    location: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
    },
    card: {
      paddingHorizontal: 24,
      borderRadius: 32,
      backgroundColor: theme.colors.background10,
      marginTop: 2,
      paddingVertical: 16,
    },
  })
