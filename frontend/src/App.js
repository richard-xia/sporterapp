import React from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import GroupInfo from './components/groups/GroupInfo'
import UserInfo from './components/users/UserInfo'
import GameInfo from './components/games/GameInfo'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className='App'>
      <Router>
        <Container>
          <Route path='/api/v1/groups/:id' component={GroupInfo} />
          <Route path='/api/v1/games/:id' component={GameInfo} />
          <Route path='/api/v1/users/:id' component={UserInfo} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/' component={LandingPage} exact />
        </Container>
      </Router>
      <Footer />
    </div>
  )
}

export default App
