import React, { useState } from 'react'
import {
  Alert,
  Button,
  Image,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import UploadImage from '../UploadImage'
import axios, { baseURL } from '../../axios'

/*********************************************************************
 * UserSettings Component
 * Modal component for changing the photo or description of the user
 *********************************************************************/

function UserSettings({ user, showUserSettings, handleClose, onUserUpdate }) {
  //State for the user's description and photo input
  const [userDescription, setUserDescription] = useState(user.description)
  const [userPhoto, setUserPhoto] = useState(user.photo)
  const [privateUser, setPrivateUser] = useState(user.private)
  const [error, setError] = useState('') //Contains the error message if the user provides an incorrect field

  //Handle changes to the user's description or photo
  const handleDescriptionChange = (e) => {
    setUserDescription(e.target.value)
  }

  //Save the changes to the user's information
  function saveChanges() {
    let valid = true
    const userData = {
      description: userDescription,
      photo: userPhoto,
      private: privateUser,
    }
    axios
      .put(`/api/v1/users/${user._id}`, userData)
      .catch((err) => {
        setError(err.response.data.error.split(': ')[2])
        valid = false
      })
      .then(() => {
        if (valid) {
          onUserUpdate(userDescription, userPhoto)
          handleClose()
        }
      })
  }

  function onUploadImage(image) {
    setUserPhoto(image)
  }

  const handlePrivateChange = (e) => {
    setPrivateUser(e.target.checked)
  }

  return (
    <Modal show={showUserSettings} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error === '' ? null : <Alert variant={'danger'}>{error}</Alert>}
        {/* Modal body includes input for photo and description of user */}
        <label>Change Profile Picture</label>
        <br />
        <Image
          style={{
            height: '100px',
            width: '100px',
            marginLeft: '175px',
            marginBottom: '10px',
            objectFit: 'cover',
          }}
          src={`${baseURL}/uploads/${userPhoto}`}
          roundedCircle
        />
        <InputGroup className='mb-3'>
          <UploadImage onUploadImage={onUploadImage} />
        </InputGroup>
        <InputGroup className='mb-3' key='description'>
          <InputGroup.Prepend>
            <InputGroup.Text>Bio</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            as='textarea'
            defaultValue={user.description}
            onChange={handleDescriptionChange}
          ></FormControl>
        </InputGroup>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Private</InputGroup.Text>
          </InputGroup.Prepend>
          <InputGroup.Checkbox
            defaultChecked={privateUser}
            onChange={handlePrivateChange}
          />
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='success'
          style={{ borderRadius: '5px' }}
          onClick={saveChanges}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserSettings
