import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgDraftFilled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#draft-filled_svg__a)">
      <Path
        fill="currentColor"
        d="M20 2a1 1 0 0 1 1 1v3.757l-8.999 9-.006 4.238 4.246.006L21 15.242V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16Zm1.778 6.808 1.414 1.414L15.414 18l-1.416-.002.002-1.412 7.778-7.778ZM12 12H7v2h5v-2Zm3-4H7v2h8V8Z"
      />
    </G>
    <Defs>
      <ClipPath id="draft-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgDraftFilled
