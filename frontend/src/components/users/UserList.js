import React from 'react'
import User from './User'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import '../scrollbar.css'

/*************************************************************************
 * UserList Component
 * Container component with a list of users inside GroupInfo and GameInfo
 *************************************************************************/

function UserList({
  users,
  model,
  modelId,
  removeUser,
  role,
  competitive,
  winner,
}) {
  const scrollContainerStyle = { width: '470px', maxHeight: '200px' }

  return (
    <MDBContainer>
      <ListGroup
        className='scrollbar scrollbar-primary mx-auto'
        style={scrollContainerStyle}
      >
        {users.map((user) => (
          <ListGroup.Item key={user._id}>
            <User
              user={user}
              model={model}
              modelId={modelId}
              removeUser={removeUser}
              role={role}
              competitive={competitive}
              winner={winner}
            />
          </ListGroup.Item>
        ))}
        {users.length < 1 ? (
          <ListGroup.Item style={{ height: '65px' }}>
            <p style={{ marginTop: '6px' }}>No users to display</p>
          </ListGroup.Item>
        ) : null}
      </ListGroup>
    </MDBContainer>
  )
}

export default UserList
