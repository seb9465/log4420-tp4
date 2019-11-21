import React, { Suspense } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import './App.css'

import Loader from './Loader/Loader'
import Header from './Header/Header'
import Home from './Home/Home'
import Projects from './Project/Projects'
import Project from './Project/Project'
import Publication from './Publication/Publication'
import Footer from './Footer/Footer'

// here app catches the suspense from page in case translations are not yet loaded
function App () {
  return (
    <Suspense fallback={<Loader />}>
      <div className='container'>
        <Router>
          <div>
            <Header />

            <main>
              <Route exact path='/' component={Home} />
              <Route exact path='/projects' component={Projects} />
              <Route exact path='/projects/:id' component={Project} />
              <Route exact path='/publications' component={Publication} />
            </main>

            <Footer />
          </div>
        </Router>
      </div>
    </Suspense>
  )
}

export default App
