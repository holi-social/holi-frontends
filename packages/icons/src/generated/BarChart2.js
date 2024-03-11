import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgBarChart2 = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 14 14" {...props}>
    <Path
      fill="currentColor"
      d="M1.166 7.583h3.5v4.667h-3.5V7.583Zm8.167-2.916h3.5v7.583h-3.5V4.667ZM5.249 1.75h3.5v10.5h-3.5V1.75Zm-2.916 7v2.333h1.166V8.75H2.333Zm4.083-5.833v8.166h1.167V2.917H6.416Zm4.083 2.916v5.25h1.167v-5.25h-1.167Z"
    />
  </Svg>
)
export default SvgBarChart2
