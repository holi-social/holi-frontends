import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgTranslate = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <Path
      fill="currentColor"
      d="M3.332 10.003v1.333a1.334 1.334 0 0 0 1.233 1.33l.1.003h2v1.334h-2A2.667 2.667 0 0 1 2 11.336v-1.333zm8.667-3.334 2.933 7.334h-1.437l-.8-2H9.968l-.8 2H7.734l2.932-7.334zm-.667 1.924-.831 2.076h1.661zm-6-7.257v1.333h2.667v4.667H5.332v2H3.999v-2H1.332V2.669h2.667V1.336zm6 .667a2.666 2.666 0 0 1 2.667 2.666v1.334h-1.334V4.669a1.333 1.333 0 0 0-1.333-1.333h-2V2.003zm-7.333 2H2.665v2H4zm2.666 0H5.332v2h1.333z"
    />
  </Svg>
)
export default SvgTranslate
