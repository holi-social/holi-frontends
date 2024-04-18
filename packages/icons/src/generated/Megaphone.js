import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

const SvgMegaphone = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 20 19" {...props}>
    <Path
      fill="currentColor"
      d="M6 14s7 1 10 4h1a1 1 0 0 0 1-1v-6.063a2 2 0 0 0 0-3.874V1a1 1 0 0 0-1-1h-1C13 3 6 4 6 4H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1l1 5h2v-5Zm2-8.339c.683-.146 1.527-.35 2.44-.617 1.678-.494 3.81-1.271 5.56-2.47v12.851c-1.75-1.198-3.883-1.975-5.56-2.469A33.967 33.967 0 0 0 8 12.34V5.66ZM2 6h4v6H2V6Z"
    />
  </Svg>
)
export default SvgMegaphone
