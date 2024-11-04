import { Text } from 'holi-bricks/components/text/Text'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useTheme } from '@holi/ui/styles/theme'

import { getCommonStyles } from '@holi-apps/goodnews/common_styles'

export type GoodNewsHeaderProps = {
  formattedDate?: string | undefined
}

const GoodNewsHeader: React.FC<GoodNewsHeaderProps> = ({ formattedDate = undefined }) => {
  const { t } = useTranslation()
  const title = t('goodnews:app.name')
  const { theme } = useTheme()
  const { colors } = theme
  const commonStyles = useMemo(() => getCommonStyles(theme), [theme])

  return (
    <View>
      <View style={commonStyles.headerTextShadow}>
        <Text color={colors.light} size="md">
          {title}
        </Text>
      </View>
      {formattedDate && (
        <View style={[commonStyles.headerTextShadow, { alignSelf: 'center' }]}>
          <Text size="xs" color={colors.light}>
            {formattedDate}
          </Text>
        </View>
      )}
    </View>
  )
}

export default GoodNewsHeader
