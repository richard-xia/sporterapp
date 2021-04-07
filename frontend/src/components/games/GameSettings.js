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
import SettingsModal from './AdditionalSettingsModal'
import DateTimePicker from 'react-datetime-picker'

/*******************************************************************************
 * GameSettings Component
 * Modal component for changing the information of a game
 *******************************************************************************/

function GameSettings({
  game,
  title,
  description,
  team1,
  team2,
  showGameSettings,
  handleClose,
  onGameUpdate,
  setGameWinner,
}) {
  //State for showing or hiding current settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  //State of current game information
  const [gameTitle, setGameTitle] = useState(title)
  const [gameDescription, setGameDescription] = useState(description)
  const [gamePhoto, setGamePhoto] = useState(game.photo)
  const [time, setTime] = useState(new Date())
  //Checks if the user selects FinishGame or DeleteGame
  const [finishGame, setFinishGame] = useState(false)
  const [deleteGame, setDeleteGame] = useState(false)
  //Hides the GameSettings modal when the additional SettingsModal is opened
  const [modalVisibility, setModalVisibility] = useState('visible')
  const [error, setError] = useState('') //Contains the error message if the user provides an incorrect field

  //Handler for closing the SettingsModal
  function closeSettingsModal() {
    setShowSettingsModal(false)
    setModalVisibility('visible')
    setDeleteGame(false)
    setFinishGame(false)
  }

  //Handler for changing the title and description of the game
  const handleTitleChange = (e) => {
    setGameTitle(e.target.value)
  }
  const handleDescriptionChange = (e) => {
    setGameDescription(e.target.value)
  }

  //Update the game photo using the UploadImage component
  function onUploadImage(image) {
    setGamePhoto(image)
  }

  //Handles changes when user clicks on the 'Save Changes' button
  function saveChanges() {
    let valid = true
    const gameData = {
      title: gameTitle,
      description: gameDescription,
      photo: gamePhoto,
      time: time,
    }
    axios
      .put(`/api/v1/games/${game._id}`, gameData)
      .catch((err) => {
        setError(err.response.data.error.split(': ')[2])
        valid = false
      })
      .then(() => {
        if (valid) {
          onGameUpdate(gameTitle, gameDescription, gamePhoto, time)
          handleClose()
        }
      })
  }

  //Opens the additional SettingsModal for deleting games and finishing games
  function openAdditionalSettings(setting) {
    setModalVisibility('hidden')
    setShowSettingsModal(true)
    if (setting === 'deleteGame') {
      setDeleteGame(true)
    }
    if (setting === 'finishGame') {
      setFinishGame(true)
    }
  }

  return (
    <Modal show={showGameSettings} onHide={handleClose}>
      <div style={{ contentVisibility: modalVisibility }}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        {/* Modal body contains settings for changing the photo, name, description and time of the game */}
        <Modal.Body>
          {error === '' ? null : <Alert variant={'danger'}>{error}</Alert>}
          <label>Change Game Picture</label>
          <br />
          <Image
            style={{ height: '100px', marginLeft: '175px' }}
            src={`${baseURL}/uploads/${gamePhoto}`}
            alt=''
          />
          <InputGroup className='mb-3'>
            <UploadImage onUploadImage={onUploadImage} />
          </InputGroup>
          <InputGroup className='mb-3' key='title'>
            <InputGroup.Prepend>
              <InputGroup.Text>Game Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              defaultValue={title}
              onChange={handleTitleChange}
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
          <InputGroup className='mb-3' key='time'>
            <InputGroup.Prepend>
              <InputGroup.Text>Time</InputGroup.Text>
            </InputGroup.Prepend>
            <DateTimePicker
              onChange={setTime}
              value={time}
              maxDetail={'minute'}
            />
          </InputGroup>
          <Button
            variant='success'
            style={{ borderRadius: '5px' }}
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </Modal.Body>
        {/* Modal footer contains settings for finishing and deleting game */}
        <Modal.Footer>
          {game.competitive ? (
            <Button
              style={{ marginRight: '50px', borderRadius: '5px' }}
              variant='info'
              onClick={() => openAdditionalSettings('finishGame')}
            >
              Finish Game
            </Button>
          ) : null}
          {finishGame ? (
            <SettingsModal
              showSettingsModal={showSettingsModal}
              closeSettingsModal={closeSettingsModal}
              handleClose={handleClose}
              type={'finishGame'}
              game={game}
              team1={team1}
              team2={team2}
              setGameWinner={setGameWinner}
            />
          ) : null}
          <Button
            style={{ marginRight: '80px', borderRadius: '5px' }}
            variant='danger'
            onClick={() => openAdditionalSettings('deleteGame')}
          >
            Delete Game
          </Button>
          {deleteGame ? (
            <SettingsModal
              showSettingsModal={showSettingsModal}
              closeSettingsModal={closeSettingsModal}
              handleClose={handleClose}
              type={'deleteGame'}
              game={game}
              team1={team1}
              team2={team2}
              setGameWinner={setGameWinner}
            />
          ) : null}
        </Modal.Footer>
      </div>
    </Modal>
  )
}

export default GameSettings
