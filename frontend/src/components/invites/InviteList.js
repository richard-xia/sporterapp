import React from 'react'
import Invite from './Invite'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import '../scrollbar.css'

/************************************************************************************
 * InviteList Component
 * Container component with a list of all invites a user has received inside UserInfo
 ************************************************************************************/

function InviteList({ invites, model, removeInvite, addModel }) {
  const scrollContainerStyle = { width: '470px', maxHeight: '200px' }

  return (
    <MDBContainer>
      <ListGroup
        className='scrollbar scrollbar-primary mx-auto'
        style={scrollContainerStyle}
      >
        {invites.map((invite) => (
          <ListGroup.Item key={invite._id} style={{ height: '75px' }}>
            <Invite
              key={invite._id}
              invite={invite}
              model={model}
              removeInvite={removeInvite}
              addModel={addModel}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </MDBContainer>
  )
}

export default InviteList
