import React, { useState } from 'react'
import axios from '../../axios'
import classes from './Request.module.css'
import { Image } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { baseURL } from '../../axios'

import ViewModal from '../ViewModal'

/*******************************************************************************
 * Request Component
 * Component for accepting or denying requests in GroupInfo and GameInfo
 *******************************************************************************/

const Request = ({ request, requestType, typeId, deleteRequest, addUser }) => {
  const [viewRequestModal, setViewRequestModal] = useState(false)

  function closeViewRequestModal() {
    setViewRequestModal(false)
  }

  //Accept request of the requestType (groups/games)
  const acceptRequest = (requestId) => {
    axios
      .put(`/api/v1/${requestType}/${typeId}/request/${request._id}`)
      .then((res) => {
        deleteRequest(requestId)
        addUser(res.data.data, request.user)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }

  //Deny request of the requestType (groups/games)
  const denyRequest = (requestId) => {
    axios
      .delete(`/api/v1/${requestType}/${typeId}/request/${request._id}`)
      .then(() => {
        deleteRequest(requestId)
      })
      .catch((err) => {
        console.log(`err : ${err}`)
      })
  }

  return (
    <div className={classes.container}>
      {/* Display the user photo, name and request message */}
      <div className={classes.info}>
        <LinkContainer
          to={{
            pathname: `/api/v1/users/${request.user}`,
          }}
        >
          <div>
            <Image
              className={classes.icon}
              src={`${baseURL}/uploads/${request.photo}`}
              style={{ height: '40px', width: '40px' }}
              roundedCircle
            />
            <p className={classes.name}>{request.name}</p>
          </div>
        </LinkContainer>
        <p
          className={classes.message}
          onClick={() => setViewRequestModal(true)}
        >
          {request.message}{' '}
        </p>
        <ViewModal
          showViewModal={viewRequestModal}
          closeViewModal={closeViewRequestModal}
          info={request.message}
          title={request.name}
          photo={request.photo}
          id={request.user}
          type={'users'}
        />
      </div>
      <div className={classes.options}>
        {/* Options of accepting and denying request */}
        <FontAwesomeIcon
          className={classes.acceptIcon}
          icon={faCheckCircle}
          onClick={() => acceptRequest(request._id)}
        />
        <FontAwesomeIcon
          className={classes.denyIcon}
          icon={faTimesCircle}
          onClick={() => denyRequest(request._id)}
        />
        <br></br>
      </div>
    </div>
  )
}

export default Request
