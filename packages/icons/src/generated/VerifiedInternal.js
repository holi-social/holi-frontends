import * as React from 'react'
import Svg, { Rect, G, Path, Defs, ClipPath } from 'react-native-svg'
const SvgVerifiedInternal = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Rect width={19} height={19} x={0.5} y={0.5} fill="#FDFD80" rx={3.5} />
    <Rect width={19} height={19} x={0.5} y={0.5} stroke="currentColor" rx={3.5} />
    <G clipPath="url(#verified-internal_svg__a)">
      <Path
        fill="currentColor"
        d="M5 6.429c0-.675 0-1.013.121-1.27.107-.228.277-.412.486-.528.237-.131.548-.131 1.17-.131h.612c.622 0 .933 0 1.171.131.21.116.379.3.486.527.12.258.12.596.12 1.27V8.72c0 .5.278.904.834.904q.834 0 .833-.904c0-.904.856-1.808 2.084-1.808 1.227 0 2.083 1.08 2.083 2.41v3.768c0 1.332-.856 2.411-2.083 2.411s-2.084-1.08-2.084-2.411v-1.055c0-.5-.373-.904-.833-.904s-.833.405-.833.904v1.386c0 .676 0 1.013-.121 1.271a1.16 1.16 0 0 1-.486.527c-.238.131-.549.131-1.171.131h-.611c-.622 0-.934 0-1.171-.131-.21-.116-.38-.3-.486-.527C5 14.433 5 14.096 5 13.421z"
      />
    </G>
    <Defs>
      <ClipPath id="verified-internal_svg__a">
        <Path fill="#fff" d="M16 16H4V4h12z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default SvgVerifiedInternal
