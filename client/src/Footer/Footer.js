import React from 'react'

import './Footer.css'

const pug = window.pug

export default () => {
  return pug`
    footer.main
      p Site privé
      p LOG4420 - Polytechnique Montréal, Québec
  `
}
