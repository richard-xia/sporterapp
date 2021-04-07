import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import Login from './auth/Login'
import Register from './auth/Register'
import { Image } from 'react-bootstrap'
import { baseURL } from '../axios'
import classes from './LandingPage.module.css'
import axios from '../axios'

/***********************************************************************************
 * Landing Page Component
 * First page loaded containing the Login and Register components
 **********************************************************************************/

const LandingPage = () => {
  const [register, setRegister] = useState(false)
  const [redirect, setRedirect] = useState(false)

  function registerUser() {
    setRegister(true)
  }

  function loginUser() {
    setRegister(false)
  }

  useEffect(() => {
    axios
      .get(`/api/v1/users/getDashboard`)
      .then((response) => {
        setRedirect(true)
      })
      .catch((err) => {
        setRedirect(false)
      })
  }, [])

  return (
    <div style={{ display: 'flex' }}>
      <div className={classes.display}>
        <p className={classes.title}>Sporter</p>
        <p>An application for finding and managing sports</p>
        <Image src={`${baseURL}/uploads/sports.png`} />
      </div>
      <div className={classes.login}>
        {register ? (
          <div>
            <Register loginUser={loginUser} />
          </div>
        ) : (
          <Login registerUser={registerUser} />
        )}
        {redirect ? <Redirect to='/dashboard' /> : null}
      </div>
    </div>
  )
}

export default LandingPage
