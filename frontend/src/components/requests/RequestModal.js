import React, { useState } from 'react'
import axios from '../../axios'
import { Button, Modal, InputGroup, FormControl } from 'react-bootstrap'

/***********************************************************************************
 * RequestModal Component
 * Modal for sending a message with the user's request inside GroupInfo and GameInfo
 ***********************************************************************************/

function RequestModal({
  modalType,
  modalId,
  showRequestModal,
  closeRequestModal,
  makeRequest,
}) {
  //State of request message and handler for message change
  const [message, setMessage] = useState()
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  // Send the request to join the modalType (groups/games)
  function requestToJoinGroup() {
    const reqBody = { message: message }
    axios
      .post(`/api/v1/${modalType}/${modalId}/request`, reqBody)
      .then((res) => {
        makeRequest()
        closeRequestModal()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Modal show={showRequestModal} onHide={closeRequestModal}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup className='mb-3' key='description'>
          <InputGroup.Prepend>
            <InputGroup.Text>Message</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            as='textarea'
            onChange={handleMessageChange}
          ></FormControl>
        </InputGroup>
        <Button variant='success' onClick={requestToJoinGroup}>
          Make Request
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default RequestModal
