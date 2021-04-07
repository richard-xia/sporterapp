import React, { useState } from 'react'
import axios from '../../axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LinkContainer } from 'react-router-bootstrap'
import { Image } from 'react-bootstrap'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import ViewModal from '../ViewModal'
import { baseURL } from '../../axios'
import classes from './Invite.module.css'

/*******************************************************************************
 * Invite Component
 * Component for accepting or denying invites inside UserInfo
 *******************************************************************************/

const Invite = ({ invite, model, removeInvite, addModel }) => {
  const [viewInviteModal, setViewInviteModal] = useState(false)

  function closeViewInviteModal() {
    setViewInviteModal(false)
  }

  // Accept the invite of the current model (group/game)
  const acceptInvite = (inviteId) => {
    axios
      .put(`/api/v1/users/${model}/invite/${invite._id}`)
      .then((res) => {
        removeInvite(inviteId, model)
        addModel(res.data.data, model)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }

  // Deny the invite of the current model (group/game)
  const denyInvite = (inviteId) => {
    axios
      .delete(`/api/v1/users/${model}/invite/${invite._id}`)
      .then(() => {
        removeInvite(inviteId, model)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }
  return (
    <div className={classes.container}>
      {model === 'games' ? (
        <div>
          <div className={classes.info}>
            <LinkContainer
              to={{
                pathname: `/api/v1/games/${invite.game}`,
              }}
            >
              <div>
                <Image
                  className={classes.icon}
                  src={`${baseURL}/uploads/${invite.photo}`}
                  style={{ maxHeight: '40px', maxWidth: '40px' }}
                />
                <p className={classes.name}>{invite.title}</p>
              </div>
            </LinkContainer>
            <p
              className={classes.message}
              onClick={() => setViewInviteModal(true)}
            >
              {invite.message}
            </p>
            <ViewModal
              showViewModal={viewInviteModal}
              closeViewModal={closeViewInviteModal}
              info={invite.message}
              title={invite.title}
              photo={invite.photo}
              id={invite.game}
              type={'games'}
            />
          </div>
          <div className={classes.options}>
            <FontAwesomeIcon
              className={classes.acceptIcon}
              icon={faCheckCircle}
              onClick={() => acceptInvite(invite._id)}
            />
            <FontAwesomeIcon
              className={classes.denyIcon}
              icon={faTimesCircle}
              onClick={() => denyInvite(invite._id)}
            />
          </div>
        </div>
      ) : null}
      {model === 'groups' ? (
        <div>
          <div className={classes.info}>
            <LinkContainer
              to={{
                pathname: `/api/v1/groups/${invite.group}`,
              }}
            >
              <div>
                <Image
                  className={classes.icon}
                  src={`${baseURL}/uploads/${invite.photo}`}
                  style={{ maxHeight: '40px', maxWidth: '40px' }}
                />
                <p className={classes.name}>{invite.name}</p>
              </div>
            </LinkContainer>
            <p
              className={classes.message}
              onClick={() => setViewInviteModal(true)}
            >
              {invite.message}
            </p>
            <ViewModal
              showViewModal={viewInviteModal}
              closeViewModal={closeViewInviteModal}
              info={invite.message}
              title={invite.name}
              photo={invite.photo}
              id={invite.group}
              type={'groups'}
            />
          </div>
          <div className={classes.options}>
            <FontAwesomeIcon
              className={classes.acceptIcon}
              icon={faCheckCircle}
              onClick={() => acceptInvite(invite._id)}
            />
            <FontAwesomeIcon
              className={classes.denyIcon}
              icon={faTimesCircle}
              onClick={() => denyInvite(invite._id)}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Invite
