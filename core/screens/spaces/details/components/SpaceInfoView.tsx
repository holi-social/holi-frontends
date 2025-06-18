import { ChipLabel } from 'holi-bricks/components/chips'
import type React from 'react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import SpacePublicLink from '@holi/core/screens/spaces/components/SpacePublicLink'
import SpaceSection from '@holi/core/screens/spaces/components/SpaceSection'
import SpaceWelcome from '@holi/core/screens/spaces/details/components/SpaceWelcome'
import SpacesHorizontalSlider from '@holi/core/screens/spaces/discover/components/SpacesHorizontalSlider'
import SpacesSeeMore from '@holi/core/screens/spaces/discover/components/SpacesSeeMore'
import type { Paged } from '@holi/core/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, At, Information, Phone } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'
import { Button } from 'holi-bricks/components/button'
import type { RelatedSpaceFragment, Space } from '@holi/api/graphql/graphql-codegen'
import type { User } from '@holi/core/domain/shared/types'

type SpaceInfoViewProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const RELATED_SPACE_CARD_WIDTH = 256

const SpaceInfoView: React.FC<SpaceInfoViewProps> = ({ space, style }: SpaceInfoViewProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme

  const links = space.links || []

  const hasManyLinkedSpaces = !!(space.childSpaces && space.childSpaces.totalResults > 4)

  const navigateToRelatedSpaces = useCallback(() => {
    navigate(`/spaces/${space.id}/relatedSpaces`)
  }, [navigate, space.id])

  return (
    <View style={style}>
      <SpaceWelcome space={space} />

      {!!space.parentSpace && <NetworkSpaceReference networkSpace={space.parentSpace as RelatedSpaceFragment} />}

      {!!space.childSpaces?.data?.length && (
        <LinkedSpacesReference
          id={space.id}
          networkSpace={space.parentSpace}
          linkedSpaces={space.childSpaces}
          showSeeMore={hasManyLinkedSpaces}
          onSeeMorePress={navigateToRelatedSpaces}
        />
      )}

      {!!space.topicsV2?.length && (
        <SpaceSection title={t('spaces.spaceDetails.topics')}>
          <View style={styles.listContainer}>
            {space.topicsV2?.map((topic) => (
              <ChipLabel key={topic} color="green">
                {t(`topic.${topic}`)}
              </ChipLabel>
            ))}
          </View>
        </SpaceSection>
      )}

      {space.location && (
        <SpaceSection title={t('spaces.spaceDetails.location')}>
          <HoliText>{space.location}</HoliText>
        </SpaceSection>
      )}

      {(!!space.contactDescription || !!space.contactEmail || !!space.contactPhone) && (
        <SpaceSection title={t('spaces.spaceDetails.contact')}>
          <View style={styles.contactWrapper}>
            {!!space.contactDescription && <HoliText>{space.contactDescription}</HoliText>}
            {!!space.contactEmail && (
              <View style={styles.contactContainer}>
                <HoliIcon icon={At} colorOverride={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactEmail}
                </HoliText>
              </View>
            )}
            {!!space.contactPhone && (
              <View style={styles.contactContainer}>
                <HoliIcon icon={Phone} colorOverride={colors.foreground20} style={styles.contactIcon} />
                <HoliText size="small" bold>
                  {space.contactPhone}
                </HoliText>
              </View>
            )}
          </View>
        </SpaceSection>
      )}

      {!!links.length && (
        <SpaceSection title={t('spaces.spaceDetails.publicLinks')}>
          <View style={styles.listContainer}>
            {links.map((link, index) => (
              <SpacePublicLink key={`link_${index}`} link={link} style={styles.link} />
            ))}
          </View>
        </SpaceSection>
      )}
    </View>
  )
}

const NetworkSpaceReference: React.FC<{ networkSpace: RelatedSpaceFragment }> = (props) => {
  const { t } = useTranslation()
  return (
    <SpaceSection title={t('spaces.spaceDetails.networkSpace')}>
      <HoliBlockItem
        {...props.networkSpace}
        label={props.networkSpace.title}
        imageElement={<SpaceAvatar space={props.networkSpace} size="lg" />}
        users={props.networkSpace.members.data.map((member) => member.user) as User[]}
        totalUserCount={props.networkSpace.members.totalResults}
        href={`/spaces/${props.networkSpace.id}`}
        testID="main-space-link"
      />
    </SpaceSection>
  )
}

const ViewAllButton: React.FC<{ id: string }> = (props) => {
  const { t } = useTranslation()
  return (
    <View>
      <HoliLink
        label={t('spaces.spaceDetails.linkedSpaces.viewAll')}
        testID="related-spaces-view-all-btn"
        href={`/spaces/${props.id}/relatedSpaces`}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
          <HoliText>{t('spaces.spaceDetails.linkedSpaces.viewAll')}</HoliText>
          <HoliIcon icon={ArrowRightS} size={Spacing.lg} />
        </View>
      </HoliLink>
    </View>
  )
}

const LinkedSpacesCarousel: React.FC<{
  onSeeMorePress: () => void
  linkedSpaces: Paged<RelatedSpaceFragment>
  showMoreCard: boolean
}> = (props) => (
  <SpacesHorizontalSlider
    cardWidth={RELATED_SPACE_CARD_WIDTH}
    slideGap={8}
    seeMoreButton={
      props.showMoreCard ? (
        <SpacesSeeMore
          style={{ paddingVertical: Spacing['3xs'] }}
          onPress={props.onSeeMorePress}
          testID={'related-spaces-see-more'}
        />
      ) : undefined
    }
    style={{ width: '100%' }}
    paddingVertical={0}
    testID="related-spaces-slider"
  >
    {props.linkedSpaces.data.map((space) => (
      <HoliBlockItem
        key={space.id}
        label={space.title}
        title={space.title}
        subtitle={space.location}
        description={space.description}
        imageSrc={space.cover}
        imageBlurhash={space.coverBlurhash}
        users={space.members.data.map((membership) => membership.user) as User[]}
        href={`/spaces/${space.name}`}
        size="large"
        totalUserCount={space.members.totalResults}
        cardWidthForImageScaling={RELATED_SPACE_CARD_WIDTH}
        testID="related-space-item"
      />
    ))}
  </SpacesHorizontalSlider>
)

const LinkedSpacesReference: React.FC<{
  id: string
  networkSpace: RelatedSpaceFragment | undefined
  linkedSpaces: Paged<RelatedSpaceFragment>
  showSeeMore: boolean
  onSeeMorePress: () => void
}> = (props) => {
  const { t } = useTranslation()
  const {
    show: showAboutSpacesRelationShipModal,
    hide: hideAboutSpacesRelationShipModal,
    props: aboutSpacesRelationShipModalProps,
  } = useModalState()

  return (
    <SpaceSection
      title={t('spaces.spaceDetails.linkedSpaces')}
      actionButton={props.showSeeMore && <ViewAllButton id={props.id} />}
      style={!!props.networkSpace && styles.linkedSpacesSection}
    >
      <LinkedSpacesCarousel
        onSeeMorePress={props.onSeeMorePress}
        linkedSpaces={props.linkedSpaces}
        showMoreCard={props.showSeeMore}
      />

      <View>
        <HoliGap size="m" />
        <HoliButton
          label={t('spaces.spaceDetails.linkedSpaces.relationship.title')}
          transparent
          onPress={showAboutSpacesRelationShipModal}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <HoliText>{t('spaces.spaceDetails.linkedSpaces.relationship.title')}</HoliText>
            <HoliGap size="xxs" direction="horizontal" />
            <HoliIcon icon={Information} />
          </View>
        </HoliButton>
      </View>

      <HoliModal
        {...aboutSpacesRelationShipModalProps}
        label={t('spaces.spaceDetails.linkedSpaces.relationship.title')}
        testID="about-spaces-relationship-modal"
      >
        <HoliContainer>
          <HoliHeading size="l">{t('spaces.spaceDetails.linkedSpaces.relationship.modal.title')}</HoliHeading>
          <HoliGap size="xs" />
          <HoliText>{t('spaces.spaceDetails.linkedSpaces.relationship.modal.description')}</HoliText>
          <HoliGap size="s" />
          <Button
            label={t('spaces.spaceDetails.linkedSpaces.relationship.modal.close')}
            onPress={hideAboutSpacesRelationShipModal}
          />
          <HoliGap size="s" />
        </HoliContainer>
      </HoliModal>
    </SpaceSection>
  )
}

export default SpaceInfoView

const styles = StyleSheet.create({
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
    gap: Spacing['3xs'],
  },
  link: {
    marginRight: Spacing['sm'],
    marginBottom: Spacing['sm'],
  },
  linkedSpacesSection: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactWrapper: {
    flex: 1,
    gap: Spacing['xs'],
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
