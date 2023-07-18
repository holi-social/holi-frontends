import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgNotification3 = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#notification-3_svg__a)">
      <Path
        fill="currentColor"
        d="M20 17h2v2H2v-2h2v-7a8 8 0 1 1 16 0v7Zm-2 0v-7a6 6 0 1 0-12 0v7h12Zm-9 4h6v2H9v-2Z"
      />
    </G>
    <Defs>
      <ClipPath id="notification-3_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgNotification3
