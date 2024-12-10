import * as React from 'react'
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgCloud = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <G clipPath="url(#cloud_svg__a)">
      <Path
        fill="currentColor"
        d="M17 21H7A6 6 0 0 1 5.008 9.34a7 7 0 1 1 13.984 0A6 6 0 0 1 17 21m0-12a5.001 5.001 0 1 0-9.994.243l.07 1.489-1.404.494A4.001 4.001 0 0 0 7 19h10a4 4 0 1 0-3.796-5.264l-1.898-.634A6 6 0 0 1 17 9"
      />
    </G>
    <Defs>
      <ClipPath id="cloud_svg__a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgCloud
