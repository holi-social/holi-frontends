import * as React from 'react'
import Svg, { Path } from 'react-native-svg'
const SvgParent = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <Path
      fill="currentColor"
      d="M7 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m0 2a4.5 4.5 0 1 1 0-9.002A4.5 4.5 0 0 1 7 11m10.5 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4m0 2a4 4 0 1 1 0-8 4 4 0 0 1 0 8m2.5 6v-.5a2.5 2.5 0 0 0-5 0v.5h-2v-.5a4.501 4.501 0 0 1 8.657-1.722c.227.546.343 1.131.343 1.722v.5zm-10 0v-4a3 3 0 0 0-6 0v4H2v-4a5 5 0 1 1 10 0v4z"
    />
  </Svg>
)
export default SvgParent
