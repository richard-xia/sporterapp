import React from 'react'
import { Link } from 'react-router-dom'
import { Nav } from 'react-bootstrap'

/*******************************************************************************
 * Login Component
 * Header component found in the "Account" dropdown for logging out users
 *******************************************************************************/

const Logout = () => {
  return (
    <Nav.Link
      id={'logout'}
      as={Link}
      onClick={() => localStorage.removeItem('jwtToken')}
      style={{ marginLeft: '13px' }}
      to={'/'}
    >
      Logout
    </Nav.Link>
  )
}

export default Logout
