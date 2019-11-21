import React from 'react'
import { css } from '@emotion/core'
import ClipLoader from 'react-spinners/ClipLoader'

const pug = window.pug

const override = css`
`

// loading component for suspense fallback
export default props => {
  const size = props.size ? props.size : 150
  return pug`
    .sweet-loading
      ClipLoader(css=override, sizeUnit="px", size=size, color="#4A90E2", loading=props.loading)
  `
}
