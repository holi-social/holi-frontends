import React from 'react'

import { HoliWebViewProps } from '@holi/core/screens/spaces/components/HoliWebView.shared'

const HoliWebView: React.VFC<HoliWebViewProps> = ({ uri, style }) => {
  return <iframe style={style} src={uri} />
}

export default HoliWebView
