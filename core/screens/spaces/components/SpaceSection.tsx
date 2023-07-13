import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2 } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceSectionProps = {
  title: string
  editable?: boolean
  onPressEdit?: (event: React.SyntheticEvent | GestureResponderEvent) => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const SpaceSection = ({
  title,
  editable,
  onPressEdit,
  style,
  testID = 'space-section',
  children,
}: React.PropsWithChildren<SpaceSectionProps>) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.wrapper, style]} testID={testID}>
      <View style={styles.headingContainer}>
        <HoliHeading level="2" style={styles.heading}>
          {title}
        </HoliHeading>
        {editable && (
          <HoliButton
            style={styles.editButton}
            label={t('global.edit')}
            type="secondary"
            inline
            onPress={onPressEdit}
            testID={`btn-${testID}`}
          >
            <HoliText style={styles.editButtonText}>{t('global.edit')}</HoliText>
            <HoliIcon icon={Edit2} />
          </HoliButton>
        )}
      </View>
      {children && <View style={styles.body}>{children}</View>}
    </View>
  )
}
export default SpaceSection

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
    borderTopColor: colors.background30,
    paddingVertical: 32,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontWeight: '400',
    flex: 1,
  },
  body: {
    marginTop: 24,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexShrink: 1,
  },
  editButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    marginRight: 6,
  },
})
