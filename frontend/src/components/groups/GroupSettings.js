import React, { useState } from 'react'
import axios, { baseURL } from '../../axios'
import {
  Alert,
  Button,
  Image,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap'

import AdditionalSettingsModal from './AdditionalSettingsModal'
import UploadImage from '../UploadImage'

/*******************************************************************************
 * GroupSettings Component
 * Component for updating the information of a group
 *******************************************************************************/

function GroupSettings({
  group,
  name,
  description,
  showGroupSettings,
  handleClose,
  onGroupUpdate,
}) {
  //Contains the state of the group's name, description and photo
  const [groupName, setGroupName] = useState(name)
  const [groupDescription, setGroupDescription] = useState(description)
  const [groupPhoto, setGroupPhoto] = useState(group.photo)

  //Additional settings modal to confirm deleting group
  const [
    showAdditionalSettingsModal,
    setShowAdditionalSettingsModal,
  ] = useState(false)
  const [additionalSettings, setAdditionalSettings] = useState('')
  //Hide modal visibility when openning additional settings
  const [modalVisibility, setModalVisibility] = useState('visible')
  const [error, setError] = useState('') //Contains the error message if the user provides an incorrect field

  //Handle changes to the group name, description and photo
  const handleNameChange = (e) => {
    setGroupName(e.target.value)
  }
  const handleDescriptionChange = (e) => {
    setGroupDescription(e.target.value)
  }
  function onUploadImage(image) {
    setGroupPhoto(image)
  }

  //Save changes to the group information when clicked
  function saveChanges() {
    let valid = true
    const groupData = {
      name: groupName,
      description: groupDescription,
      photo: groupPhoto,
    }
    axios
      .put(`/api/v1/groups/${group._id}`, groupData)
      .catch((err) => {
        setError(err.response.data.error.split(': ')[2])
        valid = false
      })
      .then(() => {
        if (valid) {
          onGroupUpdate(groupName, groupDescription, groupPhoto)
          handleClose()
        }
      })
  }

  function openAdditionalSettingsModal(type) {
    setModalVisibility('hidden')
    setAdditionalSettings(type)
    setShowAdditionalSettingsModal(true)
  }

  //Close the additional settings modal for deleting group
  function closeAdditionalSettingsModal() {
    setModalVisibility('visible')
    setShowAdditionalSettingsModal(false)
  }

  return (
    <Modal show={showGroupSettings} onHide={handleClose}>
      <div style={{ contentVisibility: modalVisibility }}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Modal body contains input for changing the group photo, name and description */}
          {error === '' ? null : <Alert variant={'danger'}>{error}</Alert>}
          <label>Change Group Picture</label>
          <br />
          <Image
            style={{ height: '100px', marginLeft: '150px' }}
            src={`${baseURL}/uploads/${groupPhoto}`}
            alt=''
          />
          <InputGroup className='mb-3'>
            <UploadImage onUploadImage={onUploadImage} />
          </InputGroup>
          <InputGroup className='mb-3' key='name'>
            <InputGroup.Prepend>
              <InputGroup.Text>Group Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              defaultValue={name}
              onChange={handleNameChange}
            ></FormControl>
          </InputGroup>
          <InputGroup className='mb-3' key='description'>
            <InputGroup.Prepend>
              <InputGroup.Text>Description</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              as='textarea'
              defaultValue={description}
              onChange={handleDescriptionChange}
            ></FormControl>
          </InputGroup>
          <div style={{ display: 'flex' }}>
            <Button
              variant='info'
              style={{
                borderRadius: '5px',
                width: '200px',
                marginRight: '50px',
                marginLeft: '10px',
              }}
              onClick={() => openAdditionalSettingsModal('createGames')}
            >
              Allow all users to create games
            </Button>
            <Button
              variant='info'
              style={{ borderRadius: '5px', width: '200px' }}
              onClick={() => openAdditionalSettingsModal('inviteUsers')}
            >
              Allow all users to invite users
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='danger'
            onClick={() => openAdditionalSettingsModal('delete')}
          >
            Delete Group
          </Button>
          <Button variant='primary' onClick={saveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
        <AdditionalSettingsModal
          group={group}
          type={additionalSettings}
          showAdditionalSettingsModal={showAdditionalSettingsModal}
          closeAdditionalSettingsModal={closeAdditionalSettingsModal}
        />
      </div>
    </Modal>
  )
}

export default GroupSettings
