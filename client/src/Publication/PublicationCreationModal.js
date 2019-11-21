import React, { useState } from 'react'

const pug = window.pug
const moment = window.moment

export default props => {
  const monthNames = moment.months()

  const defaultFormData = {
    'year': '',
    'month': '',
    'title': '',
    'authors': [''],
    'venue': ''
  }

  const formData = defaultFormData

  return pug`
    .modal(className="show-modal")
      .modal-content
        i.fa.fa-window-close.fa-2x.close-button

        h2 Création d'une publication

        form
          label(for="year") Année:

          input(
            type="number",
            name="year",
            min="1900",
            max="2099",
            step="1",
            value=formData.year,
            placeholder="Année")

          br

          label(for="month") Mois #{' '}

          select(name="month", value=formData.month)
            option(value="")
              | - #{' '} Mois - #{' '}

            each monthName, i in monthNames
              option(key=monthName, value=i)= monthName.charAt(0).toUpperCase() + monthName.slice(1)

          br

          label(for="title") Titre #{':'}

          input(type="text",
            name="title",
            placeholder="Titre",
            value=formData.title)

          br

          label(for="authors") Auteur #{':'}

          br

          each author, i in formData.authors
            .author-input(key="div" + author)
              input(
                type="text",
                name="authors[]"
                placeholder="Auteur",
                value=author)

            if i > 0
              .remove-author
                i.fa.fa-minus.fa-3x

          .add-author
            i.fa.fa-plus.fa-3x

          label(for="venue") Revue #{''}

          input(
            type="text",
            name="venue",
            placeholder="Revue",
            value=formData.venue)

          br

          input(type="submit", value="Création d'une publication")
  `
}

