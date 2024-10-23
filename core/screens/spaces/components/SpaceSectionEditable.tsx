import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleSheet } from 'react-native'

import SpaceSection, { type SpaceSectionProps } from '@holi/core/screens/spaces/components/SpaceSection'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Edit2 } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface SpaceSectionEditableProps extends Omit<SpaceSectionProps, 'actionButton'> {
  onEditPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const SpaceSectionEditable = ({ onEditPress, ...props }: React.PropsWithChildren<SpaceSectionEditableProps>) => {
  const { t } = useTranslation()

  return (
    <SpaceSection
      {...props}
      actionButton={
        onEditPress && (
          <HoliButton
            label={t('global.edit')}
            type="secondary"
            inline
            onPress={onEditPress}
            style={styles.editButton}
            testID={`btn-${props.testID}`}
          >
            <HoliText style={styles.editButtonText}>{t('global.edit')}</HoliText>
            <HoliIcon icon={Edit2} />
          </HoliButton>
        )
      }
    />
  )
}
export default SpaceSectionEditable

const styles = StyleSheet.create({
  editButtonText: {
    marginRight: 6,
  },
  editButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
})
