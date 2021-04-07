import React, { useState } from 'react'
import axios, { baseURL } from '../../axios'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Image, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTimes, faUserShield } from '@fortawesome/free-solid-svg-icons'

import UserRoleModal from './UserRoleModal'
import classes from './User.module.css'

/*****************************************************************************************************
 * User Component
 * Component with the user information including role and delete buttons inside GroupInfo and GameInfo
 *****************************************************************************************************/

const User = ({
  user,
  model,
  modelId,
  removeUser,
  role,
  competitive,
  winner,
}) => {
  //Handle state for showing modal to change the role of user
  const [showUserRoleModal, setShowUserRoleModal] = useState(false)
  const handleClose = () => {
    setShowUserRoleModal(false)
  }
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const closeDeleteUserModal = () => {
    setShowDeleteUserModal(false)
  }

  //Delete user using delete icon
  const deleteUser = () => {
    axios
      .delete(`/api/v1/${model}/${modelId}/users/${user._id}`)
      .then((res) => {
        removeUser(user._id)
        closeDeleteUserModal()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <div>
      {model === 'teams' || model === 'search' ? (
        <LinkContainer
          to={{
            pathname: `/api/v1/users/${user._id}`,
          }}
        >
          <div>
            <Image
              className={classes.searchicon}
              src={`${baseURL}/uploads/${user.photo}`}
              roundedCircle
            />
            <p className={classes.searchName}>{user.name}</p>
          </div>
        </LinkContainer>
      ) : (
        <div className={classes.container}>
          {/* Contains the user's photo and name and link to the user */}
          <LinkContainer
            to={{
              pathname: `/api/v1/users/${user._id}`,
            }}
          >
            <div>
              <Image
                src={`${baseURL}/uploads/${user.photo}`}
                className={classes.usericon}
                roundedCircle
              />
              <div className={classes.user}>
                <p className={classes.userName}>{user.name}</p>
              </div>
            </div>
          </LinkContainer>
          {/* Display win/loss stats of user if component is GroupInfo */}
          <div className={classes.stats}>
            {model === 'groups' && competitive ? (
              <div style={{ display: 'flex' }}>
                <p style={{ color: 'green' }}>W:{user.wins}</p>
                <p>&nbsp;</p>
                <p style={{ color: 'red' }}> L:{user.losses}</p>
              </div>
            ) : null}
          </div>
          {/* Show delete and role button for all users if current user is creator  */}
          <div className={classes.delete}>
            {role.includes('creator') &&
            !user.role.includes('creator') &&
            !winner ? (
              <div>
                <FontAwesomeIcon
                  className={classes.roleicon}
                  icon={faUserShield}
                  onClick={() => setShowUserRoleModal(true)}
                />
                <UserRoleModal
                  user={user}
                  model={model}
                  modelId={modelId}
                  showUserRoleModal={showUserRoleModal}
                  handleClose={handleClose}
                />
                <FontAwesomeIcon
                  className={classes.deleteicon}
                  icon={faUserTimes}
                  onClick={() => setShowDeleteUserModal(true)}
                />
                <Modal show={showDeleteUserModal} onHide={closeDeleteUserModal}>
                  <Modal.Header>
                    <Modal.Title>
                      Are you sure you want to delete {user.name} from the
                      group?
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    This will remove all their information including wins and
                    losses
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      style={{ marginRight: '100px' }}
                      variant={'info'}
                      onClick={deleteUser}
                    >
                      Yes
                    </Button>
                    <Button
                      style={{ marginRight: '125px' }}
                      variant={'danger'}
                      onClick={closeDeleteUserModal}
                    >
                      No
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            ) : null}
            {/* Only show delete and role button for all users who cannot manage users  */}
            {role.includes('manageUsers') &&
            !role.includes('creator') &&
            !user.role.includes('manageUsers') &&
            !winner ? (
              <div>
                <FontAwesomeIcon
                  className={classes.roleicon}
                  icon={faUserShield}
                  onClick={() => setShowUserRoleModal(true)}
                />
                <UserRoleModal
                  user={user}
                  model={model}
                  modelId={modelId}
                  showUserRoleModal={showUserRoleModal}
                  handleClose={handleClose}
                />
                <FontAwesomeIcon
                  className={classes.deleteicon}
                  icon={faUserTimes}
                  onClick={() => setShowDeleteUserModal(true)}
                />
                <Modal show={showDeleteUserModal} onHide={closeDeleteUserModal}>
                  <Modal.Header>
                    <Modal.Title>
                      Are you sure you want to delete {user.name} from the
                      group?
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    This will remove all their information including wins and
                    losses
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      style={{ marginRight: '100px' }}
                      variant={'info'}
                      onClick={deleteUser}
                    >
                      Yes
                    </Button>
                    <Button
                      style={{ marginRight: '125px' }}
                      variant={'danger'}
                      onClick={closeDeleteUserModal}
                    >
                      No
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

export default User
