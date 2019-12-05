import React, { useState, useEffect } from 'react'

const pug = window.pug
const moment = window.moment

export default class PubForm extends React.Component {
  constructor(props) {
    super(props)

    this.monthNames = moment.months()

    this.defaultFormData = {
      'year': 2000,
      'month': 0,
      'title': 'allo',
      'authors': [''],
      'venue': ''
    }

    this.state = {
      formData: this.defaultFormData
    }

    this.handleUserInput = this.handleUserInput.bind(this)
  }

  onCloseButtonClick = e => {
    this.props.onCloseClick();
  }

  handleUserInput = e => {
    const fieldName = e.target.name
    const fieldValue = e.target.value
    const n = this.state.formData;
    switch (fieldName) {
      case 'year':
      case 'month':
      case 'title':
      case 'venue':
        n[fieldName] = fieldValue;
        this.setState({formData: n})
        break;
      case 'authors[]':
        break;
      default:
        break;
    }
  }

  addAuthor = e => {
    const n = this.state.formData;
    n.authors.push(['']);
    this.setState({formData: n});
  }

  render() {
    return pug`
      .modal(className="show-modal")
        .modal-content
          i.fa.fa-window-close.fa-2x.close-button(onClick=this.onCloseButtonClick)

          h2 Création d'une publication

          form
            label(for="year") Année:

            input(
              type="number",
              name="year",
              min="1900",
              max="2099",
              step="1",
              value=this.state.formData.year,
              placeholder="Année",
              onChange=this.handleUserInput)

            br

            label(for="month") Mois #{' '}

            select(name="month", value=this.state.formData.month, onChange=this.handleUserInput)
              option(value="")
                | - #{' '} Mois - #{' '}

              each monthName, i in this.monthNames
                option(key=monthName, value=i)= monthName.charAt(0).toUpperCase() + monthName.slice(1)

            br

            label(for="title") Titre #{':'}

            input(type="text",
              name="title",
              placeholder="Titre",
              value=this.state.formData.title,
              onChange=this.handleUserInput)

            br

            label(for="authors") Auteur #{':'}

            br

            each author, i in this.state.formData.authors
              .author-input(key="div" + author)
                input(
                  type="text",
                  name="authors[]"
                  placeholder="Auteur",
                  value=author,
                  onChange=this.handleUserInput)

              if i > 0
                .remove-author
                  i.fa.fa-minus.fa-3x

            .add-author(onClick=this.addAuthor)
              i.fa.fa-plus.fa-3x

            label(for="venue") Revue #{''}

            input(
              type="text",
              name="venue",
              placeholder="Revue",
              value=this.state.formData.venue,
              onChange=this.handleUserInput)

            br

            input(type="submit", value="Création d'une publication")
    `
  }
}

