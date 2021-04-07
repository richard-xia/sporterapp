import React, { useState } from 'react'
import {
  Alert,
  Button,
  Image,
  Modal,
  InputGroup,
  FormControl,
} from 'react-bootstrap'
import axios, { baseURL } from '../../axios'
import { Redirect } from 'react-router'

import SportList from '../SportList'

/*******************************************************************************
 * CreateGroupForm Component
 * Modal for creating a new game in the Dashboard component
 *******************************************************************************/

function CreateGroupForm({ showGroupModal, handleClose }) {
  //Contains the state of the name and description input
  const [state, setState] = useState({
    name: '',
    description: '',
  })
  const [groupId, setGroupId] = useState('') //The groupId of the created group for redirecting the user
  const [submit, setSubmit] = useState(false) //Redirect the user when they submit the group form
  const [privateGroup, setPrivateGroup] = useState(false) //State of whether the group is private
  const [competitiveGroup, setCompetitiveGroup] = useState(true) //State of whether the group is competitive
  const [error, setError] = useState('') //Contains the error message if the user provides an incorrect field
  const [sports, setSports] = useState([])
  const [showPrivateInfo, setShowPrivateInfo] = useState(false)
  const [showCompetitiveInfo, setShowCompetitiveInfo] = useState(false)

  //Handles changes to input of group name and description
  const handleChange = (e) => {
    const { id, value } = e.target
    setState((prevState) => ({ ...prevState, [id]: value }))
  }

  //Handles changes to checkbox of private and competitive group
  const handlePrivateChange = (e) => {
    setPrivateGroup(e.target.checked)
  }
  const handleCompetitiveChange = (e) => {
    setCompetitiveGroup(e.target.checked)
  }

  function updateSports(newSportsList) {
    setSports(newSportsList)
  }

  //Create group with the information in the form
  const createGroup = () => {
    const groupData = {
      name: state.name,
      description: state.description,
      private: privateGroup,
      competitive: competitiveGroup,
      sports: sports,
    }
    if (sports.length > 3) {
      setError('You can only select up to 3 sports')
    } else if (sports.length < 1) {
      setError('You must select at least 1 sport')
    } else {
      axios
        .post('/api/v1/groups', groupData)
        .then((res) => {
          setGroupId(res.data.data.id)
          setSubmit(true)
        })
        .catch((err) => {
          const error = err.response.data.error.split(': ')[2]
          setError(error)
        })
    }
  }

  return (
    <Modal show={showGroupModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create new group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Modal body contains the name, description as well as private and competitive settings */}
        {error === '' ? null : <Alert variant={'danger'}>{error}</Alert>}
        <label>Group Name</label>
        <InputGroup className='mb-3'>
          <FormControl
            onChange={handleChange}
            id='name'
            value={state.name}
            placeholder='(6 - 30 characters)'
          ></FormControl>
        </InputGroup>
        <label>Group Description</label>
        <InputGroup className='mb-3'>
          <FormControl
            onChange={handleChange}
            id='description'
            value={state.description}
            placeholder='(optional)'
          ></FormControl>
        </InputGroup>
        {/* Display the list of sports */}
        <label>Sport(s) (select 1 to 3):</label>
        <SportList updateSports={updateSports} sports={sports} />
        {/* Options for private groups */}
        <InputGroup>
          <InputGroup.Checkbox onChange={handlePrivateChange} sports={sports} />
          <InputGroup.Append>
            <InputGroup.Text>Private</InputGroup.Text>
          </InputGroup.Append>
          <Image
            as={InputGroup.Append}
            src={`${baseURL}/uploads/question-circle-regular.svg`}
            style={{
              maxHeight: '25px',
              marginTop: '10px',
              marginLeft: '5px',
              color: 'blue',
              cursor: 'pointer',
            }}
            onClick={() => setShowPrivateInfo(!showPrivateInfo)}
          />
          {showPrivateInfo ? (
            <Alert variant='info'>
              Private groups will not be shown in the map or search bar.
            </Alert>
          ) : null}
        </InputGroup>
        {/* Options for competitive groups */}
        <InputGroup>
          <InputGroup.Checkbox
            defaultChecked={true}
            onChange={handleCompetitiveChange}
          />
          <InputGroup.Append>
            <InputGroup.Text>Competitive</InputGroup.Text>
          </InputGroup.Append>
          <Image
            as={InputGroup.Append}
            src={`${baseURL}/uploads/question-circle-regular.svg`}
            style={{
              maxHeight: '25px',
              marginTop: '10px',
              marginLeft: '5px',
              color: 'blue',
              cursor: 'pointer',
            }}
            onClick={() => setShowCompetitiveInfo(!showCompetitiveInfo)}
          />
          {showCompetitiveInfo ? (
            <Alert variant='info'>
              Competitive games have teams and will update wins and losses when
              finished
            </Alert>
          ) : null}
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant='success'
          style={{ borderRadius: '5px' }}
          onClick={createGroup}
        >
          Create Group
        </Button>
      </Modal.Footer>
      {submit ? <Redirect to={`/api/v1/groups/${groupId}`} /> : null}
    </Modal>
  )
}

export default CreateGroupForm
