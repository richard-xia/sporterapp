import React, { useState, useEffect } from 'react'
import { Button, Modal, InputGroup } from 'react-bootstrap'
import axios from '../../axios'

/*****************************************************************************************
 * UserRoleModal Component
 * Modal component for changing the current role of the user inside GroupInfo and GameInfo
 *****************************************************************************************/

function UserRoleModal({
  user,
  model,
  modelId,
  showUserRoleModal,
  handleClose,
}) {
  //State of role options
  const [canManageUsers, setCanManageUsers] = useState(false)
  const [canCreateGames, setCanCreateGames] = useState(false)
  const [canManageTeams, setCanManageTeams] = useState(false)
  const [canInviteUsers, setCanInviteUsers] = useState(false)

  //Handle changes to user role options
  const handleChangeManageUsers = (e) => {
    setCanManageUsers(e.target.checked)
  }
  const handleChangeCreateGames = (e) => {
    setCanCreateGames(e.target.checked)
  }
  const handleChangeManageTeams = (e) => {
    setCanManageTeams(e.target.checked)
  }
  const handleChangeInviteUsers = (e) => {
    setCanInviteUsers(e.target.checked)
  }

  //Set the state of the current user's role
  useEffect(() => {
    if (user.role.includes('manageUsers')) {
      setCanManageUsers(true)
    }
    if (user.role.includes('createGames')) {
      setCanCreateGames(true)
    }
    if (user.role.includes('manageTeams')) {
      setCanManageTeams(true)
    }
    if (user.role.includes('inviteUsers')) {
      setCanInviteUsers(true)
    }
  }, [user.role])

  //Handles changes to the user's role
  function changeRoles() {
    let roles = []
    if (user.role.includes('creator')) {
      roles.push('creator')
    }
    if (canManageUsers) {
      roles.push('manageUsers')
    }
    if (canCreateGames) {
      roles.push('createGames')
    }
    if (canManageTeams) {
      roles.push('manageTeams')
    }
    if (canInviteUsers) {
      roles.push('inviteUsers')
    }
    axios
      .put(`/api/v1/${model}/${modelId}/users/${user._id}`, { role: roles })
      .then((res) => {
        handleClose()
      })
  }

  return (
    <Modal show={showUserRoleModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{user.name}</Modal.Title>
      </Modal.Header>
      {/* Display role options for GroupInfo */}
      {model === 'groups' ? (
        <Modal.Body>
          <InputGroup>
            <InputGroup.Checkbox
              defaultChecked={canManageUsers}
              onChange={handleChangeManageUsers}
            />
            <InputGroup.Append>
              <InputGroup.Text>Manage Users</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup>
            <InputGroup.Checkbox
              defaultChecked={canCreateGames}
              onChange={handleChangeCreateGames}
            />
            <InputGroup.Append>
              <InputGroup.Text>Create Games</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup>
            <InputGroup.Checkbox
              defaultChecked={canInviteUsers}
              onChange={handleChangeInviteUsers}
            />
            <InputGroup.Append>
              <InputGroup.Text>Invite Users</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      ) : null}
      {/* Display role options for GameInfo */}
      {model === 'games' ? (
        <Modal.Body>
          <InputGroup>
            <InputGroup.Checkbox
              defaultChecked={canManageUsers}
              onChange={handleChangeManageUsers}
            />
            <InputGroup.Append>
              <InputGroup.Text>Manage Users</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup>
            <InputGroup.Checkbox
              defaultChecked={canManageTeams}
              onChange={handleChangeManageTeams}
            />
            <InputGroup.Append>
              <InputGroup.Text>Manage Teams</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <InputGroup>
            <InputGroup.Checkbox
              defaultChecked={canInviteUsers}
              onChange={handleChangeInviteUsers}
            />
            <InputGroup.Append>
              <InputGroup.Text>Invite Users</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
        </Modal.Body>
      ) : null}
      <Modal.Footer>
        <Button variant='primary' onClick={changeRoles}>
          Change Roles
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserRoleModal
