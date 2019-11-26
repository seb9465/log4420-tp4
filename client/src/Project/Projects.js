import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import './Projects.css'

import Loader from '../Loader/Loader'

const pug = window.pug
const fetch = window.fetch

const ProjectDescription = props => {
  const project = props.project

  return pug`
    li
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

export default () => {
  // À COMPLÉTER
  // 1- Récupérer les projets du service web http://localhost:3000/api/projects avec 'fetch' et avec l'entête 'accept-language' à 'fr'.
  // 2- Une fois que les données ont été récupérées, le loading devient false
  // 3- Vous remarquerez qu'on duplique la description de chaque projet dans le Pug.
  //    Évitez la duplication en créant une nouvelle composante React et insérez la dans le Pug ci-bas.

  const [loading, setLoading] = useState(true);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [pastProjects, setPastProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const options = {
        headers: { 'accept-language' : 'fr' }
      }

      const response = await fetch('http://localhost:3000/api/projects', options);

      const proj = await response.json();

      return proj;
    }

    fetchProjects().then(projects => {
    setCurrentProjects(
      projects
        .filter(p => p.current)
        .sort((p1, p2) => p1.year < p2.year ? 1 : p1.year > p2.year ? -1 : 0));
    setPastProjects(
      projects
        .filter(p => !p.current)
        .sort((p1, p2) => p1.year < p2.year ? 1 : p1.year > p2.year ? -1 : 0));
	  setLoading(false);
    })
  }, [])

  return pug`
    .loading-container
      if loading
        Loader()

      else
        h1 Projets en cours

        if currentProjects.length === 0
          p Aucuns projets en cours

        else
          ul.projects
            each project in currentProjects
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

        h1 Projets passés

        if pastProjects.length === 0
          p Aucuns projets passés

        else
          ul.projects
            each project in pastProjects
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
