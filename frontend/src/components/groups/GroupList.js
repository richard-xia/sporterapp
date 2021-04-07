import React from 'react'
import Group from './Group'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import '../scrollbar.css'

/*******************************************************************************
 * GroupList Component
 * Container for displaying the list of groups
 *******************************************************************************/

function GroupList({ groups }) {
  const scrollContainerStyle = { width: '470px', maxHeight: '200px' }
  return (
    <MDBContainer>
      <ListGroup
        className='scrollbar scrollbar-primary mx-auto'
        style={scrollContainerStyle}
      >
        {groups.map((group) => (
          <ListGroup.Item style={{ height: '65px' }} key={group._id}>
            <Group group={group} disableHover={false} />
          </ListGroup.Item>
        ))}
        {groups.length < 1 ? (
          <ListGroup.Item style={{ height: '65px' }}>
            <p style={{ marginTop: '6px' }}>No groups to display</p>
          </ListGroup.Item>
        ) : null}
      </ListGroup>
    </MDBContainer>
  )
}

export default GroupList
