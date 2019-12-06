import React from 'react'
import { Link } from 'react-router-dom'

const pug = window.pug

const ProjectDescription = props => {
  const project = props.project

  return pug`
    li(key=project._id)
      span
        = project.student
        | #{', '}

      Link(to="/projects/" + project._id)= project.title
      footer.meta
        p
          | Directeur(e): #{''}
          = project.supervisor

        if project.cosupervisor
          p
            | Co-directeur(e)(s): #{''}
            = project.cosupervisor
  `
}

export default ProjectDescription