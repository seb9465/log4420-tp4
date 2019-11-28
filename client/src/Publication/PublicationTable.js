import React from 'react'

import './PublicationTable.css'

const pug = window.pug

export default props => {
  const publications = props.publications;

  return pug`
    table.publications
      tbody
        each pub, i in publications.publications
          tr(key=pub._id)
            td
              .del-icon(data-id=pub._id) #[i.fa.fa-trash-o.fa-2x]

            td
              span.annee= pub.year

              br

              if pub.month
                span.mois= pub.month

            td.publication
              p.pubtitle= pub.title

              p.authors= pub.authors.join(', ')

              p.venuetype

              p.venue
                i= pub.venue
                `
}
