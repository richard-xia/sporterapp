import React, { useState, useEffect } from 'react'
import axios from '../../axios'
import { Redirect } from 'react-router'
import { Alert, Button, Card, Form } from 'react-bootstrap'
import classes from './Login.module.css'

/*******************************************************************************
 * Register Component
 * Component for registering users in the landing page
 *******************************************************************************/

const Register = ({ loginUser }) => {
  const [state, setState] = useState({
    //Contains the register form data
    email: '',
    registerPassword: '',
    confirmPassword: '',
    name: '',
  })

  const [emails, setEmails] = useState([]) //Contains the email of every registered user (for checking if an account exists)
  const [error, setError] = useState('') //Contains the error message if the user provides an incorrect field
  const [isRegistered, setIsRegistered] = useState(false) //Redirect user if register is successful
  const [registerFailed, setRegisterFailed] = useState(false) //Create an error message if register fails

  //Get the emails of all users
  useEffect(() => {
    axios.get('/api/v1/users/allEmails').then((res) => {
      setEmails(res.data.data)
    })
  }, [])

  //Handle the state of register form data
  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({ ...prevState, [id]: value }))
  }

  //Handles the register button click
  const registerUser = (e) => {
    e.preventDefault()
    if (emails.includes(state.email)) {
      //Check if email address is being used
      setError('This email address is already being used')
      setRegisterFailed(true)
    } else if (state.registerPassword !== state.confirmPassword) {
      //Check if passwords match
      setError('Passwords do not match')
      setRegisterFailed(true)
    } else {
      const registerData = {
        name: state.name,
        email: state.email,
        password: state.registerPassword,
      }
      axios
        .post('/api/v1/auth/register', registerData)
        .then((response) => {
          //If successful, set the token and redirect the user
          const { token } = response.data
          localStorage.setItem('jwtToken', token)
          setIsRegistered(true)
        })
        .catch((err) => {
          //If failed, return the error response from the server
          const error = err.response.data.error.split(':')[2]
          setError(error)
          setRegisterFailed(true)
        })
    }
  }

  return (
    <div>
      <Card className={classes.card}>
        <Form.Label>Register</Form.Label>
        {registerFailed ? <Alert variant={'danger'}>{error}</Alert> : null}
        <Form>
          <Form.Control
            onChange={handleChange}
            id='name'
            type='text'
            value={state.name}
            placeholder='Name'
          />
          <br />
          <Form.Control
            onChange={handleChange}
            id='email'
            type='email'
            value={state.email}
            placeholder='Email'
          />
          <br />
          <Form.Control
            onChange={handleChange}
            id='registerPassword'
            type='password'
            value={state.registerPassword}
            placeholder='Password'
          />
          <br />
          <Form.Control
            onChange={handleChange}
            id='confirmPassword'
            type='password'
            value={state.confirmPassword}
            placeholder='Confirm Password'
          />
        </Form>
        <Button
          className={classes.registerbutton}
          onClick={registerUser}
          variant='success'
        >
          Register
        </Button>
        <p onClick={() => loginUser()} className={classes.register}>
          Go back to login
        </p>
      </Card>
      {isRegistered ? <Redirect to='/dashboard' /> : null}
    </div>
  )
}

export default Register
