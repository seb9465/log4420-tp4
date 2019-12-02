import React, { useState, useEffect } from 'react'

import './Publication.css'

import PublicationTable from './PublicationTable'
import PublicationCreationModal from './PublicationCreationModal'
import Loader from '../Loader/Loader'

const pug = window.pug
const fetch = window.fetch

export default props => {

  // À COMPLÉTER
  // - (DONE) Récupérez des publications du service web http://localhost:3000/api/publications en utilisant les 'query parameters' de l'URL (avec props.location.search)
  // - (DONE) Une fois que les données ont été récupérées, le loading devient false
  // - (DONE) Migrez la table de publication dans la composante PublicationTable.
  // - (DONE) Faite correctement la gestion d'événement lorsqu'on change le type de trie, l'ordre de trie, le nombre d'éléments par page et la page en cours.
  // - (DONE) Si on clique sur "Ajouter une publication", affichez la composante 'PublicationCreationModal'
  // - Si on clique sur le bouton X de la modal, elle doit se fermer.
  // - Supprimez une publication si on clique sur le bouton de suppression et rechargez la page.
  // - Gestion du formulaire de création d'une publication.
  //   Si le formulaire a été correctement rempli, affichez la nouvelle publication dans la table.
  //   Si le serveur renvoie une erreur, alors affichez les erreurs.
  const [publications, setPublications] = useState({
    count: 0,
    publications: []
  })

  const [showModal, setShowModal] = useState(false)

  const [pagingOptions, setPagingOptions] = useState({
    'limit': 10,
    'pageNumber': 1,
    'sortBy': 'date',
    'orderBy': 'desc'
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublications = async () => {
      const options = {
        headers: { 'accept-language': 'fr' }
      }

      const response = await fetch(`http://localhost:3000/api/publications${props.location.search}`, options)

      const publications = await response.json()

      return publications
    }

    setLoading(true)

    fetchPublications().then(publications => {
      setPublications(publications)
      setLoading(false)
    })
  }, [props.location.search])

  const errors = []

  const numberOfPages = Math.ceil(publications.count / pagingOptions.limit)

  const previousPageNumber = pagingOptions.pageNumber === 1 ? pagingOptions.pageNumber : pagingOptions.pageNumber - 1
  const nextPageNumber = pagingOptions.pageNumber === numberOfPages ? pagingOptions.pageNumber : pagingOptions.pageNumber + 1

  // Fonction à exécuter si on change le type de trie: sort_by
  const fieldFilterHandler = e => {
    const search_params = new URLSearchParams(props.location.search)
    search_params.set('sort_by', e.target.value)
    props.history.push({
      pathname: props.location.pathname,
      search: '?' + search_params.toString()
    })
    const newPagingOptions = { ...pagingOptions, 'sortBy': e.target.value }
    setPagingOptions(newPagingOptions)
  }

  // Fonction à exécuter si on change l'ordre de trie: order_by
  const filterAscValueHandler = e => {
    const search_params = new URLSearchParams(props.location.search)
    search_params.set('order_by', e.target.value)
    props.history.push({
      pathname: props.location.pathname,
      search: '?' + search_params.toString()
    })
    const newPagingOptions = { ...pagingOptions, 'orderBy': e.target.value }
    setPagingOptions(newPagingOptions)
  }

  const elementsPerPageHandler = e => {
    const search_params = new URLSearchParams(props.location.search)
    search_params.set('limit', e.target.value)
    search_params.set('page', 1)
    props.history.push({
      pathname: props.location.pathname,
      search: '?' + search_params.toString()
    })
    const newPagingOptions = { ...pagingOptions, 'limit': Number(e.target.value), 'pageNumber': 1 }
    setPagingOptions(newPagingOptions)
  }

  const paginationClickHandler = e => {
    const search_params = new URLSearchParams(props.location.search)
    search_params.set('limit', pagingOptions.limit)
    search_params.set('page', e.target.dataset.pagenumber)
    props.history.push({
      pathname: props.location.pathname,
      search: '?' + search_params.toString()
    })
    const newPagingOptions = { ...pagingOptions, 'pageNumber': Number(e.target.dataset.pagenumber) }
    setPagingOptions(newPagingOptions)
  }

  const addPubBtnHandler = e => {
    setShowModal(true)
  }

  const closeModal = e => {
    setShowModal(false)
  }

  return pug`
    .loading-container
      if loading
        Loader(loading=loading)

      else
        h2 Publications

        if errors.length > 0
          .errors
            p Il y a des erreurs dans la soumission du formulaire. Veuillez les corriger.
            ul
              each err, i in errors
                li(key="error" + i)= err

        button.trigger(onClick=addPubBtnHandler) Ajouter une publication

        if showModal
          PublicationCreationModal(onCloseClick=closeModal)

        p
          | Trié par: #{''}
          select#fieldFilterSection(defaultValue=pagingOptions.sortBy, onChange=fieldFilterHandler)
            each option in ['date', 'title']
              option(key="option" + option, value=option)= option

        p
          | Ordonner par: #{''}
          select#filterAscValueSection(defaultValue=pagingOptions.orderBy, onChange=filterAscValueHandler)
            option(value="desc") décroissant
            option(value="asc") croissant

        PublicationTable(publications=publications)

        .pagination
          a.pagination-link(data-pagenumber=previousPageNumber,
            onClick=paginationClickHandler) &laquo;
          each page in [...Array(numberOfPages).keys()].map(p => p + 1)
            a.pagination-link(
              key="pagination-link-" + page,
              className=page == pagingOptions.pageNumber ? "active" : "",
              data-pagenumber=page,
              onClick=paginationClickHandler)= page

          a.pagination-link(data-pagenumber=nextPageNumber,
            onClick=paginationClickHandler) &raquo;

          p
            | Afficher
            select#elementsPerPageSection(defaultValue=pagingOptions.limit,
              onChange=elementsPerPageHandler)
              each value in [10, 20, 30, 50, 100]
                option(key="option" + value, value=value)= value

            | résultats par page
  `
}
