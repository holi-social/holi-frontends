import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg'

const SvgFilter3Filled = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#filter-3-filled_svg__a)">
      <Path fill="currentColor" d="M10 18h4v-2h-4v2ZM3 6v2h18V6H3Zm3 7h12v-2H6v2Z" />
    </G>
    <Defs>
      <ClipPath id="filter-3-filled_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgFilter3Filled
