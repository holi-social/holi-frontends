import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgQuestion = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 21 21" {...props}>
    <Path
      fill="currentColor"
      d="M10.5 18.834a8.333 8.333 0 1 1 0-16.667 8.333 8.333 0 0 1 0 16.667m0-1.667a6.667 6.667 0 1 0 0-13.333 6.667 6.667 0 0 0 0 13.333M9.665 13h1.667v1.667H9.666zm1.667-1.37v.537H9.666v-1.25a.833.833 0 0 1 .833-.833 1.251 1.251 0 1 0-1.225-1.495L7.639 8.26a2.918 2.918 0 1 1 3.694 3.369"
    />
  </Svg>
)
export default SvgQuestion
