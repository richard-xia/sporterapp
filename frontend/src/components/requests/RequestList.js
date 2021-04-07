import React from 'react'
import Request from './Request'
import { ListGroup } from 'react-bootstrap'
import { MDBContainer } from 'mdbreact'
import '../scrollbar.css'

/*******************************************************************************
 * RequestList Component
 * Container component with the list of requests inside GroupInfo and GameInfo
 *******************************************************************************/

function RequestList({
  requests,
  requestType,
  typeId,
  deleteRequest,
  addUser,
}) {
  const scrollContainerStyle = { width: '470px', maxHeight: '200px' }
  return (
    <MDBContainer>
      <ListGroup
        className='scrollbar scrollbar-primary mx-auto'
        style={scrollContainerStyle}
      >
        {requests.map((request) => (
          <ListGroup.Item key={request._id}>
            <Request
              key={request._id}
              request={request}
              requestType={requestType}
              typeId={typeId}
              deleteRequest={deleteRequest}
              addUser={addUser}
            />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </MDBContainer>
  )
}

export default RequestList
