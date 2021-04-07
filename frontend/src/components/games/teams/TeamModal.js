import React, { useState } from 'react'
import { Button, Image, InputGroup, Modal, FormControl } from 'react-bootstrap'
import TeamModalList from './TeamModalList'
import UploadImage from '../../UploadImage'
import axios, { baseURL } from '../../../axios'

/*******************************************************************************
 * TeamModal Component
 * Opens the team settings when user clicks on 'Edit Team' in TeamList Component
 *******************************************************************************/

function TeamModal({
  otherUsers,
  team1,
  team2,
  setTeam1Users,
  setTeam2Users,
  setNoTeamUsers,
  game,
  currentTeam,
  showModal,
  handleClose,
  onTeamUpdate,
}) {
  //Handles the state of the current team's photo
  const [team1Photo, setTeam1Photo] = useState(team1.photo)
  const [team2Photo, setTeam2Photo] = useState(team2.photo)
  function onUploadImage(image) {
    if (currentTeam === 'team1') {
      setTeam1Photo(image)
    } else {
      setTeam2Photo(image)
    }
  }

  //Handles the state of the current team's name
  const [team1Name, setTeam1Name] = useState(team1.name)
  const [team2Name, setTeam2Name] = useState(team2.name)
  const handleTeamNameChange = (e) => {
    if (currentTeam === 'team1') {
      setTeam1Name(e.target.value)
    }
    if (currentTeam === 'team2') {
      setTeam2Name(e.target.value)
    }
  }

  //Function to update team data when user clicks on 'Save Changes'
  function saveChanges() {
    let gameData
    if (currentTeam === 'team1') {
      gameData = {
        team1: { name: team1Name, photo: team1Photo },
      }
      onTeamUpdate(team1Name, team1Photo, 'team1')
    }
    if (currentTeam === 'team2') {
      gameData = {
        team2: { name: team2Name, photo: team2Photo },
      }
      onTeamUpdate(team2Name, team2Photo, 'team2')
    }
    axios.put(`/api/v1/games/${game}`, gameData)
    handleClose()
  }

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {currentTeam === 'team1' ? team1.name : team2.name}
        </Modal.Title>
      </Modal.Header>
      {/* Modal body contains settings for changing team photo and name  */}
      <Modal.Body>
        {currentTeam === 'team1' ? (
          <Image
            src={`${baseURL}/uploads/${team1.photo}`}
            style={{ height: '50px', width: '50px', marginLeft: '195px' }}
          />
        ) : (
          <Image
            src={`${baseURL}/uploads/${team2.photo}`}
            style={{ height: '50px', width: '50px', marginLeft: '195px' }}
          />
        )}
        <InputGroup className='mb-3'>
          <UploadImage onUploadImage={onUploadImage} />
        </InputGroup>
        <InputGroup className='mb-3'>
          <InputGroup.Prepend>
            <InputGroup.Text id='basic-addon1'>Team Name</InputGroup.Text>
          </InputGroup.Prepend>
          {currentTeam === 'team1' ? (
            <FormControl
              placeholder={team1.name}
              onChange={handleTeamNameChange}
              aria-describedby='basic-addon1'
            />
          ) : (
            <FormControl
              placeholder={team2.name}
              onChange={handleTeamNameChange}
              aria-describedby='basic-addon1'
            />
          )}
        </InputGroup>
        <Button
          onClick={saveChanges}
          style={{ borderRadius: '5px' }}
          variant='success'
        >
          Save Changes
        </Button>
      </Modal.Body>
      {/* Modal footer contains settings for changing team members */}
      <Modal.Footer>
        <TeamModalList
          otherUsers={otherUsers}
          team1={team1}
          team2={team2}
          setTeam1Users={setTeam1Users}
          setTeam2Users={setTeam2Users}
          setNoTeamUsers={setNoTeamUsers}
          currentTeam={currentTeam}
          game={game}
        />
      </Modal.Footer>
    </Modal>
  )
}

export default TeamModal
