import React from 'react'
import InviteUser from './InviteUser'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import '../scrollbar.css'

/*******************************************************************************
 * InviteUserList Component
 * Container for list of users to send an invite inside GroupInfo and GameInfo
 *******************************************************************************/

function InviteUserList({ users, modelType, modelId, removeInviteUser }) {
  const scrollContainerStyle = { width: '470px', maxHeight: '200px' }
  return (
    <MDBContainer>
      <ListGroup
        className='scrollbar scrollbar-primary mx-auto'
        style={scrollContainerStyle}
      >
        {users.map((user) => (
          <ListGroup.Item key={user._id}>
            <InviteUser
              key={user._id}
              user={user}
              modelType={modelType}
              modelId={modelId}
              removeInviteUser={removeInviteUser}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </MDBContainer>
  )
}

export default InviteUserList
