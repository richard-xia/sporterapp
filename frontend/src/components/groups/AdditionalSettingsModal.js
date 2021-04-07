import React, { useState } from 'react'
import axios from '../../axios'
import { Button, Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'

/****************************************************************************************
 * GameSettings Component
 * Additional settings modal component for selecting winner and confirming to delete game
 ****************************************************************************************/

function GameSettings({
  group,
  type,
  showAdditionalSettingsModal,
  closeAdditionalSettingsModal,
}) {
  const [redirect, setRedirect] = useState(false) //Redirect user to dashboard if game is deleted
  //Delete the group when user clicks on 'Delete Group' button and confirms
  function deleteGroup() {
    axios.delete(`/api/v1/groups/${group._id}`).then((res) => {
      setRedirect(true)
    })
  }
  function leaveGroup() {
    axios.put(`/api/v1/users/leaveGroup/${group._id}`).then((res) => {
      setRedirect(true)
    })
  }

  function allowAllCreateGames() {
    axios
      .put(`/api/v1/groups/${group._id}/role`, { role: 'createGames' })
      .then((res) => {
        window.location.reload(true)
      })
    closeAdditionalSettingsModal()
  }

  function allowAllInviteUsers() {
    axios
      .put(`/api/v1/groups/${group._id}/role`, { role: 'inviteUsers' })
      .then((res) => {
        window.location.reload(true)
      })
    closeAdditionalSettingsModal()
  }

  return (
    <Modal
      show={showAdditionalSettingsModal}
      onHide={closeAdditionalSettingsModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      {type === 'delete' ? (
        <Modal.Body>
          {/* Modal body confirming if user wants to delete group */}
          <div>
            <Modal.Title>
              Are you sure you want to delete this group?
            </Modal.Title>
            <br />
            <Button
              style={{ marginLeft: '120px' }}
              variant='danger'
              onClick={deleteGroup}
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: '50px' }}
              variant='info'
              onClick={closeAdditionalSettingsModal}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      ) : null}
      {type === 'leave' ? (
        <Modal.Body>
          {/* Modal body confirming if user wants to delete group */}
          <div>
            <Modal.Title>Are you sure you want to leave the group?</Modal.Title>
            <br />
            <Button
              style={{ marginLeft: '120px' }}
              variant='danger'
              onClick={leaveGroup}
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: '50px' }}
              variant='info'
              onClick={closeAdditionalSettingsModal}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      ) : null}
      {type === 'createGames' ? (
        <Modal.Body>
          {/* Modal body confirming if user wants to allow all users to create games */}
          <div>
            <Modal.Title>
              Are you sure you want to allow all users to create games?
            </Modal.Title>
            <br />
            <Button
              style={{ marginLeft: '120px' }}
              variant='danger'
              onClick={allowAllCreateGames}
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: '50px' }}
              variant='info'
              onClick={closeAdditionalSettingsModal}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      ) : null}
      {type === 'inviteUsers' ? (
        <Modal.Body>
          {/* Modal body confirming if user wants to delete group */}
          <div>
            <Modal.Title>
              Are you sure you want to allow all users to invite users?
            </Modal.Title>
            <br />
            <Button
              style={{ marginLeft: '120px' }}
              variant='danger'
              onClick={allowAllInviteUsers}
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: '50px' }}
              variant='info'
              onClick={closeAdditionalSettingsModal}
            >
              No
            </Button>
          </div>
        </Modal.Body>
      ) : null}
      {redirect ? <Redirect to='/dashboard' /> : null}
    </Modal>
  )
}

export default GameSettings
