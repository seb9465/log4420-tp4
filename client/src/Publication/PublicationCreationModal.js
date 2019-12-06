import React from 'react'
import randomKey from './utils.js'

const pug = window.pug
const moment = window.moment

export default class PubForm extends React.Component {
  constructor(props) {
    super(props)

    this.monthNames = moment.months()
    this.defaultFormData = {
      'year': '',
      'month': '',
      'title': '',
      'authors': { [randomKey()] : '' },
      'venue': ''
    }
    this.handleUserInput = this.handleUserInput.bind(this)
    this.handleAuthorInput = this.handleAuthorInput.bind(this)
    this.submitForm = this.submitForm.bind(this)

    this.state = {
      formData: this.defaultFormData
    }
  }

  onCloseButtonClick = e => {
    this.props.onCloseClick();
  }

  handleUserInput = e => {
    const fieldName = e.target.name
    const fieldValue = e.target.value
    this.setState({ formData: {...this.state.formData, [fieldName]: fieldValue} })
  }

  handleAuthorInput = (e, key) => {
    this.setState({ formData: {...this.state.formData, authors: { ...this.state.formData.authors, [key]: e.target.value }}})
  }

  addAuthor = e => {
    this.setState({formData: { ...this.state.formData, authors: { ...this.state.formData.authors, [randomKey()]: '' }}})
  }

  removeAuthor = (e, key) => {
    this.setState({
      formData: { 
        ...this.state.formData, 
        authors: Object.fromEntries(Object.entries(this.state.formData.authors).filter(auth => auth[0] !== key))
      }
    })
  }

  submitForm = e => {
    e.preventDefault();
    this.props.onSubmitNewPub({ ...this.state.formData, authors: Object.values(this.state.formData.authors) })
    this.props.onCloseClick();
  }

  render() {
    return pug`
      .modal(className=this.props.showModal ? "show-modal" : "")
        .modal-content
          i.fa.fa-window-close.fa-2x.close-button(onClick=this.onCloseButtonClick)

          h2 Création d'une publication

          form(onSubmit=this.submitForm)
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

            each author, i in Object.entries(this.state.formData.authors)
              .author-input(key="div" + author[0])
                input(
                  type="text",
                  name="authors[]"
                  placeholder="Auteur",
                  value=author[1],
                  onChange=(e) => this.handleAuthorInput(e, author[0]))

              if i > 0
                .remove-author(onClick=(e) => this.removeAuthor(e, author[0]))
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

