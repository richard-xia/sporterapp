import React from 'react'
import axios from '../../axios'
import { Image } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import classes from './InviteUser.module.css'
import { baseURL } from '../../axios'

/*******************************************************************************
 * InviteUser Component
 * Component that allows the user to send an invite inside GroupInfo and GameInfo
 *******************************************************************************/

const InviteUser = ({ user, modelType, modelId, removeInviteUser }) => {
  const sendInvite = () => {
    axios
      .post(`/api/v1/${modelType}/${modelId}/invite/${user._id}`)
      .then((res) => {
        removeInviteUser(user._id)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }
  return (
    <div className={classes.container}>
      <Image
        src={`${baseURL}/uploads/${user.photo}`}
        className={classes.userIcon}
        roundedCircle
      />
      <p>{user.name}</p>
      <FontAwesomeIcon
        className={classes.addicon}
        icon={faUserPlus}
        onClick={() => sendInvite()}
      />
    </div>
  )
}

export default InviteUser
