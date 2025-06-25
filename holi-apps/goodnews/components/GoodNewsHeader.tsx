import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

import { getCommonStyles } from '@holi-apps/goodnews/common_styles'

export type GoodNewsHeaderProps = {
  formattedDate?: string | undefined
}

const GoodNewsHeader: React.FC<GoodNewsHeaderProps> = ({ formattedDate = undefined }) => {
  const { t } = useTranslation()
  const title = t('goodnews.app.name')
  const { theme } = useTheme()
  const { colors } = theme
  const commonStyles = useMemo(() => getCommonStyles(theme), [theme])

  return (
    <View>
      <HoliText style={[commonStyles.headerTextShadow, { color: colors.light }]}>{title}</HoliText>
      {formattedDate && (
        <HoliText
          size="extrasmall"
          style={[commonStyles.headerTextShadow, { color: colors.light, alignSelf: 'center' }]}
          testID="goodnews-header-date"
        >
          {formattedDate}
        </HoliText>
      )}
    </View>
  )
}

export default GoodNewsHeader
