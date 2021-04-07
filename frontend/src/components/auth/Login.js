import React, { useState } from 'react'
import axios from '../../axios'
import { Redirect } from 'react-router'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import classes from './Login.module.css'

/*******************************************************************************
 * Login Component
 * Component for logging in users in the landing page
 *******************************************************************************/

const Login = ({ registerUser }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false) //If the user logs in redirect to dashboard
  const [loginFailed, setLoginFailed] = useState(false) //If the user provides incorrect information send an alert

  //Handles the state of email and password provided by the user
  const [state, setState] = useState({
    email: '',
    password: '',
  })
  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({ ...prevState, [id]: value }))
  }

  //Login function for when the user clicks 'login'
  function loginUser() {
    const loginData = {
      email: state.email,
      password: state.password,
    }
    axios
      .post('/api/v1/auth/login', loginData)
      .then((response) => {
        const { token } = response.data
        localStorage.setItem('jwtToken', token)
        setIsLoggedIn(true)
      })
      .catch((err) => {
        setLoginFailed(true)
      })
  }

  return (
    <div>
      <Card className={classes.card}>
        <Form.Label>Login</Form.Label>
        {loginFailed ? (
          <Alert variant={'danger'}>
            Please enter a valid email and password
          </Alert>
        ) : null}
        <Form onSubmit={loginUser}>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              placeholder='email'
              onChange={handleChange}
              id='email'
              type='email'
              value={state.email}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              onChange={handleChange}
              id='password'
              type='password'
              value={state.password}
              placeholder='password'
            />
          </Form.Group>
        </Form>
        <Button
          className={classes.button}
          onClick={loginUser}
          variant='success'
        >
          Login
        </Button>
        <p onClick={() => registerUser()} className={classes.register}>
          Don't have an account? Sign up
        </p>
      </Card>
      {isLoggedIn ? <Redirect to='/dashboard' /> : null}
    </div>
  )
}

export default Login
