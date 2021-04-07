import React from 'react'
import classes from './Footer.module.css'
import { Image } from 'react-bootstrap'
import { baseURL } from '../axios'

/**********************************************************************
 * Footer Component
 * Component for displaying the footer of the application
 **********************************************************************/

const Footer = () => {
  function openGithub() {
    window.open('https://github.com/richard-xia/sporter')
  }

  return (
    <div className={classes.container}>
      <div className={classes.about}>
        <div style={{ float: 'center' }}>
          <p>About</p>

          <p>
            Sporter is a sports management application created by Richard Xia as
            an honours project for Carleton University. Please consider the
            health and safety and use the app responsibly and follow social
            gathering rules.
          </p>
        </div>
      </div>
      <div className={classes.links}>
        <div className={classes.linksdiv}>
          <Image
            src={`${baseURL}/uploads/github-brands.svg`}
            style={{
              maxHeight: '50px',
              maxWidth: '50px',
              marginRight: '25px',
              marginTop: '25px',
              cursor: 'pointer',
            }}
            onClick={() => openGithub()}
          />
        </div>
      </div>
    </div>
  )
}

export default Footer
