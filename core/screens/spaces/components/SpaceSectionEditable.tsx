import type React from 'react'
import { useTranslation } from 'react-i18next'
import { type GestureResponderEvent, StyleSheet, View } from 'react-native'

import SpaceSection, { type SpaceSectionProps } from '@holi/core/screens/spaces/components/SpaceSection'
import { Edit2 } from '@holi/icons/src/generated'
import { Button } from 'holi-bricks/components/button'

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
          <View style={styles.editButton}>
            <Button
              label={t('global.edit')}
              variant="secondary"
              inline
              onPress={onEditPress}
              testID={`btn-${props.testID}`}
              icon={Edit2}
            />
          </View>
        )
      }
    />
  )
}
export default SpaceSectionEditable

const styles = StyleSheet.create({
  editButton: {
    paddingLeft: 12,
  },
})
