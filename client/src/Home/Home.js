import React, { useState, useEffect } from 'react'

import './Home.css'

import Loader from '../Loader/Loader'

const moment = window.moment
const pug = window.pug
const fetch = window.fetch

export default () => {
  // À COMPLÉTER
  // 1- (DONE) Récupérer les nouvelles du service web http://localhost:3000/api/feed avec 'fetch' et avec l'entête 'accept-language' à 'fr'.
  // 2- (DONE) Une fois que les données ont été récupérées, le loading devient false
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeeds = async () => {
      const opts = {
        method: 'GET',
        headers: { 'accept-language' : 'fr' }
      }
  
      const response = await fetch('http://localhost:3000/api/feed', opts)
  
      const feeds = await response.json()
      
      return feeds
    }

    fetchFeeds().then(feeds => { setFeeds(feeds); setLoading(false); })
  }, [])

  return pug`
    .jumbotron
      p
        | Le
        strong  laboratoire Semantic IA
        |  est un laboratoire de recherche qui lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean eu nunc pretium, finibus quam in, varius urna. Nunc vestibulum at nibh at egestas. Nulla interdum iaculis dui, quis varius lacus elementum id. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Sed eu imperdiet felis. Etiam hendrerit id libero quis ultricies. Nunc molestie tellus ultrices elit molestie tincidunt. Mauris id interdum turpis. Nullam fermentum ornare arcu, id vehicula leo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus aliquam dignissim volutpat. Nunc sit amet varius risus. Curabitur ex libero, rhoncus tincidunt hendrerit et, feugiat ut purus.

      p Nunc id sodales odio, ut pretium tortor. Sed gravida semper est et finibus. Mauris vulputate fringilla nulla et pretium. Nulla facilisi. Maecenas scelerisque convallis dui tincidunt volutpat. Curabitur vitae feugiat tortor. Duis vitae turpis consequat, lacinia nisl vitae, lobortis nisi. Mauris aliquet, felis in blandit cursus, odio arcu suscipit sem, id blandit massa eros non nunc. Fusce ac sodales tellus, vel efficitur metus.

      p In congue, justo at auctor consequat, dolor eros laoreet augue, sit amet molestie felis massa sed nunc. Curabitur at nibh et ipsum facilisis molestie. Donec dictum dapibus diam, sed fringilla tellus tincidunt ut. Nam porttitor in diam ut dapibus. Cras sit amet diam odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit amet eros quis sem imperdiet suscipit. Fusce luctus turpis ut metus convallis, ac ornare augue fermentum. Phasellus aliquet, elit eu tempus aliquam, odio est tristique quam, quis luctus augue lorem sit amet lorem. Quisque tellus sem, rutrum vitae hendrerit in, tempus vitae neque. Morbi blandit sagittis risus a placerat.

    h2 Nouvelles

    .loading-container
      if loading
        Loader()

      else
        if feeds.length === 0
          p Aucune nouvelle

        else
          ul.news
            each feed in feeds
              if feed.type === 'seminar'
                li(key=feed._id)
                  .icon #[img(src="/img/presentation-icon.png")]
                  .text
                    .post-date= moment(feed.createdAt).format('LL')
                    .title
                      | Prochain séminaire: #{''}
                      a(href="#")= feed.title

                    .presentator= feed.presentator

                    .date= moment(feed.date).format('LLLL')

                    .location(dangerouslySetInnerHTML={__html: feed.location})

              else if feed.type === 'news'
                li(key=feed._id)
                  .icon #[i.fa.fa-file-text-o]
                  .text
                    .title(dangerouslySetInnerHTML={__html: feed.text})
  `
}
