import React from 'react'
import { NavLink } from 'react-router-dom'

import './Header.css'

const pug = window.pug

export default props => {
  return pug`
    header
      div#logo-container
        img#logo(src="/img/logo-coding.png", alt="Logo de Polydata")
        div#hdr
          p#sitetitle Labo Semantic IA
          p#subtitle
            | Intelligence artificielle
            br
            | Web sémantique

      nav
        ul.links
          li
            NavLink#home-link(exact=true, activeClassName="active", to="/") Accueil

          li
            NavLink#projects-link(activeClassName="active", to="/projects") Projets

          li
            NavLink#publications-link(to="/publications") Publications
    `
}
